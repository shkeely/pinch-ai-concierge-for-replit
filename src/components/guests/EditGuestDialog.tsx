import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Segment = 'All' | string;

interface Guest {
  id: string;
  name: string;
  phone: string;
  segments: string[];
  status: string;
}

interface EditGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  segments: Segment[];
  onSave: (guest: Guest) => void;
}

export default function EditGuestDialog({ open, onOpenChange, guest, segments, onSave }: EditGuestDialogProps) {
  const [formData, setFormData] = useState<Guest | null>(null);

  useEffect(() => {
    if (guest) {
      setFormData({ ...guest });
    }
  }, [guest]);

  const handleSave = () => {
    if (!formData) return;
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  const handleSegmentToggle = (segment: string, checked: boolean) => {
    if (!formData) return;
    const newSegments = checked
      ? [...formData.segments, segment]
      : formData.segments.filter(s => s !== segment);
    setFormData({ ...formData, segments: newSegments });
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Segments</Label>
            <div className="grid grid-cols-2 gap-2">
              {segments.filter(s => s !== 'All').map((segment) => (
                <div key={segment} className="flex items-center gap-2">
                  <Checkbox id={segment} checked={formData.segments.includes(segment)} onCheckedChange={(checked) => handleSegmentToggle(segment, checked as boolean)} />
                  <Label htmlFor={segment} className="text-sm">{segment}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
