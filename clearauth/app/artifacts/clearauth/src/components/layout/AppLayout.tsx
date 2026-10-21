import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Search, LayoutDashboard, FileText, CheckCircle, RefreshCcw, Sparkles, FolderHeart, Activity, FileCheck, FileSignature, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AIChatModal } from "@/components/modals/AIChatModal";
import { cn } from "@/lib/utils";

const NAV_CONFIG = {
  provider: [
    { section: "MAIN MENU", items: [
      { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
      { label: "Active Cases", href: "/provider/cases", icon: FileText },
      { label: "Appeals", href: "/provider/appeals", icon: CheckCircle },
      { label: "Reauthorizations", href: "/provider/reauth", icon: RefreshCcw },
    ]},
    { section: "AI & TOOLS", items: [
      { label: "AI Features", href: "/provider/ai", icon: Sparkles, color: "text-[#7C3AED]" },
    ]}
  ],
  patient: [
    { section: "MY HEALTH", items: [
      { label: "My Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
      { label: "My PA Journey", href: "/patient/journey", icon: Activity },
      { label: "My Cases", href: "/patient/cases", icon: FileCheck },
      { label: "My Documents", href: "/patient/docs", icon: FolderHeart },
    ]},
    { section: "SUPPORT", items: [
      { label: "AI Assistant", href: "/patient/ai", icon: Sparkles, color: "text-[#7C3AED]" },
    ]}
  ],
  payer: [
    { section: "REVIEW QUEUE", items: [
      { label: "Dashboard", href: "/payer/dashboard", icon: LayoutDashboard },
      { label: "Active Cases", href: "/payer/cases", icon: FileSignature },
    ]},
    { section: "AI TOOLS", items: [
      { label: "AI Features", href: "/payer/ai", icon: Sparkles, color: "text-[#7C3AED]" },
    ]}
  ]
};

const ROLE_COLORS = {
  provider: { badge: "bg-[#EFF6FF] text-[#2563EB]", fab: "bg-[#2563EB] hover:bg-[#1D4ED8]", dot: "bg-[#2563EB]" },
  patient: { badge: "bg-[#F0FDF4] text-[#16A34A]", fab: "bg-[#16A34A] hover:bg-[#15803D]", dot: "bg-[#16A34A]" },
  payer: { badge: "bg-[#FFFBEB] text-[#D97706]", fab: "bg-[#D97706] hover:bg-[#B45309]", dot: "bg-[#D97706]" },
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { role, user, logout } = useAuth();
  const [location] = useLocation();
  const [aiOpen, setAiOpen] = useState(false);

  if (!role || !user) return null;

  const navSections = NAV_CONFIG[role];
  const colors = ROLE_COLORS[role];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      {/* TopNav */}
      <header className="h-[52px] bg-white border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2 w-56">
          <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-sm tracking-tight leading-none pt-px">CA</span>
          </div>
          <span className="text-[17px] font-bold text-[#111827] tracking-tight">ClearAuth</span>
        </div>

        <div className="flex-1 flex justify-center max-w-md hidden md:flex">
          <div className="relative w-full max-w-[260px]">
            <Search className="absolute left-2.5 top-1.5 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search patients, cases..."
              className="w-full h-8 pl-9 pr-3 rounded-full bg-[#F3F4F6] border-transparent text-sm focus:bg-white focus:border-[#BFDBFE] focus:ring-2 focus:ring-[#EFF6FF] transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn("hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", colors.badge)}>
            {role}
          </span>
          <button className="relative p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white" />
          </button>
          <button className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm", user.color)}>
            {user.initials}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[224px] bg-white border-r flex flex-col hidden md:flex h-[calc(100vh-52px)] sticky top-[52px]">
          {/* User info at top */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0", user.color)}>
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#111827] truncate">{user.name}</p>
                <p className="text-[11px] text-[#6B7280] truncate">{user.title}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {navSections.map((section, i) => (
              <div key={i} className="mb-5">
                <h3 className="px-4 text-[10.5px] font-bold text-[#9CA3AF] mb-2 uppercase tracking-wider">
                  {section.section}
                </h3>
                <nav className="space-y-0.5 px-2">
                  {section.items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all group",
                          isActive
                            ? "bg-[#EFF6FF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB]"
                            : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] font-medium border-l-2 border-transparent"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4", isActive ? "text-[#2563EB]" : (item as Record<string, string>).color || "text-[#6B7280] group-hover:text-[#374151]")} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom Account Section */}
          <div className="p-4 border-t">
            {/* Quick AI chat button in sidebar */}
            <button
              onClick={() => setAiOpen(true)}
              className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-white font-bold mb-3 transition-colors", colors.fab)}
            >
              <Sparkles className="w-4 h-4" />
              Quick AI Chat
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[13px] text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#DC2626] font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>

          {/* Floating AI Button (bottom-right, visible on all pages) */}
          <button
            onClick={() => setAiOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-2xl group",
              colors.fab
            )}
            title="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-8 right-0 bg-[#111827] text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              AI Assistant
            </span>
          </button>
        </main>
      </div>

      {/* Global AI Chat Modal — accessible from all pages */}
      <AIChatModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
