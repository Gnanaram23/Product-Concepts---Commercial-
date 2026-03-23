import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Bot, User, FileText, Scale, Zap, Activity, MessageSquare, Heart, AlertTriangle, ClipboardCheck, BarChart3, RefreshCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAiChat } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

type Feature = { id: string; title: string; desc: string; icon: React.ElementType; prompt: string };

const FEATURES: Record<string, Feature[]> = {
  provider: [
    { id: "clinical_doc", title: "Clinical Documentation", desc: "Auto-generate PA justification", icon: FileText, prompt: "Generate clinical documentation for this prior authorization case" },
    { id: "evidence_search", title: "Evidence Search", desc: "Find clinical guidelines & trials", icon: Scale, prompt: "Search for clinical evidence to support this prior authorization" },
    { id: "appeal_gen", title: "Appeal Generator", desc: "Draft formal appeal letters", icon: MessageSquare, prompt: "Generate a formal appeal letter for this denied prior authorization" },
    { id: "pa_insights", title: "PA Insights", desc: "Approval likelihood & analytics", icon: BarChart3, prompt: "Analyze the PA approval likelihood and provide insights for this case" },
    { id: "what_documents", title: "Document Checklist", desc: "Required docs for this drug/case", icon: ClipboardCheck, prompt: "What documents are required for this prior authorization?" },
    { id: "why_denied", title: "Denial Analysis", desc: "Understand denial reasoning", icon: AlertTriangle, prompt: "Analyze why this prior authorization was denied and how to fix it" },
  ],
  patient: [
    { id: "treatment_explain", title: "Treatment Explainer", desc: "Plain language medication info", icon: Heart, prompt: "Explain my medication and why I need prior authorization in simple terms" },
    { id: "pa_status", title: "PA Status Helper", desc: "What your status means", icon: Activity, prompt: "What does my current prior authorization status mean?" },
    { id: "side_effects", title: "Side Effect Guidance", desc: "What to watch out for", icon: AlertTriangle, prompt: "What side effects should I watch for with my medication?" },
    { id: "how_long", title: "Processing Time", desc: "When to expect a decision", icon: RefreshCcw, prompt: "How long does prior authorization typically take and when will I get a decision?" },
    { id: "what_if_denied", title: "If Denied — My Rights", desc: "Appeal options & next steps", icon: Scale, prompt: "What happens if my prior authorization is denied? What are my rights?" },
  ],
  payer: [
    { id: "clinical_review", title: "Clinical Review", desc: "AI-automated policy analysis", icon: ClipboardCheck, prompt: "Perform a clinical review of this case against our coverage policy" },
    { id: "guideline_match", title: "Guideline Match", desc: "Check against coverage criteria", icon: Scale, prompt: "Match this case to our coverage guidelines and identify any gaps" },
    { id: "alt_suggest", title: "Alternative Analysis", desc: "Formulary alternatives", icon: Zap, prompt: "What formulary alternatives are available and covered for this patient?" },
    { id: "denial_letter", title: "Denial Letter", desc: "Draft formal denial notice", icon: FileText, prompt: "Draft a formal denial letter for this prior authorization case" },
    { id: "match_guidelines", title: "Full Policy Match", desc: "Complete criteria checklist", icon: BarChart3, prompt: "Run a complete policy criteria match and provide a checklist for this case" },
    { id: "review_case", title: "Case Summary", desc: "AI case overview & recommendation", icon: Bot, prompt: "Provide an AI-generated case summary and review recommendation" },
  ]
};

const QUICK_CHIPS: Record<string, string[]> = {
  provider: ["Draft appeal letter", "Check approval likelihood", "What documents are needed?", "Summarise clinical docs"],
  patient: ["What does my status mean?", "How long will this take?", "What if it's denied?", "Explain my medication"],
  payer: ["Match to guidelines", "Analyze clinical criteria", "Suggest alternatives", "Draft denial letter"]
};

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;
    while (remaining.includes('**')) {
      const start = remaining.indexOf('**');
      const end = remaining.indexOf('**', start + 2);
      if (end === -1) break;
      if (start > 0) parts.push(<span key={key++}>{remaining.slice(0, start)}</span>);
      parts.push(<strong key={key++} className="font-semibold text-foreground">{remaining.slice(start + 2, end)}</strong>);
      remaining = remaining.slice(end + 2);
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>);
    if (line.startsWith('---')) return <hr key={i} className="border-border/50 my-2" />;
    if (line.startsWith('# ')) return <div key={i} className="font-bold text-base text-foreground mt-1">{parts.slice(1)}</div>;
    if (line === '') return <div key={i} className="h-2" />;
    return <div key={i} className="leading-relaxed">{parts.length ? parts : line}</div>;
  });
}

export function AIChatModal({ isOpen, onClose, initialFeature = null }: { isOpen: boolean; onClose: () => void; initialFeature?: string | null }) {
  const { role } = useAuth();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiChatMutation = useAiChat();

  const activeFeatures = FEATURES[role ?? 'provider'] ?? FEATURES.provider;
  const activeChips = QUICK_CHIPS[role ?? 'provider'] ?? QUICK_CHIPS.provider;

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setSelectedFeature(null);
      if (initialFeature) {
        const f = activeFeatures.find(x => x.id === initialFeature);
        if (f) handleFeatureClick(f);
      }
    }
  }, [isOpen, initialFeature]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !role) return null;

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setMessages([{ role: 'user', content: feature.prompt }]);
    callAI(feature.prompt, feature.id);
  };

  const callAI = async (text: string, feature?: string) => {
    try {
      const res = await aiChatMutation.mutateAsync({
        data: { role, message: text, feature: feature ?? selectedFeature?.id ?? "general" }
      });
      setTimeout(() => {
        setMessages(p => [...p, { role: 'ai', content: res.response }]);
      }, 600);
    } catch {
      setTimeout(() => {
        setMessages(p => [...p, { role: 'ai', content: "I'm sorry, I couldn't process that request. Please try again." }]);
      }, 600);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || aiChatMutation.isPending) return;
    setInput("");
    setMessages(p => [...p, { role: 'user', content: text }]);
    callAI(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-[780px] max-w-[95vw] h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="h-[56px] border-b flex items-center justify-between px-5 bg-gradient-to-r from-[#EFF6FF] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#111827] leading-tight">ClearAuth AI Assistant</h2>
              <p className="text-[11px] text-[#6B7280]">Role: {role?.charAt(0).toUpperCase() + (role?.slice(1) ?? '')} • GenAI-Powered</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-[#6B7280] hover:text-[#111827]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Feature Panel */}
          <div className="w-[200px] border-r bg-[#F9FAFB] flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 border-b">
              <p className="text-[10.5px] uppercase font-bold text-[#9CA3AF] tracking-wider">⚡ AI Features</p>
            </div>
            <div className="p-2 space-y-1">
              {activeFeatures.map(f => {
                const Icon = f.icon;
                const isActive = selectedFeature?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFeatureClick(f)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl border transition-all group",
                      isActive
                        ? "bg-[#EFF6FF] border-[#BFDBFE] shadow-sm"
                        : "border-transparent hover:bg-white hover:border-[#E5E7EB] hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", isActive ? "text-[#2563EB]" : "text-[#9CA3AF] group-hover:text-[#6B7280]")} />
                      <div className="min-w-0">
                        <div className={cn("text-[12px] font-bold leading-tight", isActive ? "text-[#1D4ED8]" : "text-[#374151]")}>{f.title}</div>
                        <div className="text-[10.5px] text-[#9CA3AF] mt-0.5 leading-tight">{f.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Quick Chips */}
            <div className="px-4 py-2.5 border-b bg-white flex flex-wrap gap-2 shrink-0">
              {activeChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => {
                    setMessages(p => [...p, { role: 'user', content: chip }]);
                    callAI(chip);
                  }}
                  disabled={aiChatMutation.isPending}
                  className="px-3 py-1 rounded-full bg-[#F3F4F6] border text-[#374151] text-[11.5px] font-medium hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#2563EB] transition-colors disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                    <Bot className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111827] mb-1">AI Assistant Ready</h3>
                  <p className="text-[13px] text-[#6B7280] max-w-xs">
                    Select a feature from the left panel or use the quick chips above to get started.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    m.role === 'ai' ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#2563EB] text-white"
                  )}>
                    {m.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={cn("max-w-[80%] p-3.5 text-[13px] shadow-sm leading-relaxed",
                    m.role === 'ai'
                      ? "bg-white border border-[#E5E7EB] text-[#111827] rounded-[4px_16px_16px_16px]"
                      : "bg-[#2563EB] text-white rounded-[16px_4px_16px_16px]"
                  )}>
                    {m.role === 'ai' ? renderMarkdown(m.content) : m.content}
                  </div>
                </div>
              ))}
              {aiChatMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-white border text-foreground rounded-[4px_16px_16px_16px] shadow-sm flex gap-1.5 items-center">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white shrink-0">
              <div className="flex items-end gap-2 border rounded-xl bg-[#F9FAFB] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#EFF6FF] transition-all p-1.5">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); }
                  }}
                  placeholder="Ask a follow-up question or type your own query..."
                  className="flex-1 bg-transparent border-none outline-none resize-none min-h-[36px] max-h-[100px] px-2 text-sm text-[#111827] placeholder:text-[#9CA3AF]"
                  rows={1}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || aiChatMutation.isPending}
                  className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1D4ED8] transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <p className="text-[10.5px] text-[#9CA3AF] mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
