import { useState, useRef } from "react";
import { X, Upload, FileText, Download, Trash2, Link, CheckCircle, AlertCircle, Database, Plus, File, Image } from "lucide-react";
import { cn } from "@/lib/utils";

type EHRRecord = { id: string; name: string; type: string; date: string; source: string; size: string };
type UploadedDoc = { id: string; name: string; size: string; type: string; status: 'uploading' | 'ready' | 'error' };

const EHR_RECORDS: EHRRecord[] = [
  { id: "e1", name: "HbA1c Lab Results - Q1 2025", type: "Lab Report", date: "Mar 12, 2025", source: "Quest Diagnostics", size: "124 KB" },
  { id: "e2", name: "Rheumatology Consultation Note", type: "Specialist Note", date: "Feb 28, 2025", source: "Epic EHR", size: "87 KB" },
  { id: "e3", name: "CBC with Differential - Feb 2025", type: "Lab Report", date: "Feb 14, 2025", source: "LabCorp", size: "96 KB" },
  { id: "e4", name: "DAS28 Disease Activity Score", type: "Assessment", date: "Feb 28, 2025", source: "Epic EHR", size: "42 KB" },
  { id: "e5", name: "Methotrexate Prescription History", type: "Pharmacy Record", date: "Jan 2023 – Feb 2025", source: "CVS Pharmacy", size: "203 KB" },
  { id: "e6", name: "Hydroxychloroquine Prescription History", type: "Pharmacy Record", date: "Feb 2024 – Feb 2025", source: "CVS Pharmacy", size: "178 KB" },
  { id: "e7", name: "CRP / ESR Inflammation Markers", type: "Lab Report", date: "Mar 5, 2025", source: "Quest Diagnostics", size: "68 KB" },
  { id: "e8", name: "Radiology - Joint X-Ray Report", type: "Radiology", date: "Jan 20, 2025", source: "Epic EHR", size: "1.4 MB" },
];

const FILE_ICONS: Record<string, React.ElementType> = {
  "Lab Report": FileText,
  "Specialist Note": FileText,
  "Assessment": FileText,
  "Pharmacy Record": Database,
  "Radiology": Image,
};

export function DocumentsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'upload' | 'ehr'>('upload');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([
    { id: "d1", name: "clinical_justification_rinvoq.pdf", size: "245 KB", type: "PDF", status: 'ready' },
    { id: "d2", name: "step_therapy_records.pdf", size: "312 KB", type: "PDF", status: 'ready' },
  ]);
  const [selectedEHR, setSelectedEHR] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [ehrConnected, setEhrConnected] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const id = `u${Date.now()}-${Math.random()}`;
      const doc: UploadedDoc = {
        id,
        name: file.name,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        type: file.name.split('.').pop()?.toUpperCase() ?? 'FILE',
        status: 'uploading',
      };
      setUploadedDocs(p => [...p, doc]);
      setTimeout(() => {
        setUploadedDocs(p => p.map(d => d.id === id ? { ...d, status: 'ready' } : d));
      }, 1500);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleImportEHR = () => {
    if (selectedEHR.size === 0) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImported(prev => {
        const next = new Set(prev);
        selectedEHR.forEach(id => next.add(id));
        return next;
      });
      const records = EHR_RECORDS.filter(r => selectedEHR.has(r.id));
      const newDocs: UploadedDoc[] = records.map(r => ({
        id: `ehr-${r.id}`,
        name: r.name,
        size: r.size,
        type: r.type.split(' ')[0],
        status: 'ready' as const,
      }));
      setUploadedDocs(p => [...p, ...newDocs]);
      setSelectedEHR(new Set());
      setTab('upload');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-[780px] max-w-[95vw] h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="h-[56px] border-b flex items-center justify-between px-5 bg-gradient-to-r from-[#F0FDF4] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#111827] leading-tight">Document Management</h2>
              <p className="text-[11px] text-[#6B7280]">Upload files or import directly from connected EHR systems</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-[#6B7280]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5 shrink-0">
          <button
            onClick={() => setTab('upload')}
            className={cn("px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-2",
              tab === 'upload' ? "border-[#16A34A] text-[#16A34A]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload Documents
            {uploadedDocs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold">{uploadedDocs.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab('ehr')}
            className={cn("px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-2",
              tab === 'ehr' ? "border-[#16A34A] text-[#16A34A]" : "border-transparent text-[#6B7280] hover:text-[#111827]"
            )}
          >
            <Database className="w-4 h-4" />
            EHR Integration
            {ehrConnected && <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" />}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">

          {/* Upload Tab */}
          {tab === 'upload' && (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Drop Zone */}
              <div
                className="mx-5 mt-4 border-2 border-dashed border-[#BBF7D0] rounded-2xl p-6 text-center hover:border-[#16A34A] hover:bg-[#F0FDF4]/50 transition-all cursor-pointer"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.jpg,.png,.txt" onChange={e => handleFileSelect(e.target.files)} />
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#16A34A]" />
                </div>
                <p className="font-bold text-[#111827] text-[14px]">Drop files here or click to upload</p>
                <p className="text-[12px] text-[#6B7280] mt-1">Supports PDF, DOC, DOCX, JPG, PNG · Max 25 MB per file</p>
              </div>

              {/* File List */}
              <div className="flex-1 overflow-y-auto px-5 pb-4">
                {uploadedDocs.length === 0 ? (
                  <div className="text-center py-8 text-[#9CA3AF] text-sm">No documents uploaded yet</div>
                ) : (
                  <div className="space-y-2 mt-4">
                    {uploadedDocs.map(doc => {
                      const isEHR = doc.id.startsWith('ehr-');
                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-[#F9FAFB] transition-colors">
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", isEHR ? "bg-[#EFF6FF]" : "bg-[#F0FDF4]")}>
                            <File className={cn("w-4 h-4", isEHR ? "text-[#2563EB]" : "text-[#16A34A]")} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#111827] truncate">{doc.name}</p>
                            <p className="text-[11px] text-[#9CA3AF]">
                              {isEHR ? "📋 Imported from EHR · " : ""}{doc.size} · {doc.type}
                            </p>
                          </div>
                          {doc.status === 'uploading' ? (
                            <div className="w-4 h-4 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin shrink-0" />
                          ) : doc.status === 'ready' ? (
                            <div className="flex items-center gap-2 shrink-0">
                              <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                              <button className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors text-[#9CA3AF] hover:text-[#374151]">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setUploadedDocs(p => p.filter(d => d.id !== doc.id))}
                                className="p-1.5 hover:bg-[#FEF2F2] rounded-lg transition-colors text-[#9CA3AF] hover:text-[#DC2626]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 pt-2 border-t shrink-0 flex items-center justify-between">
                <p className="text-[12px] text-[#6B7280]">{uploadedDocs.filter(d => d.status === 'ready').length} document(s) ready to attach</p>
                <div className="flex gap-2">
                  <button onClick={() => setTab('ehr')} className="px-4 py-2 border rounded-lg text-[13px] font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Import from EHR
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-[#16A34A] text-white text-[13px] font-bold rounded-lg hover:bg-[#15803D] transition-colors"
                  >
                    Attach to Case →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EHR Tab */}
          {tab === 'ehr' && (
            <div className="h-full flex flex-col overflow-hidden">
              {/* EHR Connection Status */}
              <div className="mx-5 mt-4 shrink-0">
                <div className={cn("p-4 rounded-xl border flex items-center justify-between", ehrConnected ? "bg-[#F0FDF4] border-[#BBF7D0]" : "bg-[#FEF2F2] border-[#FECACA]")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", ehrConnected ? "bg-[#16A34A]" : "bg-[#DC2626]")}>
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-[#111827]">Epic EHR + LabCorp + Quest Diagnostics</p>
                      <p className="text-[11px] text-[#6B7280]">{ehrConnected ? "Connected via FHIR R4 · Last synced 2 mins ago" : "Connection failed — click to reconnect"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ehrConnected && <CheckCircle className="w-5 h-5 text-[#16A34A]" />}
                    {!ehrConnected && (
                      <button onClick={() => setEhrConnected(true)} className="px-3 py-1 bg-[#DC2626] text-white text-xs font-bold rounded-lg">
                        Reconnect
                      </button>
                    )}
                    <Link className="w-4 h-4 text-[#6B7280]" />
                  </div>
                </div>
              </div>

              {/* EHR Records */}
              <div className="px-5 mt-3 flex items-center justify-between shrink-0">
                <p className="text-[12.5px] font-bold text-[#374151]">Patient Records — John Smith (DOB: 01/15/1972)</p>
                <p className="text-[11px] text-[#9CA3AF]">{selectedEHR.size} selected</p>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4 mt-2 space-y-2">
                {EHR_RECORDS.map(record => {
                  const Icon = FILE_ICONS[record.type] ?? FileText;
                  const isSelected = selectedEHR.has(record.id);
                  const isAlreadyImported = imported.has(record.id);
                  return (
                    <label
                      key={record.id}
                      className={cn(
                        "flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all",
                        isAlreadyImported ? "bg-[#F9FAFB] opacity-60 cursor-default" :
                          isSelected ? "bg-[#EFF6FF] border-[#BFDBFE] shadow-sm" : "hover:bg-[#F9FAFB] hover:border-[#E5E7EB]"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isAlreadyImported}
                        onChange={() => {
                          if (isAlreadyImported) return;
                          setSelectedEHR(prev => {
                            const next = new Set(prev);
                            next.has(record.id) ? next.delete(record.id) : next.add(record.id);
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded accent-[#2563EB] shrink-0"
                      />
                      <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#111827] truncate">{record.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{record.type} · {record.date} · {record.source} · {record.size}</p>
                      </div>
                      {isAlreadyImported && (
                        <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded-full shrink-0">Imported</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 pb-4 pt-3 border-t shrink-0 flex items-center justify-between">
                <button
                  onClick={() => setSelectedEHR(new Set(EHR_RECORDS.filter(r => !imported.has(r.id)).map(r => r.id)))}
                  className="text-[12px] text-[#2563EB] font-semibold hover:underline"
                >
                  Select All
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setTab('upload')} className="px-4 py-2 border rounded-lg text-[13px] font-semibold text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handleImportEHR}
                    disabled={selectedEHR.size === 0 || importing}
                    className="px-5 py-2 bg-[#2563EB] text-white text-[13px] font-bold rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {importing ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Importing...</>
                    ) : (
                      <><Download className="w-4 h-4" /> Import {selectedEHR.size > 0 ? `(${selectedEHR.size})` : ''} Records</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
