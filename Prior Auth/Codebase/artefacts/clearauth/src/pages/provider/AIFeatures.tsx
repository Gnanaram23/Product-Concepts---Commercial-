import { useState } from "react";
import { Sparkles, FileText, CheckCircle, AlertTriangle, BarChart3, ClipboardCheck, MessageSquare, Scale, Upload, Database } from "lucide-react";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { DocumentsModal } from "@/components/modals/DocumentsModal";
import { cn } from "@/lib/utils";

const AI_FEATURES = [
  {
    id: "clinical_doc",
    title: "Clinical Documentation",
    desc: "AI auto-generates prior authorization justification letters with ICD-10 codes, step therapy, and clinical evidence.",
    icon: FileText,
    color: "text-[#2563EB]",
    bg: "bg-[#EFF6FF]",
    prompt: "Generate clinical documentation for this PA case",
    stat: "92% accuracy",
    statColor: "text-[#16A34A]"
  },
  {
    id: "evidence_search",
    title: "Evidence Search",
    desc: "Search clinical trials, ACR guidelines, and FDA indications relevant to your patient's drug and diagnosis.",
    icon: Scale,
    color: "text-[#7C3AED]",
    bg: "bg-[#F5F3FF]",
    prompt: "Find clinical evidence supporting this prior authorization",
    stat: "500+ sources",
    statColor: "text-[#7C3AED]"
  },
  {
    id: "appeal_gen",
    title: "Appeal Generator",
    desc: "Draft formal, payer-specific appeal letters with supporting clinical evidence and step therapy documentation.",
    icon: MessageSquare,
    color: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    prompt: "Generate a formal appeal letter for this denied PA case",
    stat: "58% success",
    statColor: "text-[#DC2626]"
  },
  {
    id: "pa_insights",
    title: "PA Insights",
    desc: "Predictive analytics showing approval likelihood, documentation score, and comparison with similar cases.",
    icon: BarChart3,
    color: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    prompt: "Analyze the PA approval likelihood for this case",
    stat: "Predicts in ~2s",
    statColor: "text-[#D97706]"
  },
  {
    id: "what_documents",
    title: "Document Checklist",
    desc: "AI generates a complete list of required documents for this drug, diagnosis, and payer combination.",
    icon: ClipboardCheck,
    color: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    prompt: "What documents are required for this prior authorization?",
    stat: "Payer-specific",
    statColor: "text-[#16A34A]"
  },
  {
    id: "why_denied",
    title: "Denial Analysis",
    desc: "AI reviews denial reasons, identifies missing documentation gaps, and recommends the strongest appeal path.",
    icon: AlertTriangle,
    color: "text-[#EA580C]",
    bg: "bg-[#FFF7ED]",
    prompt: "Analyze why this prior authorization was denied and what to do next",
    stat: "Gap analysis",
    statColor: "text-[#EA580C]"
  },
];

export default function ProviderAIFeatures() {
  const [tab, setTab] = useState("features");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [aiFeature, setAiFeature] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const openAI = (featureId: string) => {
    setAiFeature(featureId);
    setIsAiOpen(true);
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 1400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] border border-[#BFDBFE] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">GenAI-Powered</span>
            <span className="px-2.5 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">6 Features</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1D4ED8]">ClearAuth AI Capabilities</h1>
          <p className="text-[#2563EB] text-sm mt-2 max-w-xl">
            Leverage AI to automate clinical documentation, check coverage guidelines instantly, and predict PA success rates based on historical data.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setIsDocsOpen(true)}
            className="px-5 py-2.5 bg-white border-2 border-[#2563EB] text-[#2563EB] font-bold rounded-xl hover:bg-[#EFF6FF] transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Documents & EHR
          </button>
          <button
            onClick={() => { setAiFeature(null); setIsAiOpen(true); }}
            className="px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl shadow-md hover:bg-[#1D4ED8] hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Open AI Assistant
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[{ id: "features", label: "AI Features" }, { id: "analyzer", label: "Document Analyzer" }, { id: "insights", label: "PA Insights" }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors",
              tab === t.id ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "features" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {AI_FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => openAI(f.id)}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", f.bg)}>
                    <Icon className={cn("w-5 h-5", f.color)} />
                  </div>
                  <span className={cn("text-[11px] font-bold", f.statColor)}>{f.stat}</span>
                </div>
                <h3 className="font-bold text-[#111827] text-[15px] mb-2">{f.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                  Open in AI Assistant →
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "analyzer" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">Document Analyzer</h2>
            <p className="text-sm text-[#6B7280] mb-6">Upload or select EHR documents and AI will analyze for PA completeness, gaps, and readiness score.</p>

            <div
              onClick={() => setIsDocsOpen(true)}
              className="border-2 border-dashed border-[#BFDBFE] rounded-xl p-8 text-center hover:bg-[#EFF6FF]/30 hover:border-[#2563EB] transition-all cursor-pointer mb-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-[#2563EB]" />
              </div>
              <p className="font-bold text-[#111827]">Click to upload documents or import from EHR</p>
              <p className="text-sm text-[#6B7280] mt-1">PDF, DOC, images · or connect Epic, LabCorp, Quest</p>
            </div>

            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {analyzing
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing Documents...</>
                : <><Sparkles className="w-4 h-4" /> Analyze for PA Readiness</>
              }
            </button>

            {analyzed && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#111827]">Analysis Results</h3>
                  <span className="px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#D97706] text-[11px] font-bold border border-[#FDE68A]">82% Ready</span>
                </div>
                {[
                  { label: "Step Therapy Documentation", pass: true },
                  { label: "ICD-10 Code Present", pass: true },
                  { label: "Disease Activity Score (DAS28)", pass: true },
                  { label: "Lab Results (CBC/CRP)", pass: false },
                  { label: "Specialist Consultation Note", pass: false },
                ].map((item, i) => (
                  <div key={i} className={cn("flex items-center gap-3 p-3 rounded-lg", item.pass ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]")}>
                    {item.pass
                      ? <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    }
                    <span className={cn("text-sm font-medium", item.pass ? "text-[#14532D]" : "text-[#991B1B]")}>{item.label}</span>
                    {!item.pass && <span className="ml-auto text-[11px] text-[#DC2626] font-semibold">Missing</span>}
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => openAI("what_documents")} className="flex-1 py-2 border-2 border-[#2563EB] text-[#2563EB] text-sm font-bold rounded-lg hover:bg-[#EFF6FF] transition-colors">
                    See Full Checklist
                  </button>
                  <button onClick={() => setIsDocsOpen(true)} className="flex-1 py-2 bg-[#16A34A] text-white text-sm font-bold rounded-lg hover:bg-[#15803D] transition-colors">
                    Upload Missing Docs
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-[#16A34A]" />
                <h3 className="font-bold text-[#111827] text-sm">Connected EHR Systems</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Epic EHR", status: "Connected", type: "Clinical Notes", color: "#16A34A" },
                  { name: "Quest Diagnostics", status: "Connected", type: "Lab Results", color: "#16A34A" },
                  { name: "LabCorp", status: "Connected", type: "Lab Reports", color: "#16A34A" },
                  { name: "CVS Pharmacy", status: "Syncing", type: "Rx History", color: "#D97706" },
                ].map(sys => (
                  <div key={sys.name} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827]">{sys.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{sys.type}</p>
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: sys.color }}>{sys.status}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsDocsOpen(true)} className="w-full mt-3 py-2 border rounded-lg text-[13px] font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                Manage Documents →
              </button>
            </div>

            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5">
              <h3 className="font-bold text-[#1D4ED8] mb-3">AI Document Tips</h3>
              <ul className="space-y-2 text-[12.5px] text-[#2563EB]">
                <li className="flex gap-2"><span>•</span> Always include the last 3 months of lab results</li>
                <li className="flex gap-2"><span>•</span> Step therapy must show start/end dates and response</li>
                <li className="flex gap-2"><span>•</span> Specialist letters should reference the specific drug</li>
                <li className="flex gap-2"><span>•</span> Disease activity scores (DAS28) significantly improve approval rates</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border-4 border-[#16A34A] flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-[#16A34A]">78%</span>
            </div>
            <p className="font-bold text-[#111827]">Approval Likelihood</p>
            <p className="text-sm text-[#6B7280] mt-1">Based on documentation score & payer history</p>
          </div>
          <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#EFF6FF] border-4 border-[#2563EB] flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#2563EB]">3.2d</span>
            </div>
            <p className="font-bold text-[#111827]">Avg Processing Time</p>
            <p className="text-sm text-[#6B7280] mt-1">For similar Rinvoq/RA cases at Aetna</p>
          </div>
          <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border-4 border-[#D97706] flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#D97706]">82%</span>
            </div>
            <p className="font-bold text-[#111827]">Documentation Score</p>
            <p className="text-sm text-[#6B7280] mt-1">Missing: CBC, specialist letter</p>
          </div>

          <div className="md:col-span-3 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Recommendations to Increase Approval Rate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Add CBC with Differential", impact: "+8%", desc: "Lab safety screening required by Aetna biologic policy", action: "Upload to EHR", color: "#DC2626" },
                { title: "Specialist Letter — Co-signed", impact: "+12%", desc: "Rheumatologist must co-sign medical necessity statement", action: "Request from Specialist", color: "#D97706" },
                { title: "DAS28 Score in Notes", impact: "+7%", desc: "Disease activity score is already documented — ensure it's in the main PA form", action: "Auto-fill", color: "#2563EB" },
                { title: "Pharmacy Compliance Records", impact: "+5%", desc: "CVS records confirming MTX compliance over 24 months", action: "Import from EHR", color: "#7C3AED" },
              ].map(rec => (
                <div key={rec.title} className="border rounded-xl p-4 flex gap-3">
                  <div className="mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${rec.color}15` }}>
                    <span className="text-[11px] font-bold" style={{ color: rec.color }}>{rec.impact}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111827] text-[13px]">{rec.title}</p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">{rec.desc}</p>
                    <button className="mt-2 text-[12px] font-bold text-[#2563EB] hover:underline">{rec.action} →</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openAI("pa_insights")} className="mt-5 w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" /> Full AI Insights Analysis
            </button>
          </div>
        </div>
      )}

      <AIChatModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} initialFeature={aiFeature} />
      <DocumentsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}
