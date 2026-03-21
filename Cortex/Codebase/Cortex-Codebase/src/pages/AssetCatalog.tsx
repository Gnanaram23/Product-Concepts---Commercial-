import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Search,
  Database,
  BarChart3,
  FileText,
  Activity,
  Users,
  Calendar,
  Lock,
  CheckCircle,
  Shield,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const datasets = [
  {
    id: 1,
    name: "contract_pricing_master",
    type: "Dataset",
    domain: "Pricing & Contracting",
    owner: "Data Governance Team",
    status: "certified" as const,
    classification: "Confidential",
    lastRefresh: "2 hours ago",
    quality: 98,
    hasAccess: true,
  },
  {
    id: 2,
    name: "rebate_accruals_summary",
    type: "Dataset",
    domain: "Pricing & Contracting",
    owner: "Finance Analytics",
    status: "certified" as const,
    classification: "Internal",
    lastRefresh: "1 hour ago",
    quality: 95,
    hasAccess: true,
  },
  {
    id: 3,
    name: "customer_tier_history",
    type: "Dataset",
    domain: "Commercial",
    owner: "Commercial Ops",
    status: "draft" as const,
    classification: "Restricted",
    lastRefresh: "Yesterday",
    quality: 87,
    hasAccess: false,
  },
  {
    id: 4,
    name: "wac_net_price_tracker",
    type: "Dataset",
    domain: "Pricing & Contracting",
    owner: "Pricing Team",
    status: "certified" as const,
    classification: "Confidential",
    lastRefresh: "30 min ago",
    quality: 99,
    hasAccess: true,
  },
];

const dashboards = [
  {
    id: 1,
    name: "Contract Performance Dashboard",
    type: "Dashboard",
    domain: "Pricing & Contracting",
    owner: "BI Team",
    status: "certified" as const,
    lastRefresh: "Real-time",
    hasAccess: true,
  },
  {
    id: 2,
    name: "Pricing Trends Analysis",
    type: "Dashboard",
    domain: "Pricing & Contracting",
    owner: "Analytics CoE",
    status: "certified" as const,
    lastRefresh: "Hourly",
    hasAccess: true,
  },
];

const documents = [
  {
    id: 1,
    name: "Rebate Policy Guidelines 2025",
    type: "Document",
    domain: "Pricing & Contracting",
    owner: "Legal",
    path: "/policies/rebate-guidelines-2025.pdf",
    classification: "Internal",
    hasAccess: true,
  },
  {
    id: 2,
    name: "Contract Approval Workflow",
    type: "Document",
    domain: "Pricing & Contracting",
    owner: "Compliance",
    path: "/sops/contract-approval.docx",
    classification: "Internal",
    hasAccess: true,
  },
];

export default function AssetCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<typeof datasets[0] | null>(null);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Asset Catalog</h1>
              <p className="text-muted-foreground mt-1">
                Explore datasets, dashboards, documents, and KPIs powered by Magic Metastore
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name, domain, or owner..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="pricing">Pricing & Contracting</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Asset Tabs */}
            <Tabs defaultValue="datasets" className="flex-1">
              <TabsList>
                <TabsTrigger value="datasets" className="gap-2">
                  <Database className="w-4 h-4" />
                  Datasets
                </TabsTrigger>
                <TabsTrigger value="dashboards" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboards
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="metrics" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Metrics & KPIs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="datasets" className="mt-4">
                <div className="bg-card rounded-xl border shadow-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Asset Name</TableHead>
                        <TableHead className="font-semibold">Domain</TableHead>
                        <TableHead className="font-semibold">Owner</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Classification</TableHead>
                        <TableHead className="font-semibold">Quality</TableHead>
                        <TableHead className="font-semibold">Last Refresh</TableHead>
                        <TableHead className="font-semibold">Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {datasets.map((dataset) => (
                        <TableRow
                          key={dataset.id}
                          className={cn(
                            "cursor-pointer hover:bg-muted/30",
                            selectedAsset?.id === dataset.id && "bg-accent"
                          )}
                          onClick={() => setSelectedAsset(dataset)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Database className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium">{dataset.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{dataset.domain}</TableCell>
                          <TableCell className="text-muted-foreground">{dataset.owner}</TableCell>
                          <TableCell>
                            <StatusBadge status={dataset.status} />
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full",
                              dataset.classification === "Confidential" && "bg-amber-50 text-amber-700",
                              dataset.classification === "Internal" && "bg-blue-50 text-blue-700",
                              dataset.classification === "Restricted" && "bg-red-50 text-red-700"
                            )}>
                              {dataset.classification}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    dataset.quality >= 95 ? "bg-green-500" : dataset.quality >= 85 ? "bg-amber-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${dataset.quality}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{dataset.quality}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{dataset.lastRefresh}</TableCell>
                          <TableCell>
                            {dataset.hasAccess ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                                Request
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="dashboards" className="mt-4">
                <div className="bg-card rounded-xl border shadow-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Dashboard Name</TableHead>
                        <TableHead className="font-semibold">Domain</TableHead>
                        <TableHead className="font-semibold">Owner</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Refresh</TableHead>
                        <TableHead className="font-semibold">Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboards.map((dashboard) => (
                        <TableRow key={dashboard.id} className="cursor-pointer hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium">{dashboard.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{dashboard.domain}</TableCell>
                          <TableCell className="text-muted-foreground">{dashboard.owner}</TableCell>
                          <TableCell>
                            <StatusBadge status={dashboard.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{dashboard.lastRefresh}</TableCell>
                          <TableCell>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <div className="bg-card rounded-xl border shadow-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Document Name</TableHead>
                        <TableHead className="font-semibold">Domain</TableHead>
                        <TableHead className="font-semibold">Owner</TableHead>
                        <TableHead className="font-semibold">Classification</TableHead>
                        <TableHead className="font-semibold">Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <span className="font-medium block">{doc.name}</span>
                                <span className="text-xs text-muted-foreground">{doc.path}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{doc.domain}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.owner}</TableCell>
                          <TableCell>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                              {doc.classification}
                            </span>
                          </TableCell>
                          <TableCell>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>KPI definitions coming soon</p>
                  <p className="text-sm">Metrics will be synced from Magic Metastore</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Asset Detail Panel */}
        {selectedAsset && (
          <div className="w-96 border-l border-border bg-card flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Asset Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={selectedAsset.status} />
                  </div>
                  <h2 className="text-lg font-semibold">{selectedAsset.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAsset.domain}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Quality Score</p>
                    <p className="text-lg font-semibold text-foreground">{selectedAsset.quality}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Last Refresh</p>
                    <p className="text-sm font-medium text-foreground">{selectedAsset.lastRefresh}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Metadata</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <span className="text-sm font-medium">{selectedAsset.owner}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Classification</span>
                      <span className="text-sm font-medium">{selectedAsset.classification}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium">{selectedAsset.type}</span>
                    </div>
                  </div>
                </div>

                {/* Schema Preview */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Schema Preview</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">contract_id</code>
                      <span className="text-xs text-muted-foreground">STRING</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">customer_name</code>
                      <span className="text-xs text-muted-foreground">STRING</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">pricing_tier</code>
                      <span className="text-xs text-muted-foreground">INTEGER</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <code className="text-xs">effective_date</code>
                      <span className="text-xs text-muted-foreground">DATE</span>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Active Policies
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Column masking on PII fields</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Row-level security enabled</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full gap-2">
                    Use in Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Full Details
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
