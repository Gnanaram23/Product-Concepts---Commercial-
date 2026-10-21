/**
 * The semantic layer: governed business definitions that turn a question in
 * plain English into SQL.
 *
 * Measures and dimensions are defined once here, so "gross-to-net" or "net
 * price" mean the same thing in every answer. The planner reads the question,
 * picks the measure, the breakdown, the filters and the time window, and
 * writes the SQL that the query engine runs.
 */
import { QUARTERS } from "./dataset";

export interface Measure {
  key: string;
  label: string;
  sql: string;
  format: "currency" | "percent" | "number" | "price";
  words: RegExp;
}

export interface Dimension {
  key: string;
  label: string;
  column: string;
  words: RegExp;
}

export const MEASURES: Measure[] = [
  { key: "gtn", label: "Gross-to-net %", sql: "ROUND(100 * (1 - SUM(a.net_sales) / SUM(a.gross_sales)), 1)", format: "percent", words: /gross[- ]to[- ]net|\bgtn\b|discount rate|deduction rate/ },
  { key: "net_price", label: "Net price per unit", sql: "ROUND(SUM(a.net_sales) / SUM(a.units), 2)", format: "price", words: /net price|price per unit|pricing trend|price trend|realized price|realised price|\bpricing\b/ },
  { key: "rebates", label: "Rebates", sql: "ROUND(SUM(a.rebate_amount), 0)", format: "currency", words: /rebate|liabilit|exposure/ },
  { key: "chargebacks", label: "Chargebacks", sql: "ROUND(SUM(a.chargebacks), 0)", format: "currency", words: /chargeback/ },
  { key: "admin_fees", label: "Admin fees", sql: "ROUND(SUM(a.admin_fees), 0)", format: "currency", words: /admin(istrative)? fee|\bfees\b/ },
  { key: "net_sales", label: "Net sales", sql: "ROUND(SUM(a.net_sales), 0)", format: "currency", words: /net sales|net revenue/ },
  { key: "units", label: "Units", sql: "SUM(a.units)", format: "number", words: /\bunits?\b|volume/ },
  { key: "contracts", label: "Contracts", sql: "COUNT(DISTINCT a.contract_id)", format: "number", words: /how many contracts|number of contracts|contract count/ },
  { key: "gross_sales", label: "Gross sales", sql: "ROUND(SUM(a.gross_sales), 0)", format: "currency", words: /gross sales|gross revenue|\bsales\b|revenue|spend/ },
];

export const DIMENSIONS: Dimension[] = [
  { key: "segment", label: "Customer segment", column: "a.customer_segment", words: /segment|channel|customer type/ },
  { key: "category", label: "Product category", column: "c.product_category", words: /categor|therapeutic area|\bta\b/ },
  { key: "product", label: "Product", column: "a.product", words: /by product|by brand|per product|per brand|each product|each brand|products|brands/ },
  { key: "region", label: "Region", column: "c.region", words: /region|geograph/ },
  { key: "customer", label: "Customer", column: "c.customer_name", words: /customer|account|client/ },
  { key: "contract", label: "Contract", column: "a.contract_id", words: /contract/ },
  { key: "quarter", label: "Quarter", column: "a.quarter", words: /trend|over time|quarterly|by quarter|per quarter|over the last|month/ },
];

const PRODUCTS = ["Cardiolex", "Glucavia", "Immunora", "Oncaris", "Respira", "Neuravel"];
const CATEGORIES = ["Cardiovascular", "Diabetes", "Immunology", "Oncology", "Respiratory", "Neurology"];
const REGIONS = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];
const SEGMENT_WORDS: [RegExp, string][] = [
  [/\bpbms?\b|commercial payer/, "PBM / Commercial Payer"],
  [/part d|medicare/, "Medicare Part D Plan"],
  [/\bgpos?\b/, "GPO"],
  [/health system|\bidns?\b|hospital/, "Health System / IDN"],
  [/specialty pharm/, "Specialty Pharmacy"],
  [/340b|government|medicaid/, "Government / 340B"],
];

export interface TimeWindow {
  quarters: string[];
  label: string;
  /** The window immediately before, for period-over-period comparison. */
  previous?: { quarters: string[]; label: string };
}

export interface Plan {
  kind: "aggregate" | "waterfall" | "exceptions" | "expiring" | "catalog" | "restricted" | "unknown";
  measure?: Measure;
  dims: Dimension[];
  filters: { column: string; value: string; label: string }[];
  window?: TimeWindow;
  limit?: number;
  order: "desc" | "asc";
  keyword?: string;
  months?: number;
  notes: string[];
}

const LATEST = QUARTERS[QUARTERS.length - 1];

function periodLabel(qs: string[]): string {
  if (qs.length === 1) return qs[0];
  const year = qs[0].slice(0, 4);
  if (qs.length === 4 && qs.every((q) => q.startsWith(year))) return year;
  return `${qs[0]} to ${qs[qs.length - 1]}`;
}

function window(qs: string[], label: string, withPrevious = true): TimeWindow {
  const first = QUARTERS.indexOf(qs[0]);
  const prevQs = first >= qs.length ? QUARTERS.slice(first - qs.length, first) : [];
  return {
    quarters: qs,
    label,
    previous: withPrevious && prevQs.length === qs.length ? { quarters: prevQs, label: periodLabel(prevQs) } : undefined,
  };
}

export function parseWindow(q: string, trend: boolean): { window: TimeWindow; explicit: boolean } {
  const mQ = q.match(/\bq([1-4])\s*[-/ ]?\s*(20\d\d)\b|\b(20\d\d)\s*[-/ ]?\s*q([1-4])\b/);
  if (mQ) {
    const quarter = `${mQ[2] ?? mQ[3]}-Q${mQ[1] ?? mQ[4]}`;
    if (QUARTERS.includes(quarter)) return { window: window([quarter], quarter), explicit: true };
  }
  const mQonly = q.match(/\bq([1-4])\b/);
  if (mQonly) {
    const quarter = `2025-Q${mQonly[1]}`;
    return { window: window([quarter], quarter), explicit: true };
  }
  const mLastN = q.match(/last (\d+|two|three|four|six|eight) quarters/);
  const words: Record<string, number> = { two: 2, three: 3, four: 4, six: 6, eight: 8 };
  if (mLastN) {
    const n = Math.min(QUARTERS.length, Number(mLastN[1]) || words[mLastN[1]]);
    const qs = QUARTERS.slice(-n);
    return { window: window(qs, `the last ${n} quarters (${qs[0]} to ${LATEST})`, !trend), explicit: true };
  }
  const mMonths = q.match(/last (\d+|six|twelve|three|nine|eighteen|twenty[- ]four) months/);
  if (mMonths) {
    const mw: Record<string, number> = { three: 3, six: 6, nine: 9, twelve: 12, eighteen: 18, "twenty four": 24, "twenty-four": 24 };
    const months = Number(mMonths[1]) || mw[mMonths[1]];
    const n = Math.max(1, Math.min(QUARTERS.length, Math.round(months / 3)));
    const qs = QUARTERS.slice(-n);
    return { window: window(qs, `the last ${months} months (${qs[0]} to ${LATEST})`, !trend), explicit: true };
  }
  if (/last quarter|latest quarter|this quarter|current quarter|most recent quarter/.test(q)) {
    return { window: window([LATEST], `${LATEST}, the latest quarter`), explicit: true };
  }
  const mYear = q.match(/\b(2024|2025)\b/);
  if (mYear) {
    const qs = QUARTERS.filter((x) => x.startsWith(mYear[1]));
    return { window: window(qs, mYear[1]), explicit: true };
  }
  if (/last year|this year|ytd|year to date|latest year/.test(q)) {
    return { window: window(QUARTERS.slice(-4), "2025"), explicit: true };
  }
  if (trend) return { window: window(QUARTERS, `${QUARTERS[0]} to ${LATEST}`, false), explicit: false };
  return { window: window(QUARTERS.slice(-4), "2025 (latest full year)"), explicit: false };
}

export function plan(question: string): Plan {
  const q = question.toLowerCase().replace(/[’']/g, "'");
  const notes: string[] = [];
  const base: Plan = { kind: "unknown", dims: [], filters: [], order: "desc", notes };

  if (/sales performance|quota|\breps?\b|territor/.test(q)) return { ...base, kind: "restricted" };
  if (/what data|which data|what tables|which tables|schema|columns|what can i ask|what can you|help/.test(q)) return { ...base, kind: "catalog" };

  // Filters on named entities
  const filters: Plan["filters"] = [];
  for (const p of PRODUCTS) if (q.includes(p.toLowerCase())) filters.push({ column: "a.product", value: p, label: p });
  for (const c of CATEGORIES) if (q.includes(c.toLowerCase()) && !/categor/.test(q.replace(c.toLowerCase(), ""))) filters.push({ column: "c.product_category", value: c, label: c });
  for (const r of REGIONS) if (q.includes(r.toLowerCase())) filters.push({ column: "c.region", value: r, label: r });
  const bySegment = /\b(by|per|across|each|every)\s+(customer\s+)?(segment|channel)s?\b|\bsegments\b|\bchannels\b/.test(q);
  if (!bySegment) for (const [re, s] of SEGMENT_WORDS) if (re.test(q)) filters.push({ column: "a.customer_segment", value: s, label: s });

  const top = q.match(/\b(top|bottom|lowest|highest|largest|smallest|biggest)\s+(\d+)\b/);
  const limit = top ? Number(top[2]) : /\b(top|highest|largest|biggest)\b/.test(q) ? 10 : undefined;
  const order: Plan["order"] = top && /bottom|lowest|smallest/.test(top[1]) ? "asc" : "desc";

  if (/exception|clause|non-standard|nonstandard|special term/.test(q)) {
    const kw = q.match(/renew|price protection|most[- ]favou?red|mfn|terminat|formulary|market share/);
    return { ...base, kind: "exceptions", filters, keyword: kw ? kw[0] : undefined };
  }
  if (/expir|up for renewal|due (for|to) renew|renewal pipeline|renewals? (due|coming)/.test(q)) {
    const m = q.match(/next (\d+) (month|day)/);
    const months = m ? (m[2] === "day" ? Math.max(1, Math.round(Number(m[1]) / 30)) : Number(m[1])) : 12;
    return { ...base, kind: "expiring", filters, months };
  }

  const trend = /trend|over time|quarterly|by quarter|per quarter|over the last|month/.test(q);
  const { window: win, explicit } = parseWindow(q, trend);
  if (!explicit) notes.push(`No period was given, so this uses ${win.label}.`);

  if (/waterfall|bridge|gross[- ]to[- ]net breakdown|where does the money go|deductions/.test(q)) {
    const dims = /contract/.test(q) ? [DIMENSIONS.find((d) => d.key === "contract")!] : [];
    return { ...base, kind: "waterfall", dims, filters, window: win, limit: dims.length ? limit ?? 10 : undefined, order };
  }

  const measure = MEASURES.find((m) => m.words.test(q));
  const dims: Dimension[] = [];
  for (const d of DIMENSIONS) {
    if (d.key === "quarter") continue;
    if (d.words.test(q)) {
      // "top 10 contracts by rebates" breaks down by contract; "customer segment" is the segment, not customer.
      if (d.key === "customer" && /customer segment|customer type/.test(q) && !/customers/.test(q)) continue;
      if (d.key === "contract" && !(limit || /by contract|per contract|each contract|contracts/.test(q))) continue;
      dims.push(d);
    }
  }
  if (/product categor/.test(q)) {
    const i = dims.findIndex((d) => d.key === "product");
    if (i >= 0 && dims.some((d) => d.key === "category")) dims.splice(i, 1);
  }
  if (bySegment) {
    // "segment" names the breakdown; keep it ahead of a passing mention of customers.
    const seg = dims.find((d) => d.key === "segment");
    if (seg) dims.splice(0, dims.length, seg);
  }
  // Keep the most specific breakdown first and at most one non-time dimension.
  const order_ = ["contract", "customer", "product", "category", "segment", "region"];
  dims.sort((x, y) => order_.indexOf(x.key) - order_.indexOf(y.key));
  const mainDims = dims.slice(0, 1);
  if (trend) mainDims.push(DIMENSIONS.find((d) => d.key === "quarter")!);

  if (!measure && mainDims.length === 0 && filters.length === 0) return { ...base, kind: "unknown" };
  const m = measure ?? MEASURES.find((x) => x.key === "gross_sales")!;
  if (!measure) notes.push("No measure was named, so this shows gross sales.");

  return { ...base, kind: "aggregate", measure: m, dims: mainDims, filters, window: win, limit, order };
}

// ---------------------------------------------------------------------------
// SQL generation
// ---------------------------------------------------------------------------

const FROM = "FROM rebate_accruals_v2 AS a\nJOIN contract_pricing_data AS c ON a.contract_id = c.contract_id";
const quote = (s: string) => `'${s.replace(/'/g, "''")}'`;

function where(p: Plan, quarters?: string[]): string {
  const parts = p.filters.map((f) => `${f.column} = ${quote(f.value)}`);
  const qs = quarters ?? p.window?.quarters;
  if (qs && qs.length < QUARTERS.length) parts.push(qs.length === 1 ? `a.quarter = ${quote(qs[0])}` : `a.quarter IN (${qs.map(quote).join(", ")})`);
  return parts.length ? `WHERE ${parts.join("\n  AND ")}` : "";
}

export function aggregateSql(p: Plan, quarters?: string[]): string {
  const m = p.measure!;
  const select = [...p.dims.map((d) => `${d.column} AS ${d.key}`), `${m.sql} AS ${m.key}`];
  const lines = [`SELECT ${select.join(",\n       ")}`, FROM, where(p, quarters)];
  if (p.dims.length) {
    lines.push(`GROUP BY ${p.dims.map((d) => d.column).join(", ")}`);
    const isTime = p.dims.some((d) => d.key === "quarter");
    lines.push(isTime ? `ORDER BY ${p.dims.map((d) => d.column).join(", ")}` : `ORDER BY ${m.key} ${p.order.toUpperCase()}`);
    if (p.limit && !isTime) lines.push(`LIMIT ${p.limit}`);
  }
  return lines.filter(Boolean).join("\n");
}

export function waterfallSql(p: Plan): string {
  const dim = p.dims[0];
  const select = [
    ...(dim ? [`${dim.column} AS ${dim.key}`, "c.customer_name AS customer", "a.product AS product"] : []),
    "ROUND(SUM(a.gross_sales), 0) AS gross_sales",
    "ROUND(SUM(a.chargebacks), 0) AS chargebacks",
    "ROUND(SUM(a.rebate_amount), 0) AS rebates",
    "ROUND(SUM(a.admin_fees), 0) AS admin_fees",
    "ROUND(SUM(a.net_sales), 0) AS net_sales",
    "ROUND(100 * (1 - SUM(a.net_sales) / SUM(a.gross_sales)), 1) AS gtn",
  ];
  const lines = [`SELECT ${select.join(",\n       ")}`, FROM, where(p)];
  if (dim) {
    lines.push(`GROUP BY ${dim.column}, c.customer_name, a.product`);
    lines.push(`ORDER BY gross_sales ${p.order.toUpperCase()}`);
    lines.push(`LIMIT ${p.limit ?? 10}`);
  }
  return lines.filter(Boolean).join("\n");
}

export function exceptionsSql(p: Plan): string {
  const kwMap: Record<string, string> = { renew: "renew", "price protection": "price protection", mfn: "favoured", "most favoured": "favoured", "most favored": "favoured", "most-favoured": "favoured", "most-favored": "favoured", terminat: "terminat", formulary: "formulary", "market share": "market share" };
  const parts = ["c.exception_clause IS NOT NULL"];
  if (p.keyword) parts.push(`LOWER(c.exception_clause) LIKE ${quote(`%${kwMap[p.keyword] ?? p.keyword}%`)}`);
  for (const f of p.filters) parts.push(`${f.column.replace("a.", "c.")} = ${quote(f.value)}`);
  return [
    "SELECT c.contract_id, c.customer_name, c.customer_segment, c.product,",
    "       c.end_date, c.renewal_type, c.exception_clause",
    "FROM contract_pricing_data AS c",
    `WHERE ${parts.join("\n  AND ")}`,
    "ORDER BY c.end_date",
  ].join("\n");
}

export const AS_OF = "2026-01-01";

export function expiringSql(p: Plan): string {
  const end = new Date(AS_OF);
  end.setMonth(end.getMonth() + (p.months ?? 12));
  const until = end.toISOString().slice(0, 10);
  const parts = [`c.end_date >= ${quote(AS_OF)}`, `c.end_date < ${quote(until)}`];
  for (const f of p.filters) parts.push(`${f.column.replace("a.", "c.")} = ${quote(f.value)}`);
  return [
    "SELECT c.contract_id, c.customer_name, c.customer_segment, c.product, c.end_date,",
    "       c.renewal_type, ROUND(SUM(a.gross_sales), 0) AS gross_sales_2025, ROUND(SUM(a.rebate_amount), 0) AS rebates_2025",
    "FROM contract_pricing_data AS c",
    "JOIN rebate_accruals_v2 AS a ON a.contract_id = c.contract_id",
    `WHERE ${parts.join("\n  AND ")}`,
    "  AND a.quarter LIKE '2025%'",
    "GROUP BY c.contract_id, c.customer_name, c.customer_segment, c.product, c.end_date, c.renewal_type",
    "ORDER BY c.end_date",
  ].join("\n");
}
