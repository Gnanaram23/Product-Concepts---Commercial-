import { useState } from "react";
import { Sparkles, Activity, AlertCircle, FileText, Clock, Scale, HelpCircle } from "lucide-react";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { cn } from "@/lib/utils";

const AI_FEATURES = [
  {
    id: "treatment_explain",
    title: "Treatment Explainer",
    desc: "Get plain-language explanations of your medication, what prior authorization means, and what happens once you're approved.",
    icon: FileText,
    color: "text-[#2563EB]",
    bg: "bg-[#EFF6FF]",
    label: "Most Helpful",
    labelColor: "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]"
  },
  {
    id: "pa_status",
    title: "PA Status Helper",
    desc: "Confused by your current status? Ask the AI to explain exactly where your case is in the review process and what to expect next.",
    icon: Activity,
    color: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    label: "Real-Time",
    labelColor: "text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]"
  },
  {
    id: "side_effects",
    title: "Side Effect Guidance",
    desc: "Learn what side effects to watch for once you start your new medication, and know exactly when to call your doctor.",
    icon: AlertCircle,
    color: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    label: "Safety",
    labelColor: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]"
  },
  {
    id: "how_long",
    title: "How Long Will It Take?",
    desc: "Understand typical processing timelines for your insurance company and what factors affect how quickly you'll get a decision.",
    icon: Clock,
    color: "text-[#7C3AED]",
    bg: "bg-[#F5F3FF]",
    label: "Timeline",
    labelColor: "text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]"
  },
  {
    id: "what_if_denied",
    title: "If Denied — Your Rights",
    desc: "Know your full rights if your prior authorization is denied, including appeal steps, peer-to-peer reviews, and external reviews.",
    icon: Scale,
    color: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    label: "Know Your Rights",
    labelColor: "text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]"
  },
];

const FAQ = [
  { q: "Why does my insurance need prior authorization?", a: "Insurance companies require PA for certain medications to confirm they are medically necessary and that other treatments have been tried first. It's a cost-control and safety measure." },
  { q: "Will I have to pay if it's denied?", a: "If your PA is denied, you won't be covered for that medication unless you appeal. Your doctor can file an appeal, and about 58% of appeals are successful at the peer-to-peer stage." },
  { q: "Can I get my medication while waiting for approval?", a: "Sometimes. Ask your doctor about samples, a bridge prescription, or manufacturer patient assistance programs that can provide short-term coverage." },
  { q: "What is a peer-to-peer review?", a: "A peer-to-peer review is when your doctor speaks directly with the insurance company's physician to explain why you need this specific medication. It has a ~58–62% success rate." },
];

export default function PatientAIAssistant() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiFeature, setAiFeature] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openAI = (featureId: string | null = null) => {
    setAiFeature(featureId);
    setIsAiOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#EFF6FF] border border-[#BBF7D0] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-wide">Personal Health AI</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Your Personal AI Health Assistant</h1>
          <p className="text-[#16A34A] text-sm mt-2 max-w-xl">
            Get plain-language explanations of your medication, prior authorization status, and what to expect next — all without confusing medical jargon.
          </p>
        </div>
        <button
          onClick={() => openAI()}
          className="shrink-0 px-6 py-3 bg-[#16A34A] text-white font-bold rounded-xl shadow-md hover:bg-[#15803D] hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" /> Chat With AI Assistant
        </button>
      </div>

      {/* Current Case Status Card */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-[13px] text-[#6B7280] font-medium">Your Active Case</p>
            <p className="text-[16px] font-bold text-[#111827]">PA-554089 — Humira (adalimumab)</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-[12px] text-[#2563EB] font-semibold">Under Clinical Review</span>
              <span className="text-[12px] text-[#9CA3AF]">· Submitted April 4, 2025</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => openAI("pa_status")}
          className="px-4 py-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[13px] font-bold rounded-lg hover:bg-[#BFDBFE]/40 transition-colors flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Explain My Status
        </button>
      </div>

      {/* AI Feature Cards */}
      <div>
        <h2 className="text-[16px] font-bold text-[#111827] mb-4">What Can I Help You With?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", f.labelColor)}>{f.label}</span>
                </div>
                <h3 className="font-bold text-[#111827] text-[14px] mb-1.5">{f.title}</h3>
                <p className="text-[12.5px] text-[#6B7280] leading-relaxed">{f.desc}</p>
                <p className="text-[12px] font-bold text-[#16A34A] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Ask AI Assistant →</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="w-5 h-5 text-[#6B7280]" />
          <h2 className="text-[16px] font-bold text-[#111827]">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="text-[13px] font-semibold text-[#111827] pr-4">{item.q}</span>
                <span className={cn("text-[#6B7280] transition-transform shrink-0", openFaq === i ? "rotate-180" : "")}>▾</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-[13px] text-[#374151] leading-relaxed bg-[#F9FAFB] border-t">
                  <p className="mt-3">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => openAI()}
          className="w-full mt-4 py-2.5 border-2 border-[#16A34A] text-[#16A34A] font-bold rounded-xl hover:bg-[#F0FDF4] transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Sparkles className="w-4 h-4" /> Ask AI a Different Question
        </button>
      </div>

      <AIChatModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} initialFeature={aiFeature} />
    </div>
  );
}
