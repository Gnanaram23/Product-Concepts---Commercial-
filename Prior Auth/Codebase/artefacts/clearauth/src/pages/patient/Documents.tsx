import { Sparkles, UploadCloud, FileText, CheckCircle, Clock, File } from "lucide-react";

export default function PatientDocuments() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold text-foreground">My Documents</h1>
        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 shadow-sm flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#1D4ED8]">AI Suggestion</p>
          <p className="text-sm text-[#2563EB] mt-1">Your doctor needs a specialist consultation letter for PA-554089. Ask your pulmonologist to send notes via ClearAuth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Clinical Notes", type: "Medical Records", status: "Submitted", icon: FileText, color: "green" },
          { name: "Lab Results", type: "Test Results", status: "Submitted", icon: FileText, color: "green" },
          { name: "Prior Auth Form", type: "Form", status: "Submitted", icon: FileText, color: "green" },
          { name: "Specialist Letter", type: "Consultation Note", status: "Needed", icon: Clock, color: "amber" },
          { name: "Pharmacy Records", type: "Records", status: "Uploaded", icon: File, color: "blue" },
          { name: "Imaging Report", type: "Scans", status: "Uploaded", icon: File, color: "blue" },
        ].map((doc, i) => (
          <div key={i} className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                doc.color === 'green' ? 'bg-[#F0FDF4] text-[#16A34A]' :
                doc.color === 'amber' ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#EFF6FF] text-[#2563EB]'
              }`}>
                <doc.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.type} · Oct 2024</p>
              </div>
            </div>
            
            {doc.status === 'Needed' ? (
              <button className="px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-md hover:bg-[#DBEAFE] transition-colors border border-[#BFDBFE]">
                Upload Document
              </button>
            ) : (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                doc.status === 'Submitted' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]' : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
              }`}>
                {doc.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
