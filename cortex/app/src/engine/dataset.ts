/**
 * Synthetic US pharma contracting data.
 *
 * Generated in the browser from a fixed seed, so every visitor sees the same
 * numbers. Brands, customers and amounts are fictional, but the structure
 * follows how a pharma manufacturer's pricing and contracting team sees its
 * business: WAC list price, contract price, rebates, chargebacks and
 * administrative fees by customer channel and quarter.
 */

export type ColumnType = "string" | "number" | "date" | "boolean";

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  description: string;
}

export interface TableMeta {
  name: string;
  description: string;
  owner: string;
  certified: boolean;
  access: "granted" | "restricted";
  refreshed: string;
  columns: ColumnMeta[];
}

export type Row = Record<string, string | number | boolean | null>;

// Mulberry32: small, fast, deterministic PRNG.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const QUARTERS = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"];

const PRODUCTS = [
  { product: "Cardiolex", category: "Cardiovascular", wac: 612, growth: 0.01 },
  { product: "Glucavia", category: "Diabetes", wac: 958, growth: 0.03 },
  { product: "Immunora", category: "Immunology", wac: 6840, growth: 0.04 },
  { product: "Oncaris", category: "Oncology", wac: 14250, growth: 0.05 },
  { product: "Respira", category: "Respiratory", wac: 498, growth: 0.0 },
  { product: "Neuravel", category: "Neurology", wac: 1180, growth: 0.02 },
];

/** Channel economics: typical discount off WAC and rebate rate. */
const SEGMENTS = [
  { segment: "PBM / Commercial Payer", discount: 0.0, rebate: [0.28, 0.48], admin: 0.03, chargeback: 0 },
  { segment: "Medicare Part D Plan", discount: 0.0, rebate: [0.22, 0.4], admin: 0.03, chargeback: 0 },
  { segment: "GPO", discount: 0.06, rebate: [0.02, 0.06], admin: 0.03, chargeback: 0.08 },
  { segment: "Health System / IDN", discount: 0.1, rebate: [0.04, 0.1], admin: 0.0, chargeback: 0.12 },
  { segment: "Specialty Pharmacy", discount: 0.02, rebate: [0.03, 0.08], admin: 0.02, chargeback: 0 },
  { segment: "Government / 340B", discount: 0.23, rebate: [0.0, 0.0], admin: 0.0, chargeback: 0.4 },
];

const CUSTOMERS: Record<string, string[]> = {
  "PBM / Commercial Payer": ["Meridian Rx", "ClearPath PBM", "Summit Health Plan", "Atlas Benefit Partners", "Northstar Rx Services"],
  "Medicare Part D Plan": ["Silverline Part D", "Harbor Senior Rx", "Keystone Medicare Rx"],
  GPO: ["Unity Purchasing Alliance", "Vantage GPO", "Crescent Supply Network"],
  "Health System / IDN": ["Lakeshore Health", "Pinecrest Medical Group", "Riverbend IDN", "Mountain View Health", "Coastal Care Partners", "Prairie Health System"],
  "Specialty Pharmacy": ["Apex Specialty", "CareBridge Specialty", "Elm Specialty Pharmacy"],
  "Government / 340B": ["Eastside Community Clinics", "Valley 340B Network", "State Medicaid Supplemental"],
};

const REGIONS = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];

const EXCEPTIONS = [
  "Price protection: rebate increases if WAC rises more than 7% a year",
  "Auto-renewal unless notice is given 90 days before expiry",
  "Most-favoured-nation clause on net price",
  "Formulary exclusivity required for the top rebate tier",
  "Renewal subject to renegotiation if market share falls below 30%",
  "Termination for convenience with 60 days' notice",
];

export interface Dataset {
  meta: TableMeta[];
  tables: Record<string, Row[]>;
}

let cached: Dataset | null = null;

export function getDataset(): Dataset {
  if (cached) return cached;
  const rand = rng(20251231);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
  const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

  const customers: Row[] = [];
  for (const seg of SEGMENTS) {
    for (const name of CUSTOMERS[seg.segment]) {
      customers.push({
        customer_id: `C${String(customers.length + 1).padStart(3, "0")}`,
        customer_name: name,
        customer_segment: seg.segment,
        region: pick(REGIONS),
        lives_or_beds: Math.round(seg.segment.includes("Payer") || seg.segment.includes("Part D") ? between(0.8, 22) * 1e6 : between(150, 4200)),
        account_tier: pick(["Strategic", "Core", "Core", "Developing"]),
      });
    }
  }

  const contracts: Row[] = [];
  const accruals: Row[] = [];
  for (const cust of customers) {
    const seg = SEGMENTS.find((s) => s.segment === cust.customer_segment)!;
    const nProducts = 2 + Math.floor(rand() * 3);
    const products = [...PRODUCTS];
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }
    products.length = nProducts;
    for (const p of products) {
      const id = `K-${1000 + contracts.length + 1}`;
      const startYear = pick([2022, 2022, 2023, 2023, 2024]);
      const termYears = pick([3, 4, 4, 5]);
      const startMonth = 1 + Math.floor(rand() * 12);
      const start = `${startYear}-${String(startMonth).padStart(2, "0")}-01`;
      const end = `${startYear + termYears}-${String(startMonth).padStart(2, "0")}-01`;
      const discount = seg.discount + between(-0.01, 0.02);
      const rebateRate = round(between(seg.rebate[0], seg.rebate[1]), 3);
      const hasException = rand() < 0.35;
      const contractPrice = round(p.wac * (1 - Math.max(0, discount)));
      contracts.push({
        contract_id: id,
        customer_id: cust.customer_id,
        customer_name: cust.customer_name,
        customer_segment: cust.customer_segment,
        region: cust.region,
        product: p.product,
        product_category: p.category,
        start_date: start,
        end_date: end,
        renewal_type: pick(["Auto-renew", "Manual renewal", "Manual renewal", "Evergreen"]),
        wac_price: p.wac,
        contract_price: contractPrice,
        rebate_rate: rebateRate,
        admin_fee_rate: seg.admin,
        exception_clause: hasException ? pick(EXCEPTIONS) : null,
        status: end < "2025-12-31" ? "Expired" : "Active",
      });

      const baseUnits = (p.wac > 5000 ? between(40, 400) : between(1500, 12000)) * (cust.account_tier === "Strategic" ? 1.8 : 1);
      QUARTERS.forEach((q, qi) => {
        const qStart = `${q.slice(0, 4)}-${String((Number(q.slice(-1)) - 1) * 3 + 1).padStart(2, "0")}-01`;
        if (qStart < start || qStart >= end) return;
        const year = Number(q.slice(0, 4));
        const wac = round(p.wac * (year === 2025 ? 1.045 : 1)); // January 2025 list price increase
        const units = Math.round(baseUnits * (1 + p.growth * qi) * between(0.85, 1.15));
        const gross = round(units * wac);
        const priceDiscount = round(units * (wac - contractPrice * (wac / p.wac)));
        const chargebacks = round(gross * seg.chargeback * between(0.85, 1.1) + priceDiscount);
        const rate = rebateRate * (year === 2025 && rand() < 0.4 ? 1.08 : 1);
        const rebate = round((gross - chargebacks) * rate);
        const admin = round(gross * seg.admin);
        accruals.push({
          accrual_id: `A-${accruals.length + 1}`,
          contract_id: id,
          customer_segment: cust.customer_segment,
          product: p.product,
          quarter: q,
          units,
          wac_price: wac,
          gross_sales: gross,
          chargebacks,
          rebate_amount: rebate,
          admin_fees: admin,
          net_sales: round(gross - chargebacks - rebate - admin),
          accrual_status: qi >= 6 ? "Accrued" : "Paid",
        });
      });
    }
  }

  const salesPerformance: Row[] = [];

  cached = {
    tables: {
      contract_pricing_data: contracts,
      rebate_accruals_v2: accruals,
      customer_segments: customers,
      sales_performance: salesPerformance,
    },
    meta: [
      {
        name: "contract_pricing_data",
        description: "One row per customer contract and product: list (WAC) and contract price, rebate and fee rates, term and exception clauses.",
        owner: "Pricing & Contracting",
        certified: true,
        access: "granted",
        refreshed: "Daily",
        columns: [
          { name: "contract_id", type: "string", description: "Contract identifier" },
          { name: "customer_name", type: "string", description: "Customer on the contract" },
          { name: "customer_segment", type: "string", description: "Channel: PBM, Part D plan, GPO, health system, specialty pharmacy, government" },
          { name: "region", type: "string", description: "US region" },
          { name: "product", type: "string", description: "Brand" },
          { name: "product_category", type: "string", description: "Therapeutic area" },
          { name: "start_date", type: "date", description: "Contract start" },
          { name: "end_date", type: "date", description: "Contract end" },
          { name: "renewal_type", type: "string", description: "Auto-renew, manual or evergreen" },
          { name: "wac_price", type: "number", description: "Wholesale acquisition cost per unit at signing" },
          { name: "contract_price", type: "number", description: "Contracted price per unit" },
          { name: "rebate_rate", type: "number", description: "Rebate as a share of eligible sales" },
          { name: "admin_fee_rate", type: "number", description: "Administrative fee as a share of gross sales" },
          { name: "exception_clause", type: "string", description: "Non-standard term, if any" },
          { name: "status", type: "string", description: "Active or Expired at end of 2025" },
        ],
      },
      {
        name: "rebate_accruals_v2",
        description: "Quarterly sales and gross-to-net deductions per contract, 2024-Q1 to 2025-Q4.",
        owner: "Revenue Management",
        certified: true,
        access: "granted",
        refreshed: "Monthly close",
        columns: [
          { name: "contract_id", type: "string", description: "Joins to contract_pricing_data" },
          { name: "customer_segment", type: "string", description: "Channel" },
          { name: "product", type: "string", description: "Brand" },
          { name: "quarter", type: "string", description: "Quarter, e.g. 2025-Q4" },
          { name: "units", type: "number", description: "Units sold" },
          { name: "wac_price", type: "number", description: "WAC per unit in the quarter" },
          { name: "gross_sales", type: "number", description: "Units × WAC" },
          { name: "chargebacks", type: "number", description: "Wholesaler chargebacks, including contract price discounts" },
          { name: "rebate_amount", type: "number", description: "Rebates accrued or paid" },
          { name: "admin_fees", type: "number", description: "GPO / PBM administrative fees" },
          { name: "net_sales", type: "number", description: "Gross sales minus all deductions" },
          { name: "accrual_status", type: "string", description: "Paid, or Accrued for open quarters" },
        ],
      },
      {
        name: "customer_segments",
        description: "Customer master with channel, region and account tier.",
        owner: "Commercial Operations",
        certified: true,
        access: "granted",
        refreshed: "Weekly",
        columns: [
          { name: "customer_id", type: "string", description: "Customer identifier" },
          { name: "customer_name", type: "string", description: "Customer" },
          { name: "customer_segment", type: "string", description: "Channel" },
          { name: "region", type: "string", description: "US region" },
          { name: "lives_or_beds", type: "number", description: "Covered lives (payers) or staffed beds (providers)" },
          { name: "account_tier", type: "string", description: "Strategic, Core or Developing" },
        ],
      },
      {
        name: "sales_performance",
        description: "Field sales performance by territory and representative.",
        owner: "Sales Operations",
        certified: true,
        access: "restricted",
        refreshed: "Weekly",
        columns: [
          { name: "territory", type: "string", description: "Sales territory" },
          { name: "rep_name", type: "string", description: "Representative" },
          { name: "quota_attainment", type: "number", description: "Share of quota achieved" },
        ],
      },
    ],
  };
  return cached;
}
