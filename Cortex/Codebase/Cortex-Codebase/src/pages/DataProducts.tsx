import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataProductCard } from "@/components/shared/DataProductCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Grid, List, Database, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dataProducts = [
  {
    name: "Contract Analytics Suite",
    description: "Comprehensive analytics for contract performance, renewals, and compliance tracking across all therapeutic areas",
    status: "certified" as const,
    version: "3.2",
    assetCount: 15,
    owner: "Data Governance",
    lastUpdated: "Jan 5",
    domain: "Pricing & Contracting",
    hasAccess: true,
  },
  {
    name: "Pricing Intelligence Hub",
    description: "Real-time pricing data, benchmarks, and optimization recommendations for commercial teams",
    status: "certified" as const,
    version: "2.1",
    assetCount: 8,
    owner: "Commercial Ops",
    lastUpdated: "Jan 3",
    domain: "Pricing & Contracting",
    hasAccess: true,
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
    hasAccess: true,
  },
  {
    name: "Customer Segmentation Engine",
    description: "Advanced customer segmentation with predictive modeling and lifetime value calculations",
    status: "certified" as const,
    version: "4.0",
    assetCount: 12,
    owner: "Analytics CoE",
    lastUpdated: "Jan 2",
    domain: "Commercial Analytics",
    hasAccess: true,
  },
  {
    name: "WAC & Net Price Tracker",
    description: "Monitor wholesale acquisition costs and net pricing across product portfolio",
    status: "certified" as const,
    version: "2.3",
    assetCount: 5,
    owner: "Pricing Team",
    lastUpdated: "Dec 30",
    domain: "Pricing & Contracting",
    hasAccess: false,
  },
  {
    name: "Compliance Audit Pack",
    description: "Pre-built audit trails and compliance reporting for regulatory requirements",
    status: "deprecated" as const,
    version: "1.5",
    assetCount: 8,
    owner: "Compliance",
    lastUpdated: "Nov 15",
    domain: "Compliance",
    hasAccess: true,
  },
];

export default function DataProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = dataProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Products</h1>
            <p className="text-muted-foreground mt-1">
              Browse and subscribe to governed data products
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Publish Data Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-muted-foreground">Certified</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">In Development</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">35</p>
                <p className="text-sm text-muted-foreground">Subscribed</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Deprecated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Filters */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="subscribed">My Subscriptions</TabsTrigger>
              <TabsTrigger value="pending">Pending Access</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search data products..."
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
                  <SelectItem value="commercial">Commercial Analytics</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => (
                <DataProductCard
                  key={index}
                  {...product}
                  onClick={() => navigate(`/data-products/${index + 1}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscribed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts
                .filter((p) => p.hasAccess && p.status !== "deprecated")
                .map((product, index) => (
                  <DataProductCard key={index} {...product} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending access requests</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
