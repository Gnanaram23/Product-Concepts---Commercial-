import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ArrowLeft,
  Send,
  Database,
  BarChart3,
  FileText,
  Upload,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Copy,
  Table,
  LineChart,
  Info,
  ExternalLink,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const datasets = [
  { id: 1, name: "contract_pricing_data", description: "Contract pricing and terms data", hasAccess: true },
  { id: 2, name: "rebate_accruals_v2", description: "Rebate accrual calculations", hasAccess: true },
  { id: 3, name: "customer_segments", description: "Customer segmentation data", hasAccess: true },
  { id: 4, name: "sales_performance", description: "Sales performance metrics", hasAccess: false },
];

const dashboards = [
  { id: 1, name: "Contract Analytics v2.1", hasAccess: true },
  { id: 2, name: "Pricing Trends Dashboard", hasAccess: true },
  { id: 3, name: "Rebate Performance", hasAccess: true },
];

const suggestedPrompts = [
  "Summarize rebate exposure by customer segment for last quarter",
  "Compare net price waterfall across top 10 contracts",
  "Identify contracts with exception clauses related to renewal terms",
  "Show pricing trends by product category over the last 6 months",
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
  showTable?: boolean;
  showChart?: boolean;
  tableData?: Array<{ type: string; count: number }>;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hi there! I'm your smart analyst assistant. Share your data and I'll turn them into insights. You can ask questions about your selected datasets, dashboards, or upload your own documents for analysis.",
    timestamp: "10:30 AM",
  },
];

export default function AnalystWorkspace() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [datasetsOpen, setDatasetsOpen] = useState(true);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const [byodOpen, setByodOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "Based on your query, I analyzed the contract pricing data and rebate accruals. Here are the key findings:\n\n**Rebate Exposure by Customer Segment (Q4 2025)**\n\n• **Enterprise Accounts**: $2.4M exposure across 45 contracts\n• **Mid-Market**: $890K exposure across 128 contracts\n• **SMB Segment**: $340K exposure across 312 contracts\n\nThe Enterprise segment shows the highest concentration of rebate liability, driven primarily by volume-based tier qualifications.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: ["contract_pricing_data", "rebate_accruals_v2", "customer_segments"],
        showTable: true,
        showChart: true,
        tableData: [
          { type: "Enterprise Accounts", count: 2400000 },
          { type: "Mid-Market", count: 890000 },
          { type: "SMB Segment", count: 340000 },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel - Assets */}
        <div className="w-72 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
              onClick={() => navigate("/workspaces")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workspaces
            </Button>
            <h2 className="font-semibold text-foreground mt-3">Q4 Rebate Analysis</h2>
            <p className="text-xs text-muted-foreground mt-1">Pricing & Contracting</p>
          </div>

          <ScrollArea className="flex-1 p-3">
            {/* Datasets */}
            <Collapsible open={datasetsOpen} onOpenChange={setDatasetsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Datasets</span>
                </div>
                {datasetsOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm cursor-pointer transition-colors group",
                      dataset.hasAccess
                        ? "bg-accent/50 hover:bg-accent"
                        : "opacity-60"
                    )}
                  >
                    <span className="truncate flex-1">{dataset.name}</span>
                    {dataset.hasAccess ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs h-auto p-0 text-primary"
                      >
                        Request
                      </Button>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Dashboards */}
            <Collapsible open={dashboardsOpen} onOpenChange={setDashboardsOpen} className="mt-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Dashboards</span>
                </div>
                {dashboardsOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    className="flex items-center gap-2 p-2 rounded-lg text-sm bg-accent/50 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="truncate">{dashboard.name}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* BYOD */}
            <Collapsible open={byodOpen} onOpenChange={setByodOpen} className="mt-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Bring Your Own Data</span>
                </div>
                {byodOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-primary font-medium">Click to Upload</p>
                  <p className="text-xs text-muted-foreground mt-1">(Max 3MB)</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </div>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Analyst Agent</h3>
                <p className="text-xs text-muted-foreground">Powered by SQL, Document & Tableau Agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Clock className="w-4 h-4" />
                History
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Suggested Prompts - show only when no user messages */}
              {messages.length === 1 && (
                <div className="mt-8">
                  <p className="text-sm text-muted-foreground mb-3">Suggested Questions</p>
                  <div className="grid gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="text-left p-3 rounded-lg bg-accent/50 hover:bg-accent border border-transparent hover:border-primary/20 transition-all text-sm"
                        onClick={() => setInputValue(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-xl rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border rounded-bl-md"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Sources */}
                    {message.sources && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-muted rounded-full"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {message.role === "assistant" && message.id > 1 && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Table className="w-3 h-3" />
                          Show Table
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <LineChart className="w-3 h-3" />
                          Show Chart
                        </Button>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground mt-2">
                      {message.timestamp}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary-foreground">JD</span>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse-subtle" />
                  </div>
                  <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-card border rounded-xl p-2">
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </Button>
                <Input
                  placeholder="Enter your query here..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Your queries are logged for audit and compliance purposes
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Evidence & Trace */}
        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Evidence & Trace</h3>
            <p className="text-xs text-muted-foreground mt-1">Query execution details</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <Tabs defaultValue="sources" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="sources" className="flex-1 text-xs">Sources</TabsTrigger>
                <TabsTrigger value="trace" className="flex-1 text-xs">Agent Trace</TabsTrigger>
                <TabsTrigger value="sql" className="flex-1 text-xs">SQL</TabsTrigger>
              </TabsList>

              <TabsContent value="sources" className="mt-4 space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">contract_pricing_data</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    45,230 rows queried • Last refresh: 2h ago
                  </p>
                  <StatusBadge status="certified" size="sm" className="mt-2" />
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">rebate_accruals_v2</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    12,450 rows queried • Last refresh: 1h ago
                  </p>
                  <StatusBadge status="certified" size="sm" className="mt-2" />
                </div>
              </TabsContent>

              <TabsContent value="trace" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Supervisor Agent</span>
                    <span className="text-xs text-muted-foreground ml-auto">0.2s</span>
                  </div>
                  <div className="ml-4 border-l-2 border-border pl-4 space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">SQL Agent</span>
                      <span className="text-xs text-muted-foreground ml-auto">1.4s</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted border">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Synthesis</span>
                      <span className="text-xs text-muted-foreground ml-auto">0.3s</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sql" className="mt-4">
                <div className="bg-muted/50 rounded-lg p-3 border">
                  <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
{`SELECT 
  customer_segment,
  SUM(rebate_amount) as exposure
FROM contract_pricing_data c
JOIN rebate_accruals_v2 r 
  ON c.contract_id = r.contract_id
WHERE quarter = 'Q4'
GROUP BY customer_segment
ORDER BY exposure DESC;`}
                  </pre>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5" />
                  <span>Query masked per policy P-0042</span>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
}
