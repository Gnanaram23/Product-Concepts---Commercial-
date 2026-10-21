import { Activity, Pill, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/shared/UIComponents";
import { useGetPatient, useListCases } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: patient } = useGetPatient(user?.id || "");
  const { data: cases = [] } = useListCases();

  const myCases = cases.filter(c => c.patientId === user?.id);
  const currentCase = myCases.find(c => c.status === 'review') || myCases[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your medication approvals and manage your documents.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
          <p className="text-[28px] font-bold text-foreground leading-none">1</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">In Review</p>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
          <p className="text-[28px] font-bold text-[#16A34A] leading-none">1</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">Approved</p>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
          <p className="text-[28px] font-bold text-[#DC2626] leading-none">0</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">Denied</p>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm text-center">
          <p className="text-[28px] font-bold text-[#D97706] leading-none">0</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">Re-auth Due</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {currentCase && (
            <div className="bg-card border border-l-4 border-l-primary rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Current PA Status</h2>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{currentCase.drug}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Case: <span className="font-mono">{currentCase.id}</span></p>
                </div>
                <StatusBadge status={currentCase.status} />
              </div>
              <p className="text-sm text-foreground mt-4 leading-relaxed bg-muted/30 p-3 rounded-lg border">
                Your doctor submitted a request to {currentCase.payer}. A medical reviewer is currently evaluating your case.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Expected decision: <span className="text-foreground">3-5 business days</span></p>
                <Link href="/patient/journey" className="px-4 py-2 border border-primary text-primary text-sm font-bold rounded-lg hover:bg-primary/5 transition-colors">
                  Track Journey →
                </Link>
              </div>
            </div>
          )}

          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" /> My Medications
            </h2>
            <div className="space-y-3">
              {patient?.medications.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20">
                  <div>
                    <p className="font-bold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.dose} · {m.condition}</p>
                  </div>
                  <StatusBadge status={m.paStatus} />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">{patient?.payer}</h2>
                <p className="text-sm text-muted-foreground">{patient?.plan}</p>
              </div>
            </div>
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member ID</span>
                <span className="font-semibold">{patient?.memberId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deductible</span>
                <span className="font-semibold">{patient?.deductible}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Copay</span>
                <span className="font-semibold">{patient?.copay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-semibold text-primary">{patient?.payerContact}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 shadow-sm flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#B45309]">Action May Be Needed</p>
              <p className="text-xs text-[#D97706] mt-1 leading-relaxed">If your PA is denied, your doctor can file an appeal. You have the right to a peer-to-peer review.</p>
              <Link href="/patient/ai" className="text-xs font-bold text-[#B45309] mt-2 inline-block hover:underline">Learn more →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
