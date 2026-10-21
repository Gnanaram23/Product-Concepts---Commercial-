import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workspaces from "./pages/Workspaces";
import AnalystWorkspace from "./pages/AnalystWorkspace";
import DataProducts from "./pages/DataProducts";
import AssetCatalog from "./pages/AssetCatalog";
import Requests from "./pages/Requests";
import Templates from "./pages/Templates";
import ExportsReports from "./pages/ExportsReports";
import AuditTrace from "./pages/AuditTrace";
import AdminConsole from "./pages/AdminConsole";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<AnalystWorkspace />} />
          <Route path="/workspaces/new" element={<AnalystWorkspace />} />
          <Route path="/data-products" element={<DataProducts />} />
          <Route path="/data-products/:id" element={<DataProducts />} />
          <Route path="/assets" element={<AssetCatalog />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/exports" element={<ExportsReports />} />
          <Route path="/audit" element={<AuditTrace />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
