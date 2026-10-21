import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  FileDown,
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  Eye,
  Trash2,
  Clock,
  Shield,
  Stamp,
} from "lucide-react";

const exports = [
  {
    id: "EXP-0091",
    name: "Q1 2026 Rebate Exposure Summary",
    format: "XLSX",
    workspace: "Q4 Rebate Analysis",
    createdBy: "John Doe",
    createdOn: "Mar 10, 2026",
    size: "2.4 MB",
    classification: "Confidential",
    watermarked: true,
    status: "Ready",
  },
  {
    id: "EXP-0090",
    name: "Net Price Waterfall — Top 20 Contracts",
    format: "PDF",
    workspace: "Pricing Optimization Study",
    createdBy: "John Doe",
    createdOn: "Mar 9, 2026",
    size: "1.8 MB",
    classification: "Internal",
    watermarked: true,
    status: "Ready",
  },
  {
    id: "EXP-0087",
    name: "Contract Renewal Pipeline Deck",
    format: "PPTX",
    workspace: "Contract Renewal Review",
    createdBy: "John Doe",
    createdOn: "Mar 7, 2026",
    size: "5.2 MB",
    classification: "Confidential",
    watermarked: true,
    status: "Ready",
  },
  {
    id: "EXP-0085",
    name: "Customer Tier Analysis Report",
    format: "PDF",
    workspace: "Q4 Rebate Analysis",
    createdBy: "John Doe",
    createdOn: "Mar 5, 2026",
    size: "890 KB",
    classification: "Internal",
    watermarked: false,
    status: "Ready",
  },
  {
    id: "EXP-0082",
    name: "340B Compliance Audit Data",
    format: "XLSX",
    workspace: "Compliance Review",
    createdBy: "John Doe",
    createdOn: "Mar 3, 2026",
    size: "3.1 MB",
    classification: "Restricted",
    watermarked: true,
    status: "Expired",
  },
];

const decisionPacks = [
  {
    id: "DP-0012",
    name: "Q1 Pricing Committee Decision Pack",
    items: 8,
    narratives: 3,
    charts: 4,
    tables: 5,
    createdOn: "Mar 8, 2026",
    status: "Draft",
    classification: "Confidential",
  },
  {
    id: "DP-0011",
    name: "Oncology Rebate Strategy Briefing",
    items: 5,
    narratives: 2,
    charts: 2,
    tables: 3,
    createdOn: "Mar 5, 2026",
    status: "Final",
    classification: "Confidential",
  },
  {
    id: "DP-0010",
    name: "March Commercial Ops Review",
    items: 12,
    narratives: 4,
    charts: 6,
    tables: 8,
    createdOn: "Mar 1, 2026",
    status: "Final",
    classification: "Internal",
  },
];

const getFormatIcon = (format: string) => {
  switch (format) {
    case "XLSX": return FileSpreadsheet;
    case "PDF": return FileText;
    case "PPTX": return Presentation;
    default: return FileDown;
  }
};

const getClassBadge = (cls: string) => {
  switch (cls) {
    case "Restricted": return "destructive" as const;
    case "Confidential": return "default" as const;
    default: return "secondary" as const;
  }
};

export default function ExportsReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newExportOpen, setNewExportOpen] = useState(false);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exports & Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage exports, decision packs, and generated reports
            </p>
          </div>
          <Dialog open={newExportOpen} onOpenChange={setNewExportOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Decision Pack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Decision Pack</DialogTitle>
                <DialogDescription>
                  Assemble narratives, charts, and tables into a shareable briefing.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pack Name</label>
                  <Input placeholder="e.g., Q1 Pricing Committee Brief" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Workspace</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workspace..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q4">Q4 Rebate Analysis</SelectItem>
                      <SelectItem value="pricing">Pricing Optimization Study</SelectItem>
                      <SelectItem value="renewal">Contract Renewal Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="watermark" defaultChecked />
                  <label htmlFor="watermark" className="text-sm">Apply classification watermark</label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewExportOpen(false)}>Cancel</Button>
                <Button onClick={() => setNewExportOpen(false)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Pack
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Exports", value: "47", icon: FileDown, color: "bg-blue-100 text-blue-600" },
            { label: "Decision Packs", value: "12", icon: Presentation, color: "bg-purple-100 text-purple-600" },
            { label: "This Month", value: "8", icon: Clock, color: "bg-emerald-100 text-emerald-600" },
            { label: "Watermarked", value: "39", icon: Stamp, color: "bg-amber-100 text-amber-600" },
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

        <Tabs defaultValue="exports" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="exports">Exports</TabsTrigger>
              <TabsTrigger value="decision-packs">Decision Packs</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exports..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="exports" className="mt-6">
            <div className="bg-card rounded-xl border shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exports.map((exp) => {
                    const FormatIcon = getFormatIcon(exp.format);
                    return (
                      <TableRow key={exp.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <FormatIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{exp.name}</p>
                              <p className="text-xs text-muted-foreground">{exp.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{exp.format}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{exp.workspace}</TableCell>
                        <TableCell className="text-muted-foreground">{exp.createdOn}</TableCell>
                        <TableCell className="text-muted-foreground">{exp.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge variant={getClassBadge(exp.classification)}>{exp.classification}</Badge>
                            {exp.watermarked && <Shield className="w-3.5 h-3.5 text-muted-foreground" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="decision-packs" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decisionPacks.map((pack) => (
                <div key={pack.id} className="bg-card rounded-xl border shadow-card p-5 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{pack.id}</Badge>
                    <Badge variant={pack.status === "Final" ? "default" : "secondary"}>{pack.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pack.createdOn}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t text-xs text-muted-foreground">
                    <span>{pack.narratives} narratives</span>
                    <span>{pack.charts} charts</span>
                    <span>{pack.tables} tables</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant={getClassBadge(pack.classification)}>{pack.classification}</Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No Scheduled Reports Yet</p>
              <p className="text-sm mt-1">Schedule recurring exports from your workspaces</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create Schedule
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
