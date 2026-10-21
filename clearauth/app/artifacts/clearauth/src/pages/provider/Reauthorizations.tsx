import { useListReauthCases } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";

export default function Reauthorizations() {
  const { data: cases = [], isLoading } = useListReauthCases();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">Reauthorizations</h1>
      </div>

      <section>
        <h2 className="text-[15px] font-bold text-foreground mb-4">Upcoming Reauthorizations</h2>
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          No upcoming reauthorizations needed in the next 30 days
        </div>
      </section>

      <section>
        <h2 className="text-[15px] font-bold text-foreground mb-4">Recently Reauthorized</h2>
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medication</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Original Approval</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Reauthorized</th>
                <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">New Expiration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : cases.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-semibold text-foreground">{c.patientName}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-bold text-foreground">{c.drug}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{c.condition}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground">{c.originalApproval}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground">{c.reauthorized}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-[#16A34A]">{c.newExpiration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
