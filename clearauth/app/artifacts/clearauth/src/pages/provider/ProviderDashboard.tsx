import { useState } from "react";
import { Clock, Eye, CheckCircle, XCircle, Plus, Info, AlertTriangle, FileText } from "lucide-react";
import { KPIStat, StatusBadge } from "@/components/shared/UIComponents";
import { useListCases, PACase } from "@workspace/api-client-react";
import { PADetailModal } from "@/components/modals/PADetailModal";
import { NewPAModal } from "@/components/modals/NewPAModal";
import { formatDate } from "@/lib/utils";

export default function ProviderDashboard() {
  const { data: cases = [], isLoading } = useListCases();
  const [selectedCase, setSelectedCase] = useState<PACase | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const pending = cases.filter(c => c.status === 'pending').length;
  const review = cases.filter(c => c.status === 'review').length;
  const approved = cases.filter(c => c.status === 'approved').length;
  const denied = cases.filter(c => c.status === 'denied').length;

  const recent = cases.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, Dr. Sarah Mitchell</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your patients' prior authorizations and view status updates.</p>
        </div>
        <button 
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New PA Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIStat title="Pending" value={pending} icon={Clock} colorClass="bg-[#FFFBEB] text-[#D97706]" />
        <KPIStat title="In Review" value={review} icon={Eye} colorClass="bg-[#EFF6FF] text-[#2563EB]" />
        <KPIStat title="Approved" value={approved} icon={CheckCircle} colorClass="bg-[#F0FDF4] text-[#16A34A]" />
        <KPIStat title="Denied" value={denied} icon={XCircle} colorClass="bg-[#FEF2F2] text-[#DC2626]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading activity...</div>
            ) : recent.map((c, i) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCase(c)}
                className="p-4 border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors flex items-center gap-4"
              >
                <div className="shrink-0">
                  {c.status === 'approved' && <div className="w-10 h-10 rounded-full bg-[#F0FDF4] flex items-center justify-center"><CheckCircle className="w-5 h-5 text-[#16A34A]" /></div>}
                  {c.status === 'denied' && <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center"><XCircle className="w-5 h-5 text-[#DC2626]" /></div>}
                  {c.status === 'review' && <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center"><Eye className="w-5 h-5 text-[#2563EB]" /></div>}
                  {c.status === 'pending' && <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center"><Clock className="w-5 h-5 text-[#D97706]" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    PA {c.status} for {c.drug}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Patient: {c.patientName} | {formatDate(c.updatedAt || c.submittedDate)}
                  </p>
                </div>
                <div>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Priority Alerts</h2>
          <div className="space-y-3">
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 shadow-sm flex gap-3">
              <Info className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#1D4ED8]">1 Case Due Soon</p>
                <p className="text-xs text-[#2563EB] mt-1">Review deadlines within 3 days</p>
              </div>
            </div>
            
            <div className="bg-[#2563EB] rounded-xl p-4 shadow-sm flex gap-3 text-white">
              <FileText className="w-5 h-5 text-blue-200 shrink-0" />
              <div>
                <p className="text-sm font-bold">New Payer Policy Update</p>
                <p className="text-xs text-blue-100 mt-1">Changes to coverage criteria for oncology medications</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 shadow-sm flex gap-3">
              <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#991B1B]">2 Appeal Opportunities</p>
                <p className="text-xs text-[#DC2626] mt-1">Review denied cases and file appeals as needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PADetailModal isOpen={!!selectedCase} onClose={() => setSelectedCase(null)} c={selectedCase} onOpenAI={() => {}} />
      <NewPAModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
