import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import LoginPage from "@/pages/LoginPage";

import ProviderDashboard from "@/pages/provider/ProviderDashboard";
import ProviderActiveCases from "@/pages/provider/ActiveCases";
import ProviderAppeals from "@/pages/provider/Appeals";
import ProviderReauth from "@/pages/provider/Reauthorizations";
import ProviderAI from "@/pages/provider/AIFeatures";

import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientJourney from "@/pages/patient/Journey";
import PatientCases from "@/pages/patient/Cases";
import PatientDocuments from "@/pages/patient/Documents";
import PatientAI from "@/pages/patient/AIAssistant";

import PayerDashboard from "@/pages/payer/PayerDashboard";
import PayerActiveCases from "@/pages/payer/ActiveCases";
import PayerAI from "@/pages/payer/AIFeatures";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  if (!role) return <Redirect to="/login" />;
  return <AppLayout>{children}</AppLayout>;
}

function RoleRedirect() {
  const { role } = useAuth();
  if (role === 'provider') return <Redirect to="/provider/dashboard" />;
  if (role === 'patient') return <Redirect to="/patient/dashboard" />;
  if (role === 'payer') return <Redirect to="/payer/dashboard" />;
  return <Redirect to="/login" />;
}

function LoginGuard() {
  const { role } = useAuth();
  if (role) return <RoleRedirect />;
  return <LoginPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoleRedirect} />
      <Route path="/login" component={LoginGuard} />

      <Route path="/provider/dashboard">
        <ProtectedLayout><ProviderDashboard /></ProtectedLayout>
      </Route>
      <Route path="/provider/cases">
        <ProtectedLayout><ProviderActiveCases /></ProtectedLayout>
      </Route>
      <Route path="/provider/appeals">
        <ProtectedLayout><ProviderAppeals /></ProtectedLayout>
      </Route>
      <Route path="/provider/reauth">
        <ProtectedLayout><ProviderReauth /></ProtectedLayout>
      </Route>
      <Route path="/provider/ai">
        <ProtectedLayout><ProviderAI /></ProtectedLayout>
      </Route>

      <Route path="/patient/dashboard">
        <ProtectedLayout><PatientDashboard /></ProtectedLayout>
      </Route>
      <Route path="/patient/journey">
        <ProtectedLayout><PatientJourney /></ProtectedLayout>
      </Route>
      <Route path="/patient/cases">
        <ProtectedLayout><PatientCases /></ProtectedLayout>
      </Route>
      <Route path="/patient/docs">
        <ProtectedLayout><PatientDocuments /></ProtectedLayout>
      </Route>
      <Route path="/patient/ai">
        <ProtectedLayout><PatientAI /></ProtectedLayout>
      </Route>

      <Route path="/payer/dashboard">
        <ProtectedLayout><PayerDashboard /></ProtectedLayout>
      </Route>
      <Route path="/payer/cases">
        <ProtectedLayout><PayerActiveCases /></ProtectedLayout>
      </Route>
      <Route path="/payer/ai">
        <ProtectedLayout><PayerAI /></ProtectedLayout>
      </Route>

      <Route>
        <RoleRedirect />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
