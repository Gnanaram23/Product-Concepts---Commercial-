import { useAuth } from "@/context/AuthContext";
import { useListCases } from "@workspace/api-client-react";
import { StatusBadge, DrugChip, PayerChip } from "@/components/shared/UIComponents";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";

export default function PatientCases() {
  const { user } = useAuth();
  const { data: cases = [] } = useListCases();
  const myCases = cases.filter(c => c.patientId === user?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">My Cases</h1>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Case ID</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medication</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Condition</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Doctor</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Payer</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {myCases.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-[12px] text-ink2">{c.id}</td>
                <td className="px-4 py-3"><DrugChip>{c.drug}</DrugChip></td>
                <td className="px-4 py-3 text-[13px] text-foreground">{c.condition}</td>
                <td className="px-4 py-3 text-[13px] text-foreground">{c.provider}</td>
                <td className="px-4 py-3"><PayerChip>{c.payer}</PayerChip></td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-[12px] text-foreground">{formatDate(c.submittedDate)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href="/patient/journey" className="text-[12.5px] font-bold text-primary hover:underline">
                    Track →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
