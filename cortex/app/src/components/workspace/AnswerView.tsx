import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Answer, ChartSpec } from "@/engine/engine";
import { fmt } from "@/engine/format";

const PALETTE = ["#2563eb", "#0d9488", "#d97706", "#7c3aed", "#db2777", "#4b5563"];

/** Renders **bold** and "- " bullets, the only markup the engine writes. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="text-sm space-y-1">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const bullet = line.startsWith("- ");
        const body = bullet ? line.slice(2) : line;
        const parts = body.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-semibold text-foreground">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        );
        return bullet ? (
          <div key={i} className="pl-4 relative">
            <span className="absolute left-0 text-muted-foreground">•</span>
            {parts}
          </div>
        ) : (
          <p key={i}>{parts}</p>
        );
      })}
    </div>
  );
}

export function ResultTable({ answer, max = 50 }: { answer: Answer; max?: number }) {
  if (!answer.rows.length) return null;
  const rows = answer.rows.slice(0, max);
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border">
      <table className="w-full text-xs">
        <thead className="bg-muted/60">
          <tr>
            {answer.columns.map((c) => (
              <th key={c.key} className={`px-2.5 py-1.5 font-medium text-muted-foreground whitespace-nowrap ${c.format === "text" || c.format === "date" ? "text-left" : "text-right"}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {answer.columns.map((c) => (
                <td key={c.key} className={`px-2.5 py-1.5 ${c.format === "text" || c.format === "date" ? "text-left" : "text-right tabular-nums whitespace-nowrap"}`}>
                  {fmt(r[c.key], c.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {answer.rows.length > max && <p className="px-2.5 py-1.5 text-[11px] text-muted-foreground border-t">Showing {max} of {answer.rows.length} rows</p>}
    </div>
  );
}

function axisFormatter(format: ChartSpec["format"]) {
  return (v: number) => (format === "price" ? `$${Math.round(v).toLocaleString("en-US")}` : fmt(v, format));
}

export function ResultChart({ chart }: { chart: ChartSpec }) {
  const tick = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };
  const tooltipFormatter = (v: number) => fmt(v, chart.format);
  const many = chart.data.length > 4 || chart.data.some((d) => String(d[chart.x] ?? "").length > 14);

  if (chart.type === "waterfall") {
    return (
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={tick} interval={0} />
            <YAxis tick={tick} tickFormatter={axisFormatter(chart.format)} width={64} />
            <Tooltip formatter={(v: number, n: string) => (n === "base" ? null : tooltipFormatter(v))} />
            <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="value" stackId="w" fill={PALETTE[0]} radius={[3, 3, 0, 0]} name="Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart.type === "line") {
    return (
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart.data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.x} tick={tick} />
            <YAxis tick={tick} tickFormatter={axisFormatter(chart.format)} width={64} scale={chart.series.length > 1 && chart.format === "price" ? "log" : "auto"} domain={["auto", "auto"]} />
            <Tooltip formatter={tooltipFormatter} />
            {chart.series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {chart.series.map((s, i) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={{ r: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const stacked = chart.series.length > 1;
  return (
    <div className="mt-3" style={{ height: many ? Math.min(40 + chart.data.length * 28, 420) : 256 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chart.data} layout={many ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={!many} horizontal={many ? false : true} />
          {many ? (
            <>
              <XAxis type="number" tick={tick} tickFormatter={axisFormatter(chart.format)} />
              <YAxis type="category" dataKey={chart.x} tick={tick} width={150} interval={0} />
            </>
          ) : (
            <>
              <XAxis dataKey={chart.x} tick={tick} interval={0} />
              <YAxis tick={tick} tickFormatter={axisFormatter(chart.format)} width={64} />
            </>
          )}
          <Tooltip formatter={tooltipFormatter} />
          {stacked && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {chart.series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} stackId={stacked ? "s" : undefined} fill={PALETTE[i % PALETTE.length]} radius={stacked ? 0 : 3} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
