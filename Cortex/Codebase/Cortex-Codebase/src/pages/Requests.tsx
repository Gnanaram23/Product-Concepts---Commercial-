import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock, CheckCircle2, XCircle, AlertTriangle, Send } from "lucide-react";

const myRequests = [
  {
    id: "REQ-2026-0041",
    asset: "WAC & Net Price Tracker",
    type: "Data Product",
    requestedOn: "Mar 8, 2026",
    status: "pending" as const,
    approver: "Sarah Chen",
    justification: "Needed for Q1 pricing review across oncology portfolio",
    duration: "90 days",
    expiresOn: null,
  },
  {
    id: "REQ-2026-0038",
    asset: "Managed Care Contract Repository",
    type: "Dataset",
    requestedOn: "Mar 5, 2026",
    status: "certified" as const,
    approver: "David Park",
    justification: "Contract analysis for upcoming renewal cycle",
    duration: "180 days",
    expiresOn: "Sep 2, 2026",
  },
  {
    id: "REQ-2026-0035",
    asset: "Specialty Pharmacy Channel Data",
    type: "Dataset",
    requestedOn: "Mar 1, 2026",
    status: "deprecated" as const,
    approver: "Maria Lopez",
    justification: "Channel analysis for distribution optimization",
    duration: "90 days",
    expiresOn: null,
  },
  {
    id: "REQ-2026-0029",
    asset: "Pricing Intelligence Hub",
    type: "Data Product",
    requestedOn: "Feb 20, 2026",
    status: "certified" as const,
    approver: "Sarah Chen",
    justification: "Competitive pricing benchmarking",
    duration: "365 days",
    expiresOn: "Feb 20, 2027",
  },
  {
    id: "REQ-2026-0022",
    asset: "Government Pricing Compliance Dataset",
    type: "Dataset",
    requestedOn: "Feb 12, 2026",
    status: "certified" as const,
    approver: "James Wilson",
    justification: "Best Price and AMP calculations for Medicaid rebates",
    duration: "180 days",
    expiresOn: "Aug 12, 2026",
  },
];

const approvalQueue = [
  {
    id: "REQ-2026-0043",
    requester: "Emily Zhang",
    role: "Pricing Analyst",
    asset: "Contract Analytics Suite",
    type: "Data Product",
    requestedOn: "Mar 10, 2026",
    justification: "Q1 contract performance review for leadership presentation",
    duration: "90 days",
    urgency: "High",
  },
  {
    id: "REQ-2026-0042",
    requester: "Michael Torres",
    role: "Commercial Ops",
    asset: "Rebate Accrual Summary",
    type: "Dataset",
    requestedOn: "Mar 9, 2026",
    justification: "Monthly rebate reconciliation for March close",
    duration: "30 days",
    urgency: "Medium",
  },
  {
    id: "REQ-2026-0040",
    requester: "Lisa Park",
    role: "Finance Analyst",
    asset: "Customer Tier Movement Report",
    type: "Dashboard",
    requestedOn: "Mar 7, 2026",
    justification: "Analyzing customer tier changes for revenue impact assessment",
    duration: "180 days",
    urgency: "Low",
  },
];

export default function Requests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" };
      case "certified":
        return { label: "Approved", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" };
      case "deprecated":
        return { label: "Denied", icon: XCircle, color: "text-red-600 bg-red-50" };
      default:
        return { label: status, icon: Clock, color: "text-muted-foreground bg-muted" };
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Access Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage data access requests and approvals
            </p>
          </div>
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Request Data Access</DialogTitle>
                <DialogDescription>
                  Submit a request for access to a data product or asset.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset or Data Product</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wac">WAC & Net Price Tracker</SelectItem>
                      <SelectItem value="gov">Government Pricing Compliance Dataset</SelectItem>
                      <SelectItem value="spec">Specialty Pharmacy Channel Data</SelectItem>
                      <SelectItem value="340b">340B Contract Repository</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Duration</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Justification</label>
                  <Textarea placeholder="Explain why you need access to this asset..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewRequestOpen(false)}>Cancel</Button>
                <Button className="gap-2" onClick={() => setNewRequestOpen(false)}>
                  <Send className="w-4 h-4" />
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Pending", value: "3", icon: Clock, color: "bg-amber-100 text-amber-600" },
            { label: "Approved", value: "12", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
            { label: "Denied", value: "2", icon: XCircle, color: "bg-red-100 text-red-600" },
            { label: "Expiring Soon", value: "4", icon: AlertTriangle, color: "bg-orange-100 text-orange-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="my-requests" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
              <TabsTrigger value="approvals">
                Approvals Queue
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
              </TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="my-requests" className="mt-6">
            <div className="bg-card rounded-xl border shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((req) => {
                    const statusConfig = getStatusConfig(req.status);
                    return (
                      <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{req.id}</TableCell>
                        <TableCell className="font-medium">{req.asset}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{req.type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{req.requestedOn}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <statusConfig.icon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{req.approver}</TableCell>
                        <TableCell className="text-muted-foreground">{req.expiresOn || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <div className="space-y-4">
              {approvalQueue.map((req) => (
                <div key={req.id} className="bg-card rounded-xl border shadow-card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">{req.id}</span>
                        <Badge variant={req.urgency === "High" ? "destructive" : req.urgency === "Medium" ? "default" : "secondary"}>
                          {req.urgency} Priority
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{req.requester} <span className="font-normal text-muted-foreground">({req.role})</span></h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Requesting access to <span className="font-medium text-foreground">{req.asset}</span> ({req.type}) for {req.duration}
                      </p>
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                        <span className="font-medium">Justification:</span> {req.justification}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <XCircle className="w-4 h-4" />
                        Deny
                      </Button>
                      <Button size="sm" className="gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
