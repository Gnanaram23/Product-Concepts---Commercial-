import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  Eye,
  User,
  Database,
  FileText,
  BarChart3,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const auditEvents = [
  {
    id: 1,
    timestamp: "2026-01-08 10:42:15",
    user: "john.doe@takeda.com",
    action: "Query Executed",
    asset: "contract_pricing_master",
    workspace: "Q4 Rebate Analysis",
    agent: "SQL Agent",
    policyOutcome: "Allowed",
    details: "Aggregated query on pricing data",
  },
  {
    id: 2,
    timestamp: "2026-01-08 10:38:22",
    user: "john.doe@takeda.com",
    action: "Export Generated",
    asset: "Rebate Summary Report",
    workspace: "Q4 Rebate Analysis",
    agent: "N/A",
    policyOutcome: "Allowed",
    details: "PDF export with watermark",
  },
  {
    id: 3,
    timestamp: "2026-01-08 10:35:10",
    user: "jane.smith@takeda.com",
    action: "Access Requested",
    asset: "customer_tier_history",
    workspace: "N/A",
    agent: "N/A",
    policyOutcome: "Pending",
    details: "Business justification provided",
  },
  {
    id: 4,
    timestamp: "2026-01-08 10:20:45",
    user: "mike.johnson@takeda.com",
    action: "Query Blocked",
    asset: "sales_performance",
    workspace: "Market Access Review",
    agent: "SQL Agent",
    policyOutcome: "Denied",
    details: "User lacks required access",
  },
  {
    id: 5,
    timestamp: "2026-01-08 09:55:30",
    user: "john.doe@takeda.com",
    action: "Document Analyzed",
    asset: "Rebate Policy Guidelines",
    workspace: "Q4 Rebate Analysis",
    agent: "Document Agent",
    policyOutcome: "Allowed",
    details: "RAG extraction performed",
  },
];

const agentTimeline = [
  { step: 1, agent: "Supervisor", status: "success", duration: "0.2s" },
  { step: 2, agent: "SQL Agent", status: "success", duration: "1.4s" },
  { step: 3, agent: "Policy Check", status: "success", duration: "0.1s" },
  { step: 4, agent: "Synthesis", status: "success", duration: "0.3s" },
];

export default function AuditTrace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<typeof auditEvents[0] | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Audit & Trace</h1>
              <p className="text-muted-foreground mt-1">
                Review audit trails, policy decisions, and compliance evidence
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Audit Report
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, asset, or action..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="query">Query Executed</SelectItem>
                <SelectItem value="export">Export Generated</SelectItem>
                <SelectItem value="access">Access Request</SelectItem>
                <SelectItem value="blocked">Query Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Policy Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="allowed">Allowed</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Table */}
          <div className="bg-card rounded-xl border shadow-card overflow-hidden flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">Agent</TableHead>
                  <TableHead className="font-semibold">Policy Outcome</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditEvents.map((event) => (
                  <TableRow
                    key={event.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/30",
                      selectedEvent?.id === event.id && "bg-accent"
                    )}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {event.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{event.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{event.asset}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.agent}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          event.policyOutcome === "Allowed" && "bg-green-50 text-green-700",
                          event.policyOutcome === "Denied" && "bg-red-50 text-red-700",
                          event.policyOutcome === "Pending" && "bg-amber-50 text-amber-700"
                        )}
                      >
                        {event.policyOutcome === "Allowed" && <CheckCircle className="w-3 h-3" />}
                        {event.policyOutcome === "Denied" && <XCircle className="w-3 h-3" />}
                        {event.policyOutcome === "Pending" && <AlertCircle className="w-3 h-3" />}
                        {event.policyOutcome}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEvent && (
          <div className="w-96 border-l border-border bg-card flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Audit Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Event Info */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-mono text-sm">{selectedEvent.timestamp}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="text-sm font-medium">{selectedEvent.user}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Workspace</p>
                    <p className="text-sm">{selectedEvent.workspace}</p>
                  </div>
                </div>

                {/* Agent Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Agent Execution Timeline
                  </h4>
                  <div className="space-y-2">
                    {agentTimeline.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                            step.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.agent}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{step.duration}</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Policy Decision</h4>
                  <div
                    className={cn(
                      "p-3 rounded-lg border",
                      selectedEvent.policyOutcome === "Allowed" && "bg-green-50 border-green-200",
                      selectedEvent.policyOutcome === "Denied" && "bg-red-50 border-red-200"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {selectedEvent.policyOutcome === "Allowed" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">{selectedEvent.policyOutcome}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedEvent.details}</p>
                  </div>
                </div>

                {/* SQL Preview (if applicable) */}
                {selectedEvent.agent === "SQL Agent" && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Executed Query</h4>
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
{`SELECT 
  customer_segment,
  SUM(rebate_amount)
FROM contract_data
WHERE quarter = 'Q4'
GROUP BY 1;

-- Masked columns: customer_pii`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Export Event Details
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Full Session
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
