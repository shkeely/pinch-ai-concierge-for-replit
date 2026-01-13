import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface Guest { id: number; name: string; phone: string; segments: string[]; status: string; }

interface ImportGuestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (guests: Omit<Guest, 'id'>[]) => void;
}

export default function ImportGuestsDialog({ open, onOpenChange, onImport }: ImportGuestsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }
    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImport = () => {
    if (!selectedFile) { toast.error("Please select a file first"); return; }
    const mockGuests = [
      { name: "Imported Guest 1", phone: "+1 555-0101", segments: ["All"], status: "pending" },
      { name: "Imported Guest 2", phone: "+1 555-0102", segments: ["All"], status: "pending" },
    ];
    onImport(mockGuests);
    toast.success(`Imported ${mockGuests.length} guests`);
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Import Guests</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-primary" />
                <span className="font-medium">{selectedFile.name}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}><X className="w-4 h-4" /></Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop your file here, or</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!selectedFile}>Import Guests</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
