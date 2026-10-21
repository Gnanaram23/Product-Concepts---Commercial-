import { X, FileText, CheckCircle, Clock, AlertTriangle, Download, ArrowRight, Activity, Plus } from "lucide-react";
import { PACase } from "@workspace/api-client-react";
import { StatusBadge, DrugChip, PayerChip, PriorityBadge } from "../shared/UIComponents";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUpdateCase, useSubmitCase, useAppealCase } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const STEPS = [
  { id: 1, name: "PA Submitted" },
  { id: 2, name: "Received by Payer" },
  { id: 3, name: "Clinical Review" },
  { id: 4, name: "Decision Pending" },
  { id: 5, name: "Decision" },
  { id: 6, name: "Treatment Starts" }
];

export function PADetailModal({ c, isOpen, onClose, onOpenAI }: { c: PACase | null; isOpen: boolean; onClose: () => void; onOpenAI: (feat: string) => void }) {
  const { role } = useAuth();
  const { toast } = useToast();
  const updateCaseMutation = useUpdateCase();
  const submitCaseMutation = useSubmitCase();
  const appealCaseMutation = useAppealCase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !c) return null;

  // Determine current step based on status
  let currentStep = 1;
  if (c.status === 'review') currentStep = 3;
  if (c.status === 'approved' || c.status === 'denied') currentStep = 5;

  const handleAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      if (action === 'submit') {
        await submitCaseMutation.mutateAsync({ id: c.id });
        toast({ title: "Case submitted successfully!" });
      } else if (action === 'appeal') {
        await appealCaseMutation.mutateAsync({ id: c.id });
        toast({ title: "Appeal filed successfully!" });
      } else if (action === 'approve') {
        await updateCaseMutation.mutateAsync({ id: c.id, data: { status: 'approved' } });
        toast({ title: "Case approved!", className: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]" });
      } else if (action === 'deny') {
        const reason = prompt("Enter denial reason:");
        if (reason) {
          await updateCaseMutation.mutateAsync({ id: c.id, data: { status: 'denied', denialReason: reason } });
          toast({ title: "Case denied", variant: "destructive" });
        }
      }
      onClose();
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground">Case {c.id} — {c.patientName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface2/50">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={c.status} />
            <PayerChip>{c.payer}</PayerChip>
            <DrugChip>{c.drug}</DrugChip>
            <PriorityBadge priority={c.priority} />
          </div>

          {/* Info Grid */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Patient</p>
                <p className="text-sm font-semibold text-foreground">{c.patientName}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">DOB</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(c.patientDob)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Condition</p>
                <p className="text-sm font-semibold text-foreground">{c.condition}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-sm font-semibold text-foreground">{formatDate(c.submittedDate)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                <p className={cn("text-sm font-semibold", c.priority === 'high' ? "text-destructive" : "text-foreground")}>
                  {formatDate(c.dueDate)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Auth Number</p>
                <p className={cn("text-sm font-semibold", c.authNumber ? "text-[#16A34A]" : "text-muted-foreground")}>
                  {c.authNumber || "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {c.status === 'denied' && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#DC2626]">Authorization Denied</h4>
                  <p className="text-sm text-[#991B1B] mt-1">{c.denialReason}</p>
                  {role === 'provider' && (
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => { onClose(); onOpenAI('appeal_gen'); }} className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-md shadow-sm hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5">
                        🤖 Generate Appeal
                      </button>
                      <button className="px-3 py-1.5 bg-white border border-[#FECACA] text-[#DC2626] text-xs font-bold rounded-md shadow-sm hover:bg-[#FEF2F2] transition-colors">
                        View Denial Letter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {c.status === 'approved' && c.authNumber && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 shadow-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#16A34A]" />
              <div>
                <h4 className="text-sm font-bold text-[#16A34A]">Authorization Approved</h4>
                <p className="text-sm text-[#14532D] mt-0.5">Auth Number: <span className="font-mono font-bold bg-white/50 px-1 rounded">{c.authNumber}</span> | Valid: {formatDate(c.authValidFrom)} – {formatDate(c.authValidUntil)}</p>
              </div>
            </div>
          )}

          {/* PA Journey Tracker */}
          <div>
            <h3 className="text-[13px] font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> PA Journey
            </h3>
            <div className="relative flex items-center justify-between px-2">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-border rounded-full z-0" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500" style={{ width: `${(currentStep - 1) * 20}%` }} />
              
              {STEPS.map((step, i) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                      isCompleted ? "bg-primary text-white shadow-sm" : 
                      isCurrent ? "bg-amber-500 text-white pulse-amber" : 
                      "bg-white border-2 border-border text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className={cn("text-[10px] font-semibold absolute top-8 whitespace-nowrap", 
                      isCurrent ? "text-amber-600" : isCompleted ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-foreground">Documents</h3>
                {role !== 'payer' && (
                  <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Attach Document
                  </button>
                )}
              </div>
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                {c.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{doc}</span>
                    </div>
                    <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" /> Activity Timeline
              </h3>
              <div className="bg-white border rounded-xl p-4 shadow-sm max-h-[200px] overflow-y-auto">
                <div className="space-y-4">
                  {c.timeline.map((event, i) => (
                    <div key={i} className="flex gap-3 relative">
                      {i !== c.timeline.length - 1 && (
                        <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-border" />
                      )}
                      <div className={cn("w-5 h-5 rounded-full shrink-0 border-4 border-white shadow-sm z-10", 
                        event.eventType === 'approved' ? 'bg-[#16A34A]' :
                        event.eventType === 'denied' ? 'bg-[#DC2626]' :
                        event.eventType === 'in_review' ? 'bg-[#D97706]' : 'bg-[#2563EB]'
                      )} />
                      <div className="pb-1">
                        <p className="text-[13px] font-bold text-foreground">{event.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(event.date)} · {event.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Close
          </button>
          
          {role === 'provider' && c.status === 'pending' && (
            <button onClick={() => handleAction('submit')} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:bg-primary-border flex items-center gap-2">
              Share with Payer <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          {role === 'provider' && c.status === 'denied' && (
            <button onClick={() => handleAction('appeal')} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold bg-[#DC2626] text-white rounded-lg shadow-sm hover:bg-[#B91C1C] flex items-center gap-2">
              File Appeal <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {role === 'payer' && c.status === 'review' && (
            <>
              <button onClick={() => handleAction('deny')} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold bg-white border border-[#FECACA] text-[#DC2626] rounded-lg hover:bg-[#FEF2F2]">
                Deny
              </button>
              <button onClick={() => handleAction('approve')} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]">
                Approve Case
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
