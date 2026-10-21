import { useState } from "react";
import { Sparkles, CheckCircle, AlertTriangle, FileText, Search, BarChart3, Shield, ClipboardCheck, Bot, Scale, Zap } from "lucide-react";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { cn } from "@/lib/utils";
import { useListCases } from "@workspace/api-client-react";

const AI_FEATURES = [
  { id: "clinical_review", title: "Clinical Review", desc: "AI cross-references submitted docs against payer policy", icon: ClipboardCheck, color: "text-[#D97706]", bg: "bg-[#FFFBEB]" },
  { id: "guideline_match", title: "Guideline Match", desc: "Full coverage criteria checklist per drug/diagnosis", icon: Scale, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
  { id: "alt_suggest", title: "Alternative Analysis", desc: "Formulary alternatives ranked by cost and coverage", icon: Zap, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
  { id: "denial_letter", title: "Denial Letter", desc: "AI-drafted formal denial notice with reasons", icon: FileText, color: "text-[#DC2626]", bg: "bg-[#FEF2F2]" },
  { id: "match_guidelines", title: "Full Policy Match", desc: "Complete criteria table with pass/fail per item", icon: BarChart3, color: "text-[#7C3AED]", bg: "bg-[#F5F3FF]" },
  { id: "review_case", title: "Case Summary", desc: "AI overview, risk score, and review recommendation", icon: Bot, color: "text-[#0891B2]", bg: "bg-[#ECFEFF]" },
];

const TABS = [
  { id: "features", label: "AI Features" },
  { id: "review", label: "Clinical Review" },
  { id: "match", label: "Guideline Match" },
  { id: "analytics", label: "Analytics" },
];

export default function PayerAIFeatures() {
  const [tab, setTab] = useState("features");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiFeature, setAiFeature] = useState<string | null>(null);
  const [reviewRunning, setReviewRunning] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const { data: cases = [] } = useListCases();

  const openAI = (feat: string) => {
    setAiFeature(feat);
    setIsAiOpen(true);
  };

  const runReview = () => {
    setReviewRunning(true);
    setTimeout(() => { setReviewRunning(false); setReviewDone(true); }, 1400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FFF7ED] border border-[#FDE68A] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">Payer AI Tools</span>
            <span className="px-2.5 py-1 rounded-full bg-[#92400E] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">6 Features</span>
          </div>
          <h1 className="text-2xl font-bold text-[#92400E]">AI-Powered Review Suite</h1>
          <p className="text-[#D97706] text-sm mt-2 max-w-xl">
            Automated clinical criteria matching, guideline alignment checks, and intelligent analytics to help your team make faster, consistent coverage decisions.
          </p>
        </div>
        <button
          onClick={() => { setAiFeature(null); setIsAiOpen(true); }}
          className="shrink-0 px-6 py-3 bg-[#D97706] text-white font-bold rounded-xl shadow-md hover:bg-[#B45309] hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" /> Open AI Assistant
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors",
              tab === t.id ? "border-[#D97706] text-[#D97706]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
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
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", f.bg)}>
                  <Icon className={cn("w-5 h-5", f.color)} />
                </div>
                <h3 className="font-bold text-[#111827] text-[15px] mb-2">{f.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{f.desc}</p>
                <p className="text-[12px] font-bold text-[#D97706] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Open in AI Assistant →</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === "review" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">Automated Clinical Review</h2>
            <p className="text-sm text-[#6B7280] mb-6">Select a pending case and AI will cross-reference with payer policy and clinical guidelines.</p>

            <div className="space-y-3 mb-6">
              {cases.filter(c => c.status === 'review').slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-[#FAFAFA] transition-colors">
                  <div>
                    <p className="font-bold text-sm text-[#111827]">{c.drug}</p>
                    <p className="text-xs text-[#9CA3AF] font-mono">{c.id} · {c.patientName}</p>
                  </div>
                  <button
                    onClick={runReview}
                    disabled={reviewRunning}
                    className="px-3 py-1.5 border-2 border-[#D97706] text-[#D97706] text-xs font-bold rounded-lg hover:bg-[#FFFBEB] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {reviewRunning
                      ? <><span className="animate-spin w-3 h-3 border-2 border-[#D97706] border-t-transparent rounded-full inline-block" /> Reviewing...</>
                      : <><Search className="w-3 h-3" /> AI Review</>
                    }
                  </button>
                </div>
              ))}
              {cases.filter(c => c.status === 'review').length === 0 && (
                <div className="text-center py-8 text-[#9CA3AF] text-sm border-2 border-dashed rounded-xl">No cases currently under review</div>
              )}
            </div>

            {reviewDone && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                  <span className="font-bold text-[#111827]">AI Review Complete — PA-554089</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#BBF7D0]">
                    <h4 className="font-bold text-[#16A34A] flex items-center gap-1.5 mb-2"><CheckCircle className="w-4 h-4" /> Criteria Met (4)</h4>
                    <ul className="text-sm text-[#14532D] space-y-1.5">
                      <li className="flex gap-1.5">✓ Diagnosis code matches policy scope</li>
                      <li className="flex gap-1.5">✓ MTX step therapy (24 months)</li>
                      <li className="flex gap-1.5">✓ DAS28 score (&gt;3.2) documented</li>
                      <li className="flex gap-1.5">✓ Prescriber is rheumatologist</li>
                    </ul>
                  </div>
                  <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A]">
                    <h4 className="font-bold text-[#D97706] flex items-center gap-1.5 mb-2"><AlertTriangle className="w-4 h-4" /> Gaps Found (2)</h4>
                    <ul className="text-sm text-[#92400E] space-y-1.5">
                      <li className="flex gap-1.5">⚠ Second csDMARD records missing</li>
                      <li className="flex gap-1.5">⚠ CBC within 90 days not submitted</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#92400E]">AI Recommendation: Send AIR</p>
                    <p className="text-sm text-[#D97706] mt-0.5">Request second csDMARD records + CBC before final decision</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openAI("denial_letter")} className="px-3 py-1.5 border border-[#D97706] text-[#D97706] text-xs font-bold rounded-lg hover:bg-[#FFFBEB]">Draft AIR Letter</button>
                    <button onClick={() => openAI("alt_suggest")} className="px-3 py-1.5 bg-[#D97706] text-white text-xs font-bold rounded-lg">Alternatives</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#111827] mb-4">AI Capabilities</h3>
              <div className="space-y-4">
                {[
                  { feat: "clinical_review", icon: Search, color: "text-[#D97706]", bg: "bg-[#FFFBEB]", title: "Clinical Policy Match", desc: "Cross-reference with 500+ payer guidelines" },
                  { feat: "guideline_match", icon: Shield, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]", title: "Guideline Alignment", desc: "Auto-match to FDA/specialty guidelines" },
                  { feat: "alt_suggest", icon: FileText, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]", title: "Alternative Suggestions", desc: "Propose formulary-compliant alternatives" },
                  { feat: "denial_letter", icon: AlertTriangle, color: "text-[#DC2626]", bg: "bg-[#FEF2F2]", title: "Denial/AIR Letters", desc: "Draft formal determination letters" },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.feat} className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => openAI(item.feat)}>
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", item.bg)}>
                        <Icon className={cn("w-4 h-4", item.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111827]">{item.title}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5">
              <p className="text-xs font-bold text-[#92400E] mb-1">Processing Speed</p>
              <p className="text-4xl font-bold text-[#D97706]">5x</p>
              <p className="text-xs text-[#D97706] mt-1">Faster review vs. manual process</p>
            </div>
          </div>
        </div>
      )}

      {tab === "match" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">Guideline Match Engine</h2>
            <p className="text-sm text-[#6B7280] mb-6">AI automatically cross-references submitted PA requests against clinical coverage guidelines and formulary criteria.</p>
            <div className="space-y-4">
              {[
                { label: "Step Therapy Compliance", pct: 92, color: "#16A34A" },
                { label: "Diagnosis Code Match", pct: 87, color: "#2563EB" },
                { label: "Dosage Appropriateness", pct: 78, color: "#D97706" },
                { label: "Medical Necessity Evidence", pct: 65, color: "#D97706" },
                { label: "Safety Lab Requirements", pct: 45, color: "#DC2626" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="text-[#374151]">{item.label}</span>
                    <span style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => openAI("guideline_match")} className="mt-6 w-full py-2.5 bg-[#D97706] text-white font-bold rounded-lg hover:bg-[#B45309] transition-colors flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Run Full Guideline Analysis
            </button>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Coverage Criteria Checklist</h2>
            <div className="space-y-3">
              {[
                { text: "FDA-approved indication matches diagnosis (M05.79)", pass: true },
                { text: "Prescriber specialty — Rheumatologist", pass: true },
                { text: "Step therapy: MTX documented (24 months)", pass: true },
                { text: "Disease activity score (DAS28 > 3.2) documented", pass: true },
                { text: "Second csDMARD trial records on file", pass: false },
                { text: "CBC with differential within 90 days", pass: false },
                { text: "Specialist letter co-signed by rheumatologist", pass: false },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-start gap-3 p-3 rounded-lg", item.pass ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]")}>
                  {item.pass
                    ? <CheckCircle className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  }
                  <span className={cn("text-sm", item.pass ? "text-[#14532D]" : "text-[#991B1B]")}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openAI("denial_letter")} className="mt-4 w-full py-2.5 border-2 border-[#D97706] text-[#D97706] font-bold rounded-lg hover:bg-[#FFFBEB] transition-colors flex items-center justify-center gap-2 text-sm">
              Draft AIR Letter for Missing Criteria
            </button>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, color: "#D97706", label: "First-Pass Approval Rate", value: "73%", sub: "+8% with AI assistance" },
            { icon: CheckCircle, color: "#16A34A", label: "Average Processing Time", value: "1.8d", sub: "Industry avg: 8–14 days" },
            { icon: Shield, color: "#2563EB", label: "Policy Compliance Rate", value: "94%", sub: "Across all reviewed cases" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border rounded-2xl p-6 shadow-sm text-center">
                <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                <p className="text-4xl font-bold text-[#111827]">{stat.value}</p>
                <p className="text-sm font-bold text-[#374151] mt-2">{stat.label}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{stat.sub}</p>
              </div>
            );
          })}

          <div className="md:col-span-3 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">AI-Assisted Decision Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Auto-Approved by AI", value: "34%", color: "#16A34A", bg: "#F0FDF4" },
                { label: "Flagged for Manual Review", value: "52%", color: "#D97706", bg: "#FFFBEB" },
                { label: "AI-Suggested Denial / AIR", value: "14%", color: "#DC2626", bg: "#FEF2F2" },
              ].map(item => (
                <div key={item.label} className="p-5 rounded-xl border text-center" style={{ background: item.bg }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setAiFeature(null); setIsAiOpen(true); }} className="w-full py-3 bg-[#D97706] text-white font-bold rounded-xl hover:bg-[#B45309] transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Deep-Dive Analytics with AI
            </button>
          </div>
        </div>
      )}

      <AIChatModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} initialFeature={aiFeature} />
    </div>
  );
}
