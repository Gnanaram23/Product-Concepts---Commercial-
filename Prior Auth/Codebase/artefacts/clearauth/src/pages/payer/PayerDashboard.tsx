import { useState } from "react";
import { useListCases, useUpdateCase, PACase } from "@workspace/api-client-react";
import { FileSignature, CheckCircle, Clock, Activity, Bot } from "lucide-react";
import { KPIStat, StatusBadge, PriorityBadge } from "@/components/shared/UIComponents";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const MOCK_CHART_DATA = [
  { name: 'Mon', volume: 40 },
  { name: 'Tue', volume: 30 },
  { name: 'Wed', volume: 45 },
  { name: 'Thu', volume: 50 },
  { name: 'Fri', volume: 35 },
  { name: 'Sat', volume: 20 },
  { name: 'Sun', volume: 15 },
];

export default function PayerDashboard() {
  const { data: cases = [] } = useListCases();
  const updateMutation = useUpdateCase();
  const { toast } = useToast();
  
  const pendingReviews = cases.filter(c => c.status === 'review');
  const approvedToday = cases.filter(c => c.status === 'approved').length;

  const handleApprove = async (id: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: 'approved' } });
      toast({ title: "Case approved", className: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]" });
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    }
  };

  const handleDeny = async (id: string) => {
    const reason = prompt("Enter denial reason:");
    if (reason) {
      try {
        await updateMutation.mutateAsync({ id, data: { status: 'denied', denialReason: reason } });
        toast({ title: "Case denied", variant: "destructive" });
      } catch {
        toast({ title: "Failed to deny", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Queue Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage pending authorizations and track processing metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIStat title="Pending Review" value={pendingReviews.length} icon={FileSignature} colorClass="bg-[#EFF6FF] text-[#2563EB]" />
        <KPIStat title="Approved Today" value={approvedToday} icon={CheckCircle} colorClass="bg-[#F0FDF4] text-[#16A34A]" />
        <KPIStat title="Avg Processing" value="1.8 days" subtitle="Target < 2.0" icon={Clock} colorClass="bg-[#FFFBEB] text-[#D97706]" />
        <KPIStat title="Denial Rate" value="27%" subtitle="-3% vs last week" icon={Activity} colorClass="bg-card border text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Priority Reviews</h2>
          <div className="space-y-3">
            {pendingReviews.map(c => (
              <div key={c.id} className="bg-card border rounded-xl p-5 shadow-sm hover:border-primary transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-foreground">{c.drug}</h3>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{c.id} <span className="font-sans text-muted-foreground">· {c.provider}</span></p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="text-xs font-semibold text-destructive">Due: {formatDate(c.dueDate)}</p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="AI Review">
                      <Bot className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeny(c.id)}
                      className="px-4 py-1.5 border border-[#FECACA] text-[#DC2626] bg-[#FEF2F2] rounded-lg text-sm font-bold hover:bg-[#FEE2E2] transition-colors"
                    >
                      Deny
                    </button>
                    <button 
                      onClick={() => handleApprove(c.id)}
                      className="px-4 py-1.5 bg-[#2563EB] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#1D4ED8] transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingReviews.length === 0 && (
              <div className="p-8 text-center text-muted-foreground bg-card border rounded-xl">Queue is clear!</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-foreground mb-4">Workload Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-semibold text-foreground">Today's Reviews</span>
                <span className="text-lg font-bold">{pendingReviews.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#FFFBEB] text-[#D97706] rounded-lg border border-[#FDE68A]">
                <span className="text-sm font-semibold">Approaching Deadline</span>
                <span className="text-lg font-bold">{pendingReviews.filter(c => c.priority === 'high').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F0FDF4] text-[#16A34A] rounded-lg border border-[#BBF7D0]">
                <span className="text-sm font-semibold">Completed Today</span>
                <span className="text-lg font-bold">{approvedToday + 2}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-5 shadow-sm h-[220px] flex flex-col">
            <h2 className="text-sm font-bold text-foreground mb-4">Request Volume</h2>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip cursor={{stroke: '#BFDBFE', strokeWidth: 2}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
