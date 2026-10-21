import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ResultChart, ResultTable, RichText } from "@/components/workspace/AnswerView";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Send,
  Database,
  BarChart3,
  Upload,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Copy,
  Table,
  LineChart,
  Info,
  CheckCircle,
  Settings2,
  Lock,
  FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getDataset } from "@/engine/dataset";
import { ask, registerUserTable, type Answer } from "@/engine/engine";
import { getLLMSettings, saveLLMSettings, type LLMSettings } from "@/engine/llm";
import { parseCsv, tableNameFor } from "@/engine/csv";

const dashboards = [
  { id: 1, name: "Contract Analytics v2.1" },
  { id: 2, name: "Pricing Trends Dashboard" },
  { id: 3, name: "Rebate Performance" },
];

const suggestedPrompts = [
  "Summarize rebate exposure by customer segment for last quarter",
  "Compare net price waterfall across top 10 contracts",
  "Identify contracts with exception clauses related to renewal terms",
  "Show pricing trends by product category over the last 6 months",
  "Which contracts expire in the next 12 months?",
  "What data can I use?",
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  answer?: Answer;
  view?: { table: boolean; chart: boolean };
}

const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi, I'm the Cortex analyst agent. Ask a question about contract pricing, rebates or gross-to-net. I translate it into SQL against the certified datasets on the left, run it, and show the result with the query and its sources.",
    timestamp: time(),
  },
];

export default function AnalystWorkspace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { meta, tables } = useMemo(() => getDataset(), []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [datasetsOpen, setDatasetsOpen] = useState(true);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const [byodOpen, setByodOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploads, setUploads] = useState<{ name: string; rows: number }[]>([]);
  const [llm, setLlm] = useState<LLMSettings | null>(() => getLLMSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<LLMSettings>(() => getLLMSettings() ?? { baseUrl: "https://api.openai.com/v1", apiKey: "", model: "gpt-4o-mini" });
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const latest = [...messages].reverse().find((m) => m.answer)?.answer;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;
    setMessages((prev) => [...prev, { id: prev.length + 1, role: "user", content: question, timestamp: time() }]);
    setInputValue("");
    setIsTyping(true);
    try {
      const answer = await ask(question);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: answer.text,
          timestamp: time(),
          answer,
          view: { table: !answer.chart && answer.rows.length > 0, chart: Boolean(answer.chart) },
        },
      ]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: prev.length + 1, role: "assistant", content: `Something went wrong running that query: ${(e as Error).message}`, timestamp: time() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggle = (id: number, key: "table" | "chart") =>
    setMessages((prev) => prev.map((m) => (m.id === id && m.view ? { ...m, view: { ...m.view, [key]: !m.view[key] } } : m)));

  const onUpload = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      toast({ title: "File too large", description: "The limit is 3 MB.", variant: "destructive" });
      return;
    }
    try {
      const rows = parseCsv(await file.text());
      const name = tableNameFor(file.name);
      await registerUserTable(name, rows);
      setUploads((u) => [...u.filter((x) => x.name !== name), { name, rows: rows.length }]);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: `Loaded **${file.name}** as **${name}** (${rows.length} rows, columns: ${Object.keys(rows[0]).join(", ")}). It stays in this browser and is marked uncertified. ${llm ? `Ask anything about ${name}.` : `Ask "show ${name}" to preview it; connect a model in Settings for free-form questions.`}`,
          timestamp: time(),
        },
      ]);
    } catch (e) {
      toast({ title: "Could not read the file", description: (e as Error).message, variant: "destructive" });
    }
  };

  const saveSettings = () => {
    const s = draft.baseUrl && draft.model ? draft : null;
    saveLLMSettings(s);
    setLlm(s);
    setSettingsOpen(false);
    toast({ title: s ? `Model connected: ${s.model}` : "Model disconnected", description: s ? "Questions the semantic layer cannot answer will go to this model." : "Answers use the semantic layer only." });
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left panel: governed assets */}
        <div className="w-72 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-2" onClick={() => navigate("/workspaces")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Workspaces
            </Button>
            <h2 className="font-semibold text-foreground mt-3">Q4 Rebate Analysis</h2>
            <p className="text-xs text-muted-foreground mt-1">Pricing & Contracting</p>
          </div>

          <ScrollArea className="flex-1 p-3">
            <Collapsible open={datasetsOpen} onOpenChange={setDatasetsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Datasets</span>
                </div>
                {datasetsOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {meta.map((t) => (
                  <div
                    key={t.name}
                    title={t.description}
                    className={cn("flex items-center gap-2 p-2 rounded-lg text-sm transition-colors group", t.access === "granted" ? "bg-accent/50 hover:bg-accent cursor-default" : "opacity-60")}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate block">{t.name}</span>
                      <span className="text-[11px] text-muted-foreground">{t.access === "granted" ? `${tables[t.name].length} rows · ${t.owner}` : `Restricted · ${t.owner}`}</span>
                    </div>
                    {t.access === "granted" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs h-auto p-0 text-primary"
                        onClick={() => toast({ title: "Access request sent", description: `${t.owner} will review your request for ${t.name}.` })}
                      >
                        Request
                      </Button>
                    )}
                  </div>
                ))}
                {uploads.map((u) => (
                  <div key={u.name} className="flex items-center gap-2 p-2 rounded-lg text-sm bg-amber-50 border border-amber-100">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                    <div className="min-w-0 flex-1">
                      <span className="truncate block">{u.name}</span>
                      <span className="text-[11px] text-muted-foreground">{u.rows} rows · uploaded, uncertified</span>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={dashboardsOpen} onOpenChange={setDashboardsOpen} className="mt-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Dashboards</span>
                </div>
                {dashboardsOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {dashboards.map((d) => (
                  <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg text-sm bg-accent/50 hover:bg-accent cursor-pointer transition-colors">
                    <span className="truncate">{d.name}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={byodOpen} onOpenChange={setByodOpen} className="mt-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Bring Your Own Data</span>
                </div>
                {byodOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onUpload(f);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-primary font-medium">Upload a CSV</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 3 MB · stays in this browser</p>
                </button>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>
        </div>

        {/* Centre: chat */}
        <div className="flex-1 flex flex-col bg-background min-w-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Analyst Agent</h3>
                <p className="text-xs text-muted-foreground">
                  Semantic layer → SQL → certified data{llm ? ` · LLM: ${llm.model}` : ""}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="w-4 h-4" />
              {llm ? "Model connected" : "Connect a model"}
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 min-w-0",
                      message.role === "user" ? "max-w-xl bg-primary text-primary-foreground rounded-br-md" : "max-w-2xl w-full bg-card border rounded-bl-md",
                    )}
                  >
                    {message.role === "user" ? <p className="text-sm whitespace-pre-wrap">{message.content}</p> : <RichText text={message.content} />}

                    {message.answer?.notes.map((n) => (
                      <p key={n} className="mt-2 text-[11px] text-muted-foreground flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" />
                        {n}
                      </p>
                    ))}
                    {message.answer?.mode === "restricted" && (
                      <Button size="sm" variant="outline" className="mt-3 h-7 text-xs gap-1" onClick={() => toast({ title: "Access request sent", description: "Sales Operations will review your request." })}>
                        <Lock className="w-3 h-3" />
                        Request access to sales_performance
                      </Button>
                    )}

                    {message.answer && message.view?.chart && message.answer.chart && <ResultChart chart={message.answer.chart} />}
                    {message.answer && message.view?.table && <ResultTable answer={message.answer} />}

                    {message.answer && message.answer.sources.length > 0 && message.answer.mode !== "restricted" && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.answer.sources.map((s) => (
                            <span key={s.table} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                              {s.table}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.answer && (message.answer.rows.length > 0 || message.answer.chart) && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => {
                            void navigator.clipboard?.writeText(`${message.content}\n\n${message.answer?.sql ?? ""}`);
                            toast({ title: "Copied answer and SQL" });
                          }}
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                        {message.answer.rows.length > 0 && (
                          <Button variant={message.view?.table ? "secondary" : "outline"} size="sm" className="h-7 text-xs gap-1" onClick={() => toggle(message.id, "table")}>
                            <Table className="w-3 h-3" />
                            {message.view?.table ? "Hide Table" : "Show Table"}
                          </Button>
                        )}
                        {message.answer.chart && (
                          <Button variant={message.view?.chart ? "secondary" : "outline"} size="sm" className="h-7 text-xs gap-1" onClick={() => toggle(message.id, "chart")}>
                            <LineChart className="w-3 h-3" />
                            {message.view?.chart ? "Hide Chart" : "Show Chart"}
                          </Button>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground mt-2">{message.timestamp}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary-foreground">JD</span>
                    </div>
                  )}
                </div>
              ))}

              {messages.length === 1 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Suggested Questions</p>
                  <div className="grid gap-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="text-left p-3 rounded-lg bg-accent/50 hover:bg-accent border border-transparent hover:border-primary/20 transition-all text-sm"
                        onClick={() => void send(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse-subtle" />
                  </div>
                  <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-card border rounded-xl p-2">
                <Sparkles className="w-5 h-5 text-primary mx-2 flex-shrink-0" />
                <Input
                  placeholder="Ask about rebates, gross-to-net, net price, contracts…"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void send(inputValue)}
                />
                <Button size="icon" className="flex-shrink-0" onClick={() => void send(inputValue)} disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Synthetic demo data. Queries run in your browser and are shown in full in the SQL tab.</p>
            </div>
          </div>
        </div>

        {/* Right panel: evidence and trace for the latest answer */}
        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Evidence & Trace</h3>
            <p className="text-xs text-muted-foreground mt-1">For the latest answer</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            {!latest ? (
              <p className="text-sm text-muted-foreground">Ask a question to see the datasets used, each step taken and the exact SQL.</p>
            ) : (
              <Tabs defaultValue="sources" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="sources" className="flex-1 text-xs">Sources</TabsTrigger>
                  <TabsTrigger value="trace" className="flex-1 text-xs">Agent Trace</TabsTrigger>
                  <TabsTrigger value="sql" className="flex-1 text-xs">SQL</TabsTrigger>
                </TabsList>

                <TabsContent value="sources" className="mt-4 space-y-3">
                  {latest.sources.length === 0 && <p className="text-xs text-muted-foreground">No dataset was queried for this answer.</p>}
                  {latest.sources.map((s) => (
                    <div key={s.table} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm break-all">{s.table}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {s.rows.toLocaleString()} rows · {s.owner} · refreshed {s.refreshed.toLowerCase()}
                      </p>
                      {latest.mode === "restricted" ? (
                        <StatusBadge status="restricted" size="sm" className="mt-2" />
                      ) : s.certified ? (
                        <StatusBadge status="certified" size="sm" className="mt-2" />
                      ) : (
                        <StatusBadge status="draft" size="sm" className="mt-2" />
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="trace" className="mt-4">
                  <div className="space-y-2">
                    {latest.trace.map((t, i) => (
                      <div key={i} className={cn("p-2 rounded border", i === 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200", i > 0 && "ml-4")}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={cn("w-4 h-4", i === 0 ? "text-green-600" : "text-blue-600")} />
                          <span className="text-sm">{t.step}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{t.ms < 1 ? "<1 ms" : `${Math.round(t.ms)} ms`}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 pl-6">{t.detail}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sql" className="mt-4">
                  {latest.sql ? (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">{latest.sql}</pre>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No SQL was run for this answer.</p>
                  )}
                  <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{latest.mode === "llm" ? "Written by the connected model, checked to be read-only and limited to permitted tables." : "Generated by the semantic layer from governed metric definitions."}</span>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </ScrollArea>
        </div>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a language model (optional)</DialogTitle>
            <DialogDescription>
              Cortex answers with its semantic layer by default. A model adds free-form questions and questions about uploaded files. Any OpenAI-compatible endpoint works, including a local Ollama server (http://localhost:11434/v1). The key is stored only in this browser and sent only to the endpoint below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="llm-url">Base URL</Label>
              <Input id="llm-url" value={draft.baseUrl} onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="llm-key">API key</Label>
              <Input id="llm-key" type="password" placeholder="Not needed for Ollama" value={draft.apiKey} onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="llm-model">Model</Label>
              <Input id="llm-model" value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            {llm && (
              <Button
                variant="outline"
                onClick={() => {
                  saveLLMSettings(null);
                  setLlm(null);
                  setSettingsOpen(false);
                }}
              >
                Disconnect
              </Button>
            )}
            <Button onClick={saveSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
