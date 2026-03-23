import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    review: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
    approved: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    denied: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  };
  
  const dots = {
    pending: "bg-[#D97706]",
    review: "bg-[#2563EB]",
    approved: "bg-[#16A34A]",
    denied: "bg-[#DC2626]",
  };

  const normalized = status.toLowerCase() as keyof typeof styles;
  const style = styles[normalized] || styles.pending;
  const dot = dots[normalized] || dots.pending;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold border", style)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {status === 'review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function DrugChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F3FF] text-[#7C3AED]">
      {children}
    </span>
  );
}

export function PayerChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB]">
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority?: string }) {
  if (priority !== 'high') return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] uppercase tracking-wider">
      Urgent
    </span>
  );
}

export function KPIStat({ title, value, icon: Icon, colorClass, subtitle }: any) {
  return (
    <div className="bg-card rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl bg-card">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
