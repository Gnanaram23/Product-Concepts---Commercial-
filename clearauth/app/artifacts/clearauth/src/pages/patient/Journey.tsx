import { useAuth } from "@/context/AuthContext";
import { useListCases } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/shared/UIComponents";
import { CheckCircle, Clock, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: "PA Submitted", date: "Apr 4, 2025" },
  { id: 2, name: "Received by Payer", date: "Apr 4, 2025" },
  { id: 3, name: "Clinical Review", date: "Apr 5, 2025" },
  { id: 4, name: "Decision Pending", date: "Est. Apr 9, 2025" },
  { id: 5, name: "Decision", date: "Est. Apr 9–11, 2025" },
  { id: 6, name: "Treatment Starts", date: "TBD" }
];

export default function Journey() {
  const { user } = useAuth();
  const { data: cases = [] } = useListCases();
  const myCase = cases.find(c => c.patientId === user?.id && c.status === 'review') || cases[0];
  
  if (!myCase) return null;

  const currentStep = 4; // Mock logic for 'Decision Pending' state as requested in spec

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{myCase.drug} — {myCase.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">Submitted by {myCase.provider} to {myCase.payer} · Apr 4, 2025</p>
        </div>
        <StatusBadge status={myCase.status} />
      </div>

      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        {/* Tracker */}
        <div className="relative flex items-start justify-between mb-16 px-4">
          <div className="absolute left-8 right-8 top-4 h-1 bg-muted rounded-full z-0" />
          <div className="absolute left-8 top-4 h-1 bg-[#2563EB] rounded-full z-0 transition-all duration-1000" style={{ width: `${(currentStep - 1) * 20}%` }} />
          
          {STEPS.map((step, i) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-24">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border-4 border-white",
                  isCompleted ? "bg-[#2563EB] text-white" : 
                  isCurrent ? "bg-[#D97706] text-white pulse-amber" : 
                  "bg-muted text-muted-foreground border-border"
                )}>
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="text-center">
                  <p className={cn("text-[11px] font-bold leading-tight", 
                    isCurrent ? "text-[#D97706]" : isCompleted ? "text-[#2563EB]" : "text-muted-foreground"
                  )}>{step.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6 Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step) => {
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className={cn("p-5 border rounded-xl relative", isCurrent ? "bg-[#EFF6FF] border-[#2563EB] shadow-md" : "bg-card")}>
                {isCurrent && <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#D97706] rounded-full pulse-amber" />}
                <p className={cn("font-bold text-sm", isCurrent ? "text-[#2563EB]" : "text-foreground")}>{step.id}. {step.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                <p className="text-sm mt-3 text-foreground leading-relaxed">
                  {step.id === 1 && "Your doctor compiled your medical records and submitted the official PA request form."}
                  {step.id === 2 && "The insurance company's system successfully received the electronic request."}
                  {step.id === 3 && "A clinical pharmacist or nurse reviewed the request against medical guidelines."}
                  {step.id === 4 && "The clinical review is complete. Waiting for final administrative sign-off."}
                  {step.id === 5 && "The final approval or denial is issued and communicated to your doctor."}
                  {step.id === 6 && "Once approved, you can pick up your medication from the pharmacy."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4">Evidence Being Reviewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-[#BBF7D0] bg-[#F0FDF4] rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#16A34A]" />
            <div>
              <p className="font-bold text-[#14532D] text-sm">Clinical Notes</p>
              <p className="text-[11px] text-[#16A34A] uppercase font-bold tracking-wide">Submitted</p>
            </div>
          </div>
          <div className="p-4 border border-[#BBF7D0] bg-[#F0FDF4] rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#16A34A]" />
            <div>
              <p className="font-bold text-[#14532D] text-sm">Lab Results</p>
              <p className="text-[11px] text-[#16A34A] uppercase font-bold tracking-wide">Submitted</p>
            </div>
          </div>
          <div className="p-4 border border-[#BBF7D0] bg-[#F0FDF4] rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#16A34A]" />
            <div>
              <p className="font-bold text-[#14532D] text-sm">Prior Auth Form</p>
              <p className="text-[11px] text-[#16A34A] uppercase font-bold tracking-wide">Submitted</p>
            </div>
          </div>
          <div className="p-4 border border-[#FDE68A] bg-[#FFFBEB] rounded-xl flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#D97706]" />
            <div>
              <p className="font-bold text-[#B45309] text-sm">Specialist Letter</p>
              <p className="text-[11px] text-[#D97706] uppercase font-bold tracking-wide">Needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
