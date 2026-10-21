import type { Row } from "./dataset";

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF). */
export function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (nonEmpty.length < 2) throw new Error("The file needs a header row and at least one data row.");

  const seen = new Map<string, number>();
  const headers = nonEmpty[0].map((h, i) => {
    let name = h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || `col_${i + 1}`;
    if (/^\d/.test(name)) name = `c_${name}`;
    const n = seen.get(name) ?? 0;
    seen.set(name, n + 1);
    return n ? `${name}_${n + 1}` : name;
  });

  return nonEmpty.slice(1).map((r) => {
    const out: Row = {};
    headers.forEach((h, i) => {
      const raw = (r[i] ?? "").trim();
      const num = raw.replace(/[$,%]/g, "");
      out[h] = raw === "" ? null : /^-?\d+(\.\d+)?$/.test(num) ? Number(num) : raw;
    });
    return out;
  });
}

export function tableNameFor(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `upload_${base || "data"}`.slice(0, 40);
}
