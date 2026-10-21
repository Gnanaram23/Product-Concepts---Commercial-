import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/shared/KpiCard";
import { DataProductCard } from "@/components/shared/DataProductCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Sparkles,
  Database,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Clock,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentWorkspaces = [
  { id: 1, name: "Q4 Rebate Analysis", lastAccess: "2 hours ago", assets: 5 },
  { id: 2, name: "Contract Renewal Review", lastAccess: "Yesterday", assets: 8 },
  { id: 3, name: "Pricing Optimization Study", lastAccess: "3 days ago", assets: 12 },
];

const suggestedTemplates = [
  { id: 1, name: "Rebate Exposure Analysis", description: "Summarize rebate exposure by customer segment" },
  { id: 2, name: "Net Price Waterfall", description: "Compare net price across top contracts" },
  { id: 3, name: "Contract Exception Review", description: "Identify contracts with exception clauses" },
];

const featuredDataProducts = [
  {
    name: "Contract Analytics Suite",
    description: "Comprehensive analytics for contract performance, renewals, and compliance tracking",
    status: "certified" as const,
    version: "3.2",
    assetCount: 15,
    owner: "Data Governance",
    lastUpdated: "Jan 5",
    domain: "Pricing & Contracting",
  },
  {
    name: "Pricing Intelligence Hub",
    description: "Real-time pricing data, benchmarks, and optimization recommendations",
    status: "certified" as const,
    version: "2.1",
    assetCount: 8,
    owner: "Commercial Ops",
    lastUpdated: "Jan 3",
    domain: "Pricing & Contracting",
  },
  {
    name: "Rebate Management System",
    description: "Track and analyze rebate programs, accruals, and customer tier movements",
    status: "draft" as const,
    version: "1.0",
    assetCount: 6,
    owner: "Finance Team",
    lastUpdated: "Dec 28",
    domain: "Pricing & Contracting",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent to-background border p-8">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, <span className="text-primary">John</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Cortex is ready. Ask questions, generate insights, and accelerate commercial decisions.
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => navigate("/workspaces/new")}
              >
                <MessageSquare className="w-5 h-5" />
                Start Analysis
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate("/templates")}>
                <FileText className="w-5 h-5" />
                Browse Templates
              </Button>
            </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
            <Sparkles className="w-64 h-64 text-primary" />
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Users"
            value="1,247"
            icon={Users}
            trend={{ value: 12, label: "vs last month" }}
          />
          <KpiCard
            title="Insights Generated"
            value="15.2K"
            icon={Sparkles}
            trend={{ value: 8, label: "vs last month" }}
          />
          <KpiCard
            title="Data Products"
            value="52"
            subtitle="48 Certified"
            icon={Database}
          />
          <KpiCard
            title="Compliance Score"
            value="99.2%"
            icon={TrendingUp}
            trend={{ value: 0.3, label: "improvement" }}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Workspaces */}
          <section className="lg:col-span-1 bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Workspaces</h2>
              <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate("/workspaces")}>
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {workspace.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{workspace.lastAccess}</span>
                      <span>•</span>
                      <span>{workspace.assets} assets</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/workspaces/new")}
            >
              Create New Workspace
            </Button>
          </section>

          {/* Suggested Templates */}
          <section className="lg:col-span-2 bg-card rounded-xl border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-foreground">Suggested Analysis Templates</h2>
                <p className="text-sm text-muted-foreground">Pricing & Contracting Domain Pack</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate("/templates")}>
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid gap-3">
              {suggestedTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate("/workspaces/new")}>
                    Use Template
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Featured Data Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Featured Data Products</h2>
              <p className="text-sm text-muted-foreground">Curated for Pricing & Contracting analysts</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/data-products")}>
              Browse Catalog
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDataProducts.map((product, index) => (
              <DataProductCard key={index} {...product} />
            ))}
          </div>
        </section>

        {/* Announcements */}
        <section className="bg-card rounded-xl border shadow-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Announcements</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30 border border-accent">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium text-foreground">Platform Update v2.5 Released</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  New Tableau Agent integration and enhanced document analysis capabilities are now available.
                </p>
                <p className="text-xs text-muted-foreground mt-2">January 5, 2026</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
              <div>
                <p className="font-medium text-foreground">Scheduled Maintenance Notice</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  System maintenance scheduled for January 12, 2026, 2:00 AM - 4:00 AM EST.
                </p>
                <p className="text-xs text-muted-foreground mt-2">January 3, 2026</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
