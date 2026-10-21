import { useState } from "react";
import { useListCases, PACase } from "@workspace/api-client-react";
import { StatusBadge, PriorityBadge, DrugChip } from "@/components/shared/UIComponents";
import { PADetailModal } from "@/components/modals/PADetailModal";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { formatDate } from "@/lib/utils";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Pending", "In Review", "Approved", "Denied"];

export default function PayerActiveCases() {
  const { data: cases = [], isLoading } = useListCases();
  const [selectedCase, setSelectedCase] = useState<PACase | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = cases.filter(c => {
    const matchesFilter =
      filter === "All" ||
      (filter === "In Review" && c.status === "review") ||
      c.status === filter.toLowerCase();
    const matchesSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.drug.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">All Prior Authorization Cases</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage all PA submissions for BlueCross Health members.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by case ID, patient, or drug..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
        </div>
        <div className="flex items-center gap-1 border border-border rounded-lg bg-white p-1 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors",
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Case ID</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Drug / Condition</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Provider</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Due</th>
              <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading cases...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No cases match your filters.</td></tr>
            ) : filtered.map(c => (
              <tr
                key={c.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedCase(c)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-ink2">{c.id}</span>
                    <PriorityBadge priority={c.priority} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-semibold text-foreground">{c.patientName}</p>
                  <p className="text-[11px] text-muted-foreground">{c.payer}</p>
                </td>
                <td className="px-4 py-3">
                  <DrugChip>{c.drug}</DrugChip>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[160px]">{c.condition}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-foreground">{c.provider}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <span className={cn("text-[12px] font-semibold", c.priority === 'high' ? "text-destructive" : "text-foreground")}>
                    {formatDate(c.dueDate)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[12.5px] font-bold text-primary group-hover:underline">Review</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PADetailModal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} c={selectedCase} onOpenAI={() => setAiOpen(true)} />
      <AIChatModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
