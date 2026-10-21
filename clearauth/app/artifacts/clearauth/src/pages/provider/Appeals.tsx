import { useListCases } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/UIComponents";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { useState } from "react";

export default function Appeals() {
  const { data: cases = [] } = useListCases();
  const deniedCases = cases.filter(c => c.status === 'denied');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiFeature, setAiFeature] = useState<string | null>(null);

  const handleAppeal = () => {
    setAiFeature("appeal_gen");
    setAiModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">Appeals Management</h1>
      </div>

      <section>
        <h2 className="text-[15px] font-bold text-foreground mb-4">Denied Authorizations</h2>
        {deniedCases.length === 0 ? (
          <EmptyState icon={FileText} title="No Denied Cases" description="You have no denied authorizations that require an appeal." />
        ) : (
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Case ID</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medication</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Denial Reason</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Denied Date</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deniedCases.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-[12px] text-ink2">{c.id}</span></td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-foreground">{c.patientName}</td>
                    <td className="px-4 py-3 text-[13px] text-foreground">{c.drug}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground max-w-[200px] truncate" title={c.denialReason}>{c.denialReason}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground">{formatDate(c.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={handleAppeal} className="text-[12.5px] font-bold text-[#DC2626] hover:underline cursor-pointer">
                        File Appeal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-[15px] font-bold text-foreground mb-4">Active Appeals</h2>
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/20">
          No active appeals to display
        </div>
      </section>

      <AIChatModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} initialFeature={aiFeature} />
    </div>
  );
}
