import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreVertical, Users, Calendar, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const workspaces = [
  {
    id: 1,
    name: "Q4 Rebate Analysis",
    domainPack: "Pricing & Contracting",
    owner: "John Doe",
    members: 4,
    lastActivity: "2 hours ago",
    classification: "Internal",
    retention: "90 days",
    status: "certified" as const,
  },
  {
    id: 2,
    name: "Contract Renewal Review",
    domainPack: "Pricing & Contracting",
    owner: "Jane Smith",
    members: 6,
    lastActivity: "Yesterday",
    classification: "Confidential",
    retention: "180 days",
    status: "certified" as const,
  },
  {
    id: 3,
    name: "Pricing Optimization Study",
    domainPack: "Pricing & Contracting",
    owner: "John Doe",
    members: 3,
    lastActivity: "3 days ago",
    classification: "Internal",
    retention: "90 days",
    status: "draft" as const,
  },
  {
    id: 4,
    name: "Market Access Analysis",
    domainPack: "Market Access",
    owner: "Mike Johnson",
    members: 5,
    lastActivity: "1 week ago",
    classification: "Restricted",
    retention: "365 days",
    status: "restricted" as const,
  },
];

export default function Workspaces() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
            <p className="text-muted-foreground mt-1">
              Manage your analysis workspaces and collaborate with team members
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/workspaces/new")}>
            <Plus className="w-4 h-4" />
            Create Workspace
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workspaces..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Domain Pack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="pricing">Pricing & Contracting</SelectItem>
              <SelectItem value="market">Market Access</SelectItem>
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
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Workspaces Table */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Workspace</TableHead>
                <TableHead className="font-semibold">Domain Pack</TableHead>
                <TableHead className="font-semibold">Owner</TableHead>
                <TableHead className="font-semibold">Members</TableHead>
                <TableHead className="font-semibold">Last Activity</TableHead>
                <TableHead className="font-semibold">Classification</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((workspace) => (
                <TableRow
                  key={workspace.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">Retention: {workspace.retention}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{workspace.domainPack}</TableCell>
                  <TableCell className="text-muted-foreground">{workspace.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{workspace.members}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{workspace.lastActivity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {workspace.classification}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={workspace.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open Workspace</DropdownMenuItem>
                        <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                        <DropdownMenuItem>Manage Members</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
