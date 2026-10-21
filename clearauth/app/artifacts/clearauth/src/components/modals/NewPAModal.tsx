import { useState } from "react";
import { X, UploadCloud, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCase } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  patientName: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  diagnosis: z.string().min(1, "Required"),
  diagnosisCode: z.string().optional(),
  medication: z.string().min(1, "Required"),
  dosage: z.string().optional(),
  previousTreatments: z.string().optional(),
  clinicalJustification: z.string().optional(),
  prescribingPhysician: z.string().optional(),
  npi: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function NewPAModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const createCaseMutation = useCreateCase();
  const [files, setFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      prescribingPhysician: "Dr. Sarah Mitchell",
      npi: "1234567890"
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createCaseMutation.mutateAsync({ data });
      toast({
        title: "PA request submitted successfully!",
        description: `Case ID: ${res.id}`,
        className: "bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]"
      });
      reset();
      setFiles([]);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit",
        description: "An error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-foreground">New Prior Authorization Request</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Complete the form below to submit a new prior authorization request.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="new-pa-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Patient Name <span className="text-destructive">*</span></label>
                <input 
                  {...register("patientName")} 
                  className={cn("w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.patientName ? "border-destructive" : "border-border")}
                  placeholder="e.g. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Date of Birth <span className="text-destructive">*</span></label>
                <input 
                  type="date"
                  {...register("dateOfBirth")} 
                  className={cn("w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.dateOfBirth ? "border-destructive" : "border-border")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Diagnosis <span className="text-destructive">*</span></label>
                <input 
                  {...register("diagnosis")} 
                  className={cn("w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.diagnosis ? "border-destructive" : "border-border")}
                  placeholder="Rheumatoid Arthritis"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Diagnosis Code</label>
                <input 
                  {...register("diagnosisCode")} 
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                  placeholder="M06.9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Medication <span className="text-destructive">*</span></label>
                <input 
                  {...register("medication")} 
                  className={cn("w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.medication ? "border-destructive" : "border-border")}
                  placeholder="Humira (adalimumab)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Dosage</label>
                <input 
                  {...register("dosage")} 
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="40mg every other week"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Previous Treatments</label>
              <textarea 
                {...register("previousTreatments")} 
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="List previous treatments and outcomes..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Clinical Justification</label>
              <textarea 
                {...register("clinicalJustification")} 
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Explain why this medication is medically necessary..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Supporting Documents</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground">Drag files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Upload clinical notes, lab results, or other supporting documents</p>
                <input type="file" className="hidden" />
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg border">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{f.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prescribing Physician</label>
                <input 
                  {...register("prescribingPhysician")} 
                  readOnly
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/50 text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">NPI</label>
                <input 
                  {...register("npi")} 
                  readOnly
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/50 text-muted-foreground"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/20 flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="new-pa-form"
            disabled={createCaseMutation.isPending}
            className="px-5 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {createCaseMutation.isPending ? "Submitting..." : "Submit PA Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
