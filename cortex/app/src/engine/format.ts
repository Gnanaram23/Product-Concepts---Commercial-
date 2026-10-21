export type Format = "currency" | "percent" | "number" | "price" | "text" | "date";

export function fmt(value: unknown, format: Format): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value !== "number") return String(value);
  switch (format) {
    case "currency": {
      const a = Math.abs(value);
      if (a >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (a >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      if (a >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
      return `$${value.toFixed(0)}`;
    }
    case "price":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percent":
      return `${value.toFixed(1)}%`;
    case "number":
      return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    default:
      return String(value);
  }
}

export function pctChange(now: number, before: number): string {
  if (!before) return "";
  const p = ((now - before) / Math.abs(before)) * 100;
  return `${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
}
