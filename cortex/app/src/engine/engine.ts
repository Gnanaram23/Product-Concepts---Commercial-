/**
 * Cortex query engine.
 *
 * question -> semantic plan -> SQL -> executed in the browser (AlaSQL) ->
 * table, chart and a written summary computed from the result.
 *
 * Every number in an answer comes from a query the user can inspect in the
 * SQL tab. With an LLM configured, the model writes the SQL instead of the
 * rule-based planner; the SQL is checked (read-only, known tables) and run
 * the same way, and the rule-based planner is used if anything fails.
 */
import { getDataset, QUARTERS, type Row } from "./dataset";
import { fmt, pctChange, type Format } from "./format";
import { generateSql, getLLMSettings } from "./llm";
import { AS_OF, aggregateSql, exceptionsSql, expiringSql, plan, waterfallSql, type Plan } from "./semantic";

export interface Column {
  key: string;
  label: string;
  format: Format;
}

export interface ChartSpec {
  type: "bar" | "line" | "waterfall";
  x: string;
  series: { key: string; label: string }[];
  data: Record<string, string | number>[];
  format: Format;
}

export interface TraceStep {
  step: string;
  detail: string;
  ms: number;
}

export interface Answer {
  text: string;
  sql?: string;
  columns: Column[];
  rows: Row[];
  chart?: ChartSpec;
  sources: { table: string; rows: number; certified: boolean; refreshed: string; owner: string }[];
  trace: TraceStep[];
  mode: "semantic" | "llm" | "restricted" | "catalog" | "help" | "upload";
  notes: string[];
}

type AlaSQL = ((sql: string) => unknown) & { tables: Record<string, { data: unknown[] }> };
let alasqlPromise: Promise<AlaSQL> | null = null;
const userTables: Record<string, Row[]> = {};

async function db(): Promise<AlaSQL> {
  if (!alasqlPromise) {
    alasqlPromise = import("alasql").then((mod) => {
      const alasql = ((mod as unknown as { default?: AlaSQL }).default ?? mod) as AlaSQL;
      const { tables } = getDataset();
      for (const [name, rows] of Object.entries(tables)) {
        alasql(`CREATE TABLE IF NOT EXISTS ${name}`);
        alasql.tables[name].data = rows;
      }
      return alasql;
    });
  }
  return alasqlPromise;
}

export async function registerUserTable(name: string, rows: Row[]) {
  const alasql = await db();
  userTables[name] = rows;
  alasql(`CREATE TABLE IF NOT EXISTS ${name}`);
  alasql.tables[name].data = rows;
}

export function listUserTables() {
  return Object.entries(userTables).map(([name, rows]) => ({ name, rows: rows.length, columns: rows.length ? Object.keys(rows[0]) : [] }));
}

async function run(sql: string): Promise<Row[]> {
  const alasql = await db();
  return alasql(sql) as Row[];
}

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

function sourcesFor(sql: string): Answer["sources"] {
  const { meta, tables } = getDataset();
  const out: Answer["sources"] = meta
    .filter((t) => new RegExp(`\\b${t.name}\\b`).test(sql))
    .map((t) => ({ table: t.name, rows: tables[t.name].length, certified: t.certified, refreshed: t.refreshed, owner: t.owner }));
  for (const u of listUserTables()) if (new RegExp(`\\b${u.name}\\b`).test(sql)) out.push({ table: u.name, rows: u.rows, certified: false, refreshed: "Uploaded", owner: "You" });
  return out;
}

const LABELS: Record<string, [string, Format]> = {
  segment: ["Customer segment", "text"],
  category: ["Product category", "text"],
  product: ["Product", "text"],
  region: ["Region", "text"],
  customer: ["Customer", "text"],
  contract: ["Contract", "text"],
  contract_id: ["Contract", "text"],
  quarter: ["Quarter", "text"],
  customer_name: ["Customer", "text"],
  customer_segment: ["Segment", "text"],
  end_date: ["Ends", "date"],
  renewal_type: ["Renewal", "text"],
  exception_clause: ["Exception clause", "text"],
  gross_sales: ["Gross sales", "currency"],
  gross_sales_2025: ["Gross sales 2025", "currency"],
  rebates_2025: ["Rebates 2025", "currency"],
  chargebacks: ["Chargebacks", "currency"],
  rebates: ["Rebates", "currency"],
  rebate_amount: ["Rebates", "currency"],
  admin_fees: ["Admin fees", "currency"],
  net_sales: ["Net sales", "currency"],
  gtn: ["Gross-to-net %", "percent"],
  net_price: ["Net price per unit", "price"],
  units: ["Units", "number"],
  contracts: ["Contracts", "number"],
};

function columnsFor(rows: Row[]): Column[] {
  if (!rows.length) return [];
  return Object.keys(rows[0]).map((k) => {
    const known = LABELS[k];
    if (known) return { key: k, label: known[0], format: known[1] };
    const sample = rows.find((r) => r[k] !== null && r[k] !== undefined)?.[k];
    return { key: k, label: k.replace(/_/g, " "), format: typeof sample === "number" ? "number" : "text" };
  });
}

function filterText(p: Plan) {
  return p.filters.length ? ` for ${p.filters.map((f) => f.label).join(", ")}` : "";
}

// ---------------------------------------------------------------------------
// Answer builders
// ---------------------------------------------------------------------------

async function answerAggregate(p: Plan, trace: TraceStep[]): Promise<Answer> {
  const m = p.measure!;
  const sql = aggregateSql(p);
  let t = now();
  const rows = await run(sql);
  trace.push({ step: "SQL agent", detail: `Ran the query: ${rows.length} rows returned`, ms: now() - t });

  t = now();
  const overallPlan: Plan = { ...p, dims: [], limit: undefined };
  const [overall] = await run(aggregateSql(overallPlan));
  const prevQs = p.window?.previous?.quarters;
  const prev = prevQs && !p.dims.some((d) => d.key === "quarter") ? (await run(aggregateSql(overallPlan, prevQs)))[0] : undefined;
  trace.push({ step: "Context", detail: prev ? `Totals for ${p.window!.label} and ${p.window!.previous!.label}` : `Total for ${p.window?.label}`, ms: now() - t });

  const total = Number(overall?.[m.key] ?? 0);
  const lines: string[] = [];
  const period = p.window?.label ?? "";
  const change = (a: number, b: number) =>
    m.format === "percent" ? `${a - b >= 0 ? "+" : ""}${(a - b).toFixed(1)} points` : pctChange(a, b);

  const nonTime = p.dims.find((d) => d.key !== "quarter");
  const hasTime = p.dims.some((d) => d.key === "quarter");
  let chart: ChartSpec | undefined;

  if (!p.dims.length) {
    lines.push(`**${m.label}${filterText(p)}, ${period}: ${fmt(total, m.format)}**`);
    if (prev) lines.push(`That is ${change(total, Number(prev[m.key]))} on ${p.window!.previous!.label} (${fmt(Number(prev[m.key]), m.format)}).`);
  } else if (nonTime && !hasTime) {
    const additive = m.format === "currency" || m.format === "number";
    lines.push(`**${m.label} by ${nonTime.label.toLowerCase()}${filterText(p)}, ${period}**`);
    lines.push(`${additive ? "Total" : "Overall"}: ${fmt(total, m.format)}${prev ? ` (${change(total, Number(prev[m.key]))} on ${p.window!.previous!.label})` : ""}.`);
    const top = rows.slice(0, 3);
    lines.push("");
    for (const r of top) {
      const v = Number(r[m.key]);
      lines.push(`- **${r[nonTime.key]}**: ${fmt(v, m.format)}${additive && total ? ` (${((v / total) * 100).toFixed(0)}% of total)` : ""}`);
    }
    if (rows.length > 3) lines.push(`- ${rows.length - 3} more in the table`);
    if (!additive && rows.length > 1) {
      const lo = rows[rows.length - 1];
      lines.push("", `Range: ${fmt(Number(lo[m.key]), m.format)} (${lo[nonTime.key]}) to ${fmt(Number(rows[0][m.key]), m.format)} (${rows[0][nonTime.key]}).`);
    }
    chart = { type: "bar", x: nonTime.key, series: [{ key: m.key, label: m.label }], data: rows as Record<string, string | number>[], format: m.format };
  } else if (hasTime && !nonTime) {
    const first = rows[0];
    const last = rows[rows.length - 1];
    lines.push(`**${m.label}${filterText(p)} by quarter, ${period}**`);
    if (first && last) {
      lines.push(`From ${fmt(Number(first[m.key]), m.format)} in ${first.quarter} to ${fmt(Number(last[m.key]), m.format)} in ${last.quarter} (${change(Number(last[m.key]), Number(first[m.key]))}).`);
      const peak = rows.reduce((a, b) => (Number(b[m.key]) > Number(a[m.key]) ? b : a));
      lines.push(`Peak: ${peak.quarter} at ${fmt(Number(peak[m.key]), m.format)}.`);
    }
    chart = { type: "line", x: "quarter", series: [{ key: m.key, label: m.label }], data: rows as Record<string, string | number>[], format: m.format };
  } else if (nonTime && hasTime) {
    // Pivot: one series per member of the non-time dimension.
    const members = [...new Set(rows.map((r) => String(r[nonTime.key])))];
    const quarters = [...new Set(rows.map((r) => String(r.quarter)))].sort();
    const data = quarters.map((q) => {
      const point: Record<string, string | number> = { quarter: q };
      for (const r of rows) if (r.quarter === q) point[String(r[nonTime.key])] = Number(r[m.key]);
      return point;
    });
    const moves = members
      .map((name) => {
        const a = Number(data[0]?.[name]);
        const b = Number(data[data.length - 1]?.[name]);
        return { name, a, b, d: m.format === "percent" ? b - a : (b - a) / Math.abs(a || 1) };
      })
      .filter((x) => Number.isFinite(x.a) && Number.isFinite(x.b))
      .sort((x, y) => y.d - x.d);
    lines.push(`**${m.label} by ${nonTime.label.toLowerCase()} and quarter${filterText(p)}, ${period}**`, "");
    for (const x of moves.slice(0, 6)) lines.push(`- **${x.name}**: ${fmt(x.a, m.format)} → ${fmt(x.b, m.format)} (${change(x.b, x.a)})`);
    if (moves.length > 1) lines.push("", `Biggest rise: ${moves[0].name}. Biggest fall or smallest rise: ${moves[moves.length - 1].name}.`);
    chart = { type: "line", x: "quarter", series: members.map((s) => ({ key: s, label: s })), data, format: m.format };
  }

  return {
    text: lines.join("\n"),
    sql,
    columns: columnsFor(rows).map((c) => (c.key === m.key ? { ...c, label: m.label, format: m.format } : c)),
    rows,
    chart,
    sources: sourcesFor(sql),
    trace,
    mode: "semantic",
    notes: p.notes,
  };
}

async function answerWaterfall(p: Plan, trace: TraceStep[]): Promise<Answer> {
  const sql = waterfallSql(p);
  const t = now();
  const rows = await run(sql);
  trace.push({ step: "SQL agent", detail: `Ran the gross-to-net query: ${rows.length} rows`, ms: now() - t });
  const lines: string[] = [];
  let chart: ChartSpec | undefined;

  if (!p.dims.length) {
    const r = rows[0];
    const g = Number(r.gross_sales);
    const share = (k: string) => `${((Number(r[k]) / g) * 100).toFixed(1)}%`;
    lines.push(`**Gross-to-net waterfall${filterText(p)}, ${p.window?.label}**`, "");
    lines.push(`- Gross sales at WAC: **${fmt(g, "currency")}**`);
    lines.push(`- Chargebacks: −${fmt(Number(r.chargebacks), "currency")} (${share("chargebacks")})`);
    lines.push(`- Rebates: −${fmt(Number(r.rebates), "currency")} (${share("rebates")})`);
    lines.push(`- Admin fees: −${fmt(Number(r.admin_fees), "currency")} (${share("admin_fees")})`);
    lines.push(`- Net sales: **${fmt(Number(r.net_sales), "currency")}**, a gross-to-net of **${fmt(Number(r.gtn), "percent")}**`);
    let running = g;
    const steps = [
      { name: "Gross sales", value: g, base: 0 },
      ...["chargebacks", "rebates", "admin_fees"].map((k) => {
        running -= Number(r[k]);
        return { name: LABELS[k][0], value: Number(r[k]), base: running };
      }),
      { name: "Net sales", value: Number(r.net_sales), base: 0 },
    ];
    chart = { type: "waterfall", x: "name", series: [{ key: "value", label: "Amount" }], data: steps, format: "currency" };
  } else {
    lines.push(`**Gross-to-net by contract, top ${rows.length} by gross sales${filterText(p)}, ${p.window?.label}**`, "");
    const sorted = [...rows].sort((a, b) => Number(b.gtn) - Number(a.gtn));
    const hi = sorted[0];
    const lo = sorted[sorted.length - 1];
    if (hi && lo) {
      lines.push(`- Deepest discount: **${hi.contract}** (${hi.customer}, ${hi.product}) at ${fmt(Number(hi.gtn), "percent")}`);
      lines.push(`- Shallowest: **${lo.contract}** (${lo.customer}, ${lo.product}) at ${fmt(Number(lo.gtn), "percent")}`);
      const totalG = rows.reduce((s, r) => s + Number(r.gross_sales), 0);
      const totalN = rows.reduce((s, r) => s + Number(r.net_sales), 0);
      lines.push(`- Together these contracts net ${fmt(totalN, "currency")} from ${fmt(totalG, "currency")} gross (${fmt(100 * (1 - totalN / totalG), "percent")} gross-to-net).`);
    }
    chart = {
      type: "bar",
      x: "contract",
      series: [
        { key: "net_sales", label: "Net sales" },
        { key: "rebates", label: "Rebates" },
        { key: "chargebacks", label: "Chargebacks" },
        { key: "admin_fees", label: "Admin fees" },
      ],
      data: rows as Record<string, string | number>[],
      format: "currency",
    };
  }
  return { text: lines.join("\n"), sql, columns: columnsFor(rows), rows, chart, sources: sourcesFor(sql), trace, mode: "semantic", notes: p.notes };
}

async function answerList(p: Plan, trace: TraceStep[]): Promise<Answer> {
  const sql = p.kind === "exceptions" ? exceptionsSql(p) : expiringSql(p);
  const t = now();
  const rows = await run(sql);
  trace.push({ step: "SQL agent", detail: `Ran the query: ${rows.length} contracts`, ms: now() - t });
  const lines: string[] = [];
  if (p.kind === "exceptions") {
    lines.push(`**${rows.length} contracts with exception clauses${p.keyword ? ` mentioning "${p.keyword}"` : ""}${filterText(p)}**`);
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(String(r.exception_clause), (counts.get(String(r.exception_clause)) ?? 0) + 1);
    lines.push("");
    for (const [clause, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) lines.push(`- ${clause}: ${n}`);
    const soon = rows.filter((r) => String(r.end_date) >= AS_OF && String(r.end_date) < "2027-01-01");
    if (soon.length) lines.push("", `${soon.length} of them end during 2026; review those clauses before renewal talks.`);
  } else {
    const g = rows.reduce((s, r) => s + Number(r.gross_sales_2025 ?? 0), 0);
    const reb = rows.reduce((s, r) => s + Number(r.rebates_2025 ?? 0), 0);
    lines.push(`**${rows.length} contracts end in the next ${p.months} months${filterText(p)}** (as of ${AS_OF})`);
    lines.push(`They carried ${fmt(g, "currency")} of gross sales and ${fmt(reb, "currency")} of rebates in 2025.`);
    const auto = rows.filter((r) => r.renewal_type === "Auto-renew").length;
    if (auto) lines.push(`${auto} renew automatically unless notice is given; check notice periods first.`);
  }
  return { text: lines.join("\n"), sql, columns: columnsFor(rows), rows, sources: sourcesFor(sql), trace, mode: "semantic", notes: [] };
}

function catalogAnswer(trace: TraceStep[]): Answer {
  const { meta, tables } = getDataset();
  const lines = ["**Data you can query**", ""];
  for (const t of meta) lines.push(`- **${t.name}** (${t.access === "granted" ? `${tables[t.name].length} rows` : "restricted"}): ${t.description}`);
  for (const u of listUserTables()) lines.push(`- **${u.name}** (uploaded, ${u.rows} rows): ${u.columns.join(", ")}`);
  lines.push("", "**Measures:** gross sales, net sales, rebates, chargebacks, admin fees, units, gross-to-net %, net price per unit, contract count.");
  lines.push("**Breakdowns:** customer segment, product, product category, region, customer, contract, quarter.");
  lines.push("**Periods:** a quarter (Q4 2025), a year (2024), last quarter, last N quarters or months.");
  return {
    text: lines.join("\n"),
    columns: [
      { key: "table", label: "Table", format: "text" },
      { key: "rows", label: "Rows", format: "number" },
      { key: "owner", label: "Owner", format: "text" },
      { key: "access", label: "Access", format: "text" },
    ],
    rows: meta.map((t) => ({ table: t.name, rows: tables[t.name].length, owner: t.owner, access: t.access })),
    sources: [],
    trace,
    mode: "catalog",
    notes: [],
  };
}

const HELP = [
  "I can answer questions about contract pricing, rebates and gross-to-net from the governed datasets. Try:",
  "",
  "- Summarize rebate exposure by customer segment for last quarter",
  "- Show the gross-to-net waterfall for Immunora in 2025",
  "- Which contracts with renewal clauses end in the next 12 months?",
  "- Net price trend by product category over the last 6 months",
  "- Top 5 customers by rebates in the PBM channel",
  "",
  'Ask "what data can I use?" to see the tables and definitions.',
].join("\n");

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function ask(question: string): Promise<Answer> {
  const trace: TraceStep[] = [];
  let t = now();
  await db();
  const p = plan(question);
  trace.push({ step: "Supervisor agent", detail: `Intent: ${p.kind}${p.measure ? `; measure: ${p.measure.label}` : ""}${p.dims.length ? `; by ${p.dims.map((d) => d.label).join(" and ")}` : ""}${p.window ? `; period: ${p.window.label}` : ""}`, ms: now() - t });

  if (p.kind === "restricted") {
    const meta = getDataset().meta.find((m) => m.name === "sales_performance")!;
    return {
      text: `**Access needed.** Questions about field sales performance use **sales_performance**, which is owned by ${meta.owner} and restricted for this workspace. Use "Request" next to the dataset to ask for access; nothing was queried.`,
      columns: [],
      rows: [],
      sources: [{ table: meta.name, rows: 0, certified: true, refreshed: meta.refreshed, owner: meta.owner }],
      trace: [...trace, { step: "Policy check", detail: "Blocked: dataset restricted (policy P-0042)", ms: 0 }],
      mode: "restricted",
      notes: [],
    };
  }
  if (p.kind === "catalog") return catalogAnswer(trace);

  // Optional LLM: writes SQL for questions the rules do not cover, or for uploaded data.
  const llm = getLLMSettings();
  const mentionsUpload = listUserTables().some((u) => question.toLowerCase().includes(u.name));
  if (llm && (p.kind === "unknown" || mentionsUpload)) {
    t = now();
    try {
      const { sql, explanation } = await generateSql(llm, question, listUserTables());
      trace.push({ step: "LLM", detail: `${llm.model} wrote the SQL`, ms: now() - t });
      t = now();
      const rows = await run(sql);
      trace.push({ step: "SQL agent", detail: `Ran the query: ${rows.length} rows`, ms: now() - t });
      const columns = columnsFor(rows);
      const numeric = columns.filter((c) => c.format !== "text" && c.format !== "date");
      const textCol = columns.find((c) => c.format === "text");
      const chart: ChartSpec | undefined =
        rows.length > 1 && rows.length <= 40 && textCol && numeric.length
          ? { type: textCol.key === "quarter" ? "line" : "bar", x: textCol.key, series: numeric.slice(0, 3).map((c) => ({ key: c.key, label: c.label })), data: rows as Record<string, string | number>[], format: numeric[0].format }
          : undefined;
      return { text: `${explanation}\n\n${rows.length} rows returned.`, sql, columns, rows: rows.slice(0, 500), chart, sources: sourcesFor(sql), trace, mode: "llm", notes: ["SQL written by the configured LLM and checked to be read-only before running."] };
    } catch (e) {
      trace.push({ step: "LLM", detail: `Failed (${(e as Error).message}); used the semantic layer instead`, ms: now() - t });
    }
  }

  if (mentionsUpload) {
    const u = listUserTables().find((x) => question.toLowerCase().includes(x.name))!;
    const sql = `SELECT * FROM ${u.name} LIMIT 200`;
    const rows = await run(sql);
    return {
      text: `**${u.name}**: ${u.rows} rows, ${u.columns.length} columns (${u.columns.join(", ")}). Showing the first ${rows.length}. Connect an LLM in Settings to ask free-form questions about uploaded data.`,
      sql,
      columns: columnsFor(rows),
      rows,
      sources: sourcesFor(sql),
      trace,
      mode: "upload",
      notes: [],
    };
  }

  if (p.kind === "unknown") return { text: HELP, columns: [], rows: [], sources: [], trace, mode: "help", notes: [] };

  t = now();
  const answer = p.kind === "aggregate" ? await answerAggregate(p, trace) : p.kind === "waterfall" ? await answerWaterfall(p, trace) : await answerList(p, trace);
  answer.trace.push({ step: "Synthesis", detail: "Summary written from the query results", ms: 0 });
  answer.trace.splice(1, 0, { step: "Semantic layer", detail: "Mapped business terms to governed definitions and wrote SQL", ms: 0 });
  void t;
  return answer;
}

export { QUARTERS };
