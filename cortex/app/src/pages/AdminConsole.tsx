import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
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
  Activity,
  Database,
  Cloud,
  RefreshCw,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Clock,
  Cpu,
  HardDrive,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const connectors = [
  { id: 1, name: "Databricks", type: "Data Warehouse", status: "connected", lastSync: "5 min ago" },
  { id: 2, name: "Tableau Server", type: "BI Platform", status: "connected", lastSync: "Real-time" },
  { id: 3, name: "SharePoint", type: "Document Store", status: "connected", lastSync: "1 hour ago" },
  { id: 4, name: "Salesforce", type: "CRM", status: "warning", lastSync: "3 hours ago" },
  { id: 5, name: "SAP", type: "ERP", status: "disconnected", lastSync: "N/A" },
];

const agentConfigs = [
  { name: "SQL Agent", enabled: true, model: "GPT-4o", rowLimit: 10000, timeout: 30 },
  { name: "Document Agent", enabled: true, model: "GPT-4o", maxPages: 100, timeout: 60 },
  { name: "Tableau Agent", enabled: true, model: "GPT-4o", cacheEnabled: true, timeout: 45 },
];

export default function AdminConsole() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Console</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform settings, connectors, and agent behavior
          </p>
        </div>

        {/* Health Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Platform Status</span>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold text-green-600">Operational</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Uptime: 99.97%</p>
          </div>

          <div className="bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Query Latency</span>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">1.2s</p>
            <p className="text-xs text-muted-foreground mt-2">P95 avg last 24h</p>
          </div>

          <div className="bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Agent Errors</span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </div>

          <div className="bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Metastore Sync</span>
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Synced</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last: 15 min ago</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="connectors" className="w-full">
          <TabsList>
            <TabsTrigger value="connectors" className="gap-2">
              <Cloud className="w-4 h-4" />
              Connectors
            </TabsTrigger>
            <TabsTrigger value="metastore" className="gap-2">
              <Database className="w-4 h-4" />
              Metastore Sync
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Cpu className="w-4 h-4" />
              Agent Config
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <Shield className="w-4 h-4" />
              Policies
            </TabsTrigger>
          </TabsList>

          {/* Connectors Tab */}
          <TabsContent value="connectors" className="mt-6">
            <div className="bg-card rounded-xl border shadow-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Data Source Connectors</h3>
                <Button className="gap-2">
                  <Cloud className="w-4 h-4" />
                  Add Connector
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Connector</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Sync</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectors.map((connector) => (
                    <TableRow key={connector.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Database className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{connector.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{connector.type}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            connector.status === "connected" && "bg-green-50 text-green-700",
                            connector.status === "warning" && "bg-amber-50 text-amber-700",
                            connector.status === "disconnected" && "bg-red-50 text-red-700"
                          )}
                        >
                          {connector.status === "connected" && <CheckCircle className="w-3 h-3" />}
                          {connector.status === "warning" && <AlertTriangle className="w-3 h-3" />}
                          {connector.status === "disconnected" && <XCircle className="w-3 h-3" />}
                          {connector.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{connector.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Test
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Metastore Sync Tab */}
          <TabsContent value="metastore" className="mt-6 space-y-6">
            <div className="bg-card rounded-xl border shadow-card p-6">
              <h3 className="font-semibold mb-4">Magic Metastore Synchronization</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sync Status</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">Last sync successful</p>
                      <p className="text-sm text-muted-foreground">January 8, 2026 at 10:15 AM</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Next Scheduled</p>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">In 45 minutes</p>
                      <p className="text-sm text-muted-foreground">Hourly sync enabled</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Asset Counts</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">Datasets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-xs text-muted-foreground">Dashboards</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">234</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-muted-foreground">KPIs</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </Button>
                <Button variant="outline">View Sync History</Button>
              </div>
            </div>
          </TabsContent>

          {/* Agent Config Tab */}
          <TabsContent value="agents" className="mt-6">
            <div className="bg-card rounded-xl border shadow-card">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Agent Configuration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure AI agent behavior, limits, and model selection
                </p>
              </div>
              <div className="divide-y divide-border">
                {agentConfigs.map((agent, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">Model: {agent.model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Enabled</span>
                        <Switch checked={agent.enabled} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pl-13">
                      <div>
                        <label className="text-sm text-muted-foreground">Model</label>
                        <Select defaultValue={agent.model}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                            <SelectItem value="GPT-4-turbo">GPT-4-turbo</SelectItem>
                            <SelectItem value="Claude-3">Claude-3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Timeout (seconds)</label>
                        <Input type="number" defaultValue={agent.timeout} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          {agent.name === "SQL Agent" ? "Row Limit" : "Max Pages"}
                        </label>
                        <Input
                          type="number"
                          defaultValue={agent.name === "SQL Agent" ? agent.rowLimit : 100}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="mt-6 space-y-6">
            <div className="bg-card rounded-xl border shadow-card p-6">
              <h3 className="font-semibold mb-4">Retention & Compliance Policies</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Chat History Retention</p>
                    <p className="text-sm text-muted-foreground">How long to keep conversation logs</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Export Watermarking</p>
                    <p className="text-sm text-muted-foreground">Add watermarks to exported documents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">BYOD File Retention</p>
                    <p className="text-sm text-muted-foreground">Auto-delete uploaded files after</p>
                  </div>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Audit Log Retention</p>
                    <p className="text-sm text-muted-foreground">Compliance audit trail retention</p>
                  </div>
                  <Select defaultValue="365">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                      <SelectItem value="1825">5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
