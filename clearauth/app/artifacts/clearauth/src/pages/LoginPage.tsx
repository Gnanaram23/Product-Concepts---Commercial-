import { useAuth } from "@/context/AuthContext";
import { Stethoscope, User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Panel */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 xl:px-24">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl tracking-tight leading-none pt-px">CA</span>
          </div>
          <span className="text-2xl font-bold text-[#111827] tracking-tight">ClearAuth</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Sign in to manage prior authorizations efficiently.</p>

        <div className="space-y-4 w-full max-w-md">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Demo Logins</p>
          
          <button 
            onClick={() => login('provider')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-[#EFF6FF] transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Login as Provider</p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Mitchell</p>
            </div>
          </button>

          <button 
            onClick={() => login('patient')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Login as Patient</p>
              <p className="text-sm text-muted-foreground">Robert Brown</p>
            </div>
          </button>

          <button 
            onClick={() => login('payer')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-[#D97706] hover:bg-[#FFFBEB] transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFFBEB] text-[#D97706] flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Login as Payer</p>
              <p className="text-sm text-muted-foreground">Sam Wilson (BlueCross)</p>
            </div>
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-[55%] bg-[#2563EB] relative overflow-hidden flex-col justify-center px-16 xl:px-24">
        {/* Background Image injected via CSS/inline-style for stock or generated */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/login-bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8] to-transparent opacity-80" />
        
        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6 leading-tight text-white">Frictionless Prior Authorization.</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1 text-white">✓</div>
              <div>
                <p className="font-bold text-lg text-white">AI-Powered Form Assistant</p>
                <p className="text-blue-100 mt-1">Auto-fill forms and identify clinical documentation gaps instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1 text-white">✓</div>
              <div>
                <p className="font-bold text-lg text-white">Real-Time Status Tracking</p>
                <p className="text-blue-100 mt-1">Providers and patients always know exactly where a case stands.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1 text-white">✓</div>
              <div>
                <p className="font-bold text-lg text-white">Automated Guidelines Match</p>
                <p className="text-blue-100 mt-1">Payers can review cases 5x faster with extracted clinical criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
