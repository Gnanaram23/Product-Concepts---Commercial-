import { useState } from "react";
import { Plus } from "lucide-react";
import { useListCases, PACase } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/shared/UIComponents";
import { PADetailModal } from "@/components/modals/PADetailModal";
import { NewPAModal } from "@/components/modals/NewPAModal";
import { formatDate } from "@/lib/utils";

export default function ActiveCases() {
  const { data: cases = [], isLoading } = useListCases();
  const [selectedCase, setSelectedCase] = useState<PACase | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">Active Prior Authorization Cases</h1>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm hover:shadow hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New PA Request
        </button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Case ID</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medication</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading cases...</td></tr>
            ) : cases.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setSelectedCase(c)}>
                <td className="px-4 py-3">
                  <span className="font-mono text-[12px] text-ink2">{c.id}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-semibold text-foreground">{c.patientName}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">DOB: {formatDate(c.patientDob)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-semibold text-foreground">{c.drug}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{c.condition}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-foreground">{formatDate(c.submittedDate)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {c.status === 'approved' ? `Approved: ${formatDate(c.updatedAt)}` :
                     c.status === 'denied' ? `Denied: ${formatDate(c.updatedAt)}` :
                     `Due: ${formatDate(c.dueDate)}`}
                  </p>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  {c.status === 'denied' && (
                    <span className="text-[12.5px] font-bold text-[#DC2626] hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedCase(c); }}>Appeal</span>
                  )}
                  <span className="text-[12.5px] font-bold text-primary hover:underline">View Details</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PADetailModal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} c={selectedCase} onOpenAI={() => {}} />
      <NewPAModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
