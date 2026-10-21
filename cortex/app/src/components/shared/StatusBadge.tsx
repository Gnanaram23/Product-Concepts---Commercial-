import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Lock, AlertCircle, Archive } from "lucide-react";

type StatusType = "certified" | "draft" | "restricted" | "pending" | "deprecated" | "access-granted" | "expiring-soon";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { label: string; className: string; icon: React.ElementType }> = {
  certified: {
    label: "Certified",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  restricted: {
    label: "Restricted",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: Lock,
  },
  pending: {
    label: "Pending Access",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  deprecated: {
    label: "Deprecated",
    className: "bg-gray-100 text-gray-500 border-gray-200",
    icon: Archive,
  },
  "access-granted": {
    label: "Access Granted",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  "expiring-soon": {
    label: "Expiring Soon",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertCircle,
  },
};

export function StatusBadge({ status, size = "sm", showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border rounded-full font-medium",
        config.className,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      {config.label}
    </span>
  );
}
