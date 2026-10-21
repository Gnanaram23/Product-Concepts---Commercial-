import { Database, Users, Calendar, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataProductCardProps {
  name: string;
  description: string;
  status: "certified" | "draft" | "deprecated";
  version: string;
  assetCount: number;
  owner: string;
  lastUpdated: string;
  domain: string;
  hasAccess?: boolean;
  onClick?: () => void;
}

export function DataProductCard({
  name,
  description,
  status,
  version,
  assetCount,
  owner,
  lastUpdated,
  domain,
  hasAccess = true,
  onClick,
}: DataProductCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border shadow-card p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={status} size="sm" />
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              v{version}
            </span>
          </div>
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Database className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="w-4 h-4" />
          <span>{assetCount} assets</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="truncate">{owner}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{lastUpdated}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
          {domain}
        </span>
        {hasAccess ? (
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            Open
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            Request Access
          </Button>
        )}
      </div>
    </div>
  );
}
