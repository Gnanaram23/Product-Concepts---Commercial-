/**
 * Reference information for the drugs used in the sample data.
 *
 * Summarised from each product's US prescribing information. It is used to
 * ground the assistant's answers and is not a substitute for the label.
 */

export interface DrugInfo {
  brand: string;
  generic: string;
  drugClass: string;
  plainClass: string;
  route: string;
  common: string[];
  serious: string[];
  boxedWarning?: string;
  monitoring: string[];
  /** Pivotal trials by indication key (see policies.ts). */
  evidence: Record<string, { trial: string; finding: string }[]>;
}

export const DRUGS: Record<string, DrugInfo> = {
  humira: {
    brand: "Humira",
    generic: "adalimumab",
    drugClass: "TNF blocker (anti-TNF monoclonal antibody)",
    plainClass: "a biologic that blocks TNF, a protein that drives inflammation",
    route: "Subcutaneous injection, usually every other week",
    common: ["Injection-site reactions", "Upper respiratory infections", "Headache", "Rash"],
    serious: ["Serious infections, including tuberculosis", "Lymphoma and other cancers", "Hepatitis B reactivation", "Heart failure worsening", "Demyelinating disease"],
    boxedWarning: "Serious infections and malignancy",
    monitoring: ["TB screening before starting", "Hepatitis B screening", "Signs of infection during treatment"],
    evidence: {
      ra: [
        { trial: "ARMADA", finding: "Adalimumab plus methotrexate improved ACR20/50/70 responses versus methotrexate alone in patients with an inadequate response to methotrexate." },
        { trial: "DE019", finding: "Slowed radiographic progression of joint damage over 52 weeks when added to methotrexate." },
      ],
      crohns: [
        { trial: "CLASSIC I", finding: "Induced remission at week 4 more often than placebo in moderate-to-severe Crohn's disease." },
        { trial: "CHARM", finding: "Maintained remission through week 56 more often than placebo." },
      ],
      psa: [
        { trial: "ADEPT", finding: "Improved joint and skin outcomes and inhibited structural damage versus placebo in psoriatic arthritis." },
      ],
    },
  },
  rinvoq: {
    brand: "Rinvoq",
    generic: "upadacitinib",
    drugClass: "Janus kinase (JAK) inhibitor",
    plainClass: "a daily pill that blocks JAK enzymes involved in inflammation",
    route: "Oral tablet, once daily",
    common: ["Upper respiratory infections", "Nausea", "Cough", "Fever"],
    serious: ["Serious infections", "Higher rate of death in some patients", "Malignancy", "Major adverse cardiovascular events", "Blood clots (thrombosis)"],
    boxedWarning: "Serious infections, mortality, malignancy, major adverse cardiovascular events and thrombosis",
    monitoring: ["TB screening before starting", "CBC, liver enzymes and lipids at baseline and during treatment"],
    evidence: {
      ra: [
        { trial: "SELECT-BEYOND", finding: "Improved ACR20 response versus placebo in patients with an inadequate response or intolerance to biologic DMARDs, including TNF blockers." },
        { trial: "SELECT-COMPARE", finding: "Showed higher response rates than adalimumab in patients on background methotrexate." },
      ],
    },
  },
  skyrizi: {
    brand: "Skyrizi",
    generic: "risankizumab",
    drugClass: "IL-23 inhibitor",
    plainClass: "a biologic that blocks IL-23, a protein behind psoriasis plaques",
    route: "Subcutaneous injection at weeks 0 and 4, then every 12 weeks",
    common: ["Upper respiratory infections", "Headache", "Fatigue", "Injection-site reactions", "Fungal skin infections"],
    serious: ["Serious infections", "Liver injury (reported with Crohn's disease induction dosing)"],
    monitoring: ["TB screening before starting", "Liver tests when used for Crohn's disease"],
    evidence: {
      pso: [
        { trial: "UltIMMa-1 and UltIMMa-2", finding: "Achieved PASI 90 more often than placebo and ustekinumab at week 16." },
        { trial: "IMMvent", finding: "Was superior to adalimumab for PASI 90 at week 16." },
      ],
    },
  },
  dupixent: {
    brand: "Dupixent",
    generic: "dupilumab",
    drugClass: "IL-4 receptor alpha antagonist",
    plainClass: "a biologic that blocks two signals (IL-4 and IL-13) behind type 2 inflammation",
    route: "Subcutaneous injection, usually every 2 weeks after a loading dose",
    common: ["Injection-site reactions", "Conjunctivitis and keratitis", "Cold sores", "Raised eosinophil count"],
    serious: ["Hypersensitivity reactions", "Eye problems such as keratitis", "Eosinophilic conditions"],
    monitoring: ["New or worsening eye symptoms", "Do not stop asthma steroids abruptly"],
    evidence: {
      ad: [
        { trial: "SOLO 1 and SOLO 2", finding: "More patients reached clear or almost-clear skin and EASI-75 than with placebo at week 16." },
        { trial: "CHRONOS", finding: "Sustained benefit to 52 weeks alongside topical corticosteroids." },
      ],
      asthma: [
        { trial: "LIBERTY ASTHMA QUEST", finding: "Reduced severe exacerbations and improved lung function, with greater benefit at higher eosinophil counts." },
        { trial: "LIBERTY ASTHMA VENTURE", finding: "Reduced oral corticosteroid use in steroid-dependent asthma." },
      ],
    },
  },
  ozempic: {
    brand: "Ozempic",
    generic: "semaglutide",
    drugClass: "GLP-1 receptor agonist",
    plainClass: "a weekly injection that mimics GLP-1, a gut hormone that lowers blood sugar",
    route: "Subcutaneous injection, once weekly",
    common: ["Nausea", "Vomiting", "Diarrhoea", "Stomach pain", "Constipation"],
    serious: ["Pancreatitis", "Gallbladder problems", "Low blood sugar with insulin or sulfonylureas", "Kidney injury from dehydration", "Diabetic retinopathy complications"],
    boxedWarning: "Risk of thyroid C-cell tumours",
    monitoring: ["A1c every 3 months until at goal", "Personal or family history of medullary thyroid cancer or MEN 2 is a contraindication"],
    evidence: {
      t2d: [
        { trial: "SUSTAIN programme", finding: "Lowered A1c and body weight versus placebo and active comparators." },
        { trial: "SUSTAIN-6", finding: "Reduced major adverse cardiovascular events versus placebo in high-risk type 2 diabetes." },
      ],
    },
  },
  mounjaro: {
    brand: "Mounjaro",
    generic: "tirzepatide",
    drugClass: "GIP and GLP-1 receptor agonist",
    plainClass: "a weekly injection that mimics two gut hormones (GIP and GLP-1) to lower blood sugar",
    route: "Subcutaneous injection, once weekly",
    common: ["Nausea", "Diarrhoea", "Decreased appetite", "Vomiting", "Constipation"],
    serious: ["Pancreatitis", "Gallbladder problems", "Low blood sugar with insulin or sulfonylureas", "Kidney injury from dehydration"],
    boxedWarning: "Risk of thyroid C-cell tumours",
    monitoring: ["A1c every 3 months until at goal", "Personal or family history of medullary thyroid cancer or MEN 2 is a contraindication"],
    evidence: {
      t2d: [
        { trial: "SURPASS programme", finding: "Lowered A1c and body weight versus placebo and active comparators." },
        { trial: "SURPASS-2", finding: "Lowered A1c more than semaglutide 1 mg at 40 weeks." },
      ],
    },
  },
  keytruda: {
    brand: "Keytruda",
    generic: "pembrolizumab",
    drugClass: "PD-1 blocking antibody (immune checkpoint inhibitor)",
    plainClass: "an immunotherapy that helps the immune system recognise and attack cancer cells",
    route: "Intravenous infusion every 3 or 6 weeks",
    common: ["Fatigue", "Musculoskeletal pain", "Rash", "Diarrhoea", "Itching"],
    serious: ["Immune-mediated pneumonitis", "Colitis", "Hepatitis", "Endocrine disorders (thyroid, adrenal, pituitary)", "Nephritis", "Infusion reactions"],
    monitoring: ["Liver, kidney and thyroid function", "New cough or shortness of breath"],
    evidence: {
      nsclc: [
        { trial: "KEYNOTE-024", finding: "Improved overall survival versus platinum chemotherapy in first-line NSCLC with PD-L1 TPS of 50% or more and no EGFR or ALK alterations." },
        { trial: "KEYNOTE-189", finding: "Added to pemetrexed and platinum, improved overall survival in first-line non-squamous NSCLC." },
      ],
    },
  },
};

export function findDrug(name: string): DrugInfo | undefined {
  const key = name.toLowerCase().split(/[\s(]/)[0];
  return DRUGS[key];
}
