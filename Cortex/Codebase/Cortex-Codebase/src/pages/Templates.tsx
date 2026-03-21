import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MessageSquare,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
  ArrowRight,
  Star,
  Users,
  Clock,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: 1,
    name: "Rebate Exposure Analysis",
    description: "Summarize rebate exposure by customer segment for any given quarter. Includes tier movement analysis and accrual impact.",
    category: "Rebates",
    domain: "Pricing & Contracting",
    icon: DollarSign,
    prompt: "Summarize rebate exposure by customer segment for last quarter.",
    dataSources: ["Contract Analytics Suite", "Rebate Management System"],
    usageCount: 234,
    rating: 4.8,
    author: "Analytics CoE",
    featured: true,
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "Net Price Waterfall Comparison",
    description: "Compare net price waterfall across top contracts to identify pricing leakage and optimization opportunities.",
    category: "Pricing",
    domain: "Pricing & Contracting",
    icon: BarChart3,
    prompt: "Compare net price waterfall across top 10 contracts.",
    dataSources: ["Pricing Intelligence Hub", "WAC & Net Price Tracker"],
    usageCount: 189,
    rating: 4.7,
    author: "Pricing Team",
    featured: true,
    lastUsed: "Yesterday",
  },
  {
    id: 3,
    name: "Contract Exception Finder",
    description: "Identify contracts with exception clauses related to renewal terms, early termination, or non-standard pricing conditions.",
    category: "Contracts",
    domain: "Pricing & Contracting",
    icon: FileText,
    prompt: "Identify contracts with exception clauses related to renewal terms.",
    dataSources: ["Contract Analytics Suite", "Managed Care Repository"],
    usageCount: 156,
    rating: 4.5,
    author: "Legal & Compliance",
    featured: false,
    lastUsed: "3 days ago",
  },
  {
    id: 4,
    name: "KPI Movement Explainer",
    description: "Explain KPI movement using Tableau dashboard context and identify key drivers behind metric changes.",
    category: "Analytics",
    domain: "Commercial Analytics",
    icon: TrendingUp,
    prompt: "Explain KPI movement using Tableau dashboard context and drivers.",
    dataSources: ["Tableau Dashboards", "KPI Definitions (Metastore)"],
    usageCount: 312,
    rating: 4.9,
    author: "Analytics CoE",
    featured: true,
    lastUsed: "1 hour ago",
  },
  {
    id: 5,
    name: "Margin Impact Assessment",
    description: "Combine SAP sales volume with pricing terms to assess margin impact across product portfolio and customer segments.",
    category: "Pricing",
    domain: "Pricing & Contracting",
    icon: DollarSign,
    prompt: "Combine SAP sales volume with pricing terms to assess margin impact.",
    dataSources: ["SAP Sales Data", "Pricing Intelligence Hub"],
    usageCount: 98,
    rating: 4.3,
    author: "Finance Team",
    featured: false,
    lastUsed: "1 week ago",
  },
  {
    id: 6,
    name: "340B Utilization Review",
    description: "Analyze 340B program utilization patterns, identify duplicate discounts, and flag compliance risks.",
    category: "Compliance",
    domain: "Pricing & Contracting",
    icon: FileText,
    prompt: "Review 340B program utilization and flag potential duplicate discount scenarios.",
    dataSources: ["Government Pricing Dataset", "340B Contract Repository"],
    usageCount: 145,
    rating: 4.6,
    author: "Compliance Team",
    featured: false,
    lastUsed: "2 days ago",
  },
  {
    id: 7,
    name: "Quarterly Business Review Pack",
    description: "Generate a comprehensive QBR summary with contract performance, pricing trends, rebate exposure, and key recommendations.",
    category: "Reporting",
    domain: "Commercial Analytics",
    icon: BarChart3,
    prompt: "Generate a QBR summary covering contract performance, pricing trends, and rebate exposure for this quarter.",
    dataSources: ["Contract Analytics Suite", "Pricing Intelligence Hub", "Rebate Management System"],
    usageCount: 267,
    rating: 4.8,
    author: "Commercial Ops",
    featured: true,
    lastUsed: "5 hours ago",
  },
  {
    id: 8,
    name: "Customer Tier Migration",
    description: "Track customer tier movements across quarters and model revenue impact of tier changes on rebate obligations.",
    category: "Rebates",
    domain: "Pricing & Contracting",
    icon: Users,
    prompt: "Analyze customer tier migration patterns and project rebate impact for next quarter.",
    dataSources: ["Customer Segmentation Engine", "Rebate Management System"],
    usageCount: 112,
    rating: 4.4,
    author: "Analytics CoE",
    featured: false,
    lastUsed: "4 days ago",
  },
];

const categories = ["All", "Pricing", "Rebates", "Contracts", "Analytics", "Compliance", "Reporting"];

export default function Templates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: typeof templates[0]) => {
    navigate("/workspaces/new");
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analysis Templates</h1>
            <p className="text-muted-foreground mt-1">
              Pre-built analysis packs for common commercial questions
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>

        {/* Featured Templates */}
        <section>
          <h2 className="font-semibold text-foreground mb-4">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates
              .filter((t) => t.featured)
              .map((template) => (
                <div
                  key={template.id}
                  className="bg-card rounded-xl border shadow-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <template.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{template.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{template.usageCount} uses</span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* All Templates */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-1 border rounded-lg p-1">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-card rounded-xl border shadow-card p-5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <template.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        <Badge variant="secondary" className="text-xs">{template.domain}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{template.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{template.usageCount} uses</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last used {template.lastUsed}</span>
                        <span>By {template.author}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {template.dataSources.map((src) => (
                          <Badge key={src} variant="outline" className="text-[10px] font-normal">{src}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => handleUseTemplate(template)}>
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
