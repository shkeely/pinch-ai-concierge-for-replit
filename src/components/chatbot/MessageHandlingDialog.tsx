import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { useState } from "react";
import { useWedding } from "@/contexts/WeddingContext";
import { toast } from "sonner";

interface MessageHandlingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PartnerNotification {
  enabled: boolean;
  email: boolean;
  sms: boolean;
}

export function MessageHandlingDialog({ open, onOpenChange }: MessageHandlingDialogProps) {
  const { wedding } = useWedding();

  const partners = wedding.partners?.length > 0
    ? wedding.partners
    : [
        { id: '1', name: wedding.couple1 },
        { id: '2', name: wedding.couple2 }
      ].filter(p => p.name);

  const [partnerPreferences, setPartnerPreferences] = useState<Record<string, PartnerNotification>>(() => {
    const initial: Record<string, PartnerNotification> = {};
    partners.forEach(p => {
      initial[p.id] = { enabled: true, email: true, sms: false };
    });
    return initial;
  });

  const updatePartnerPref = (partnerId: string, field: keyof PartnerNotification, value: boolean) => {
    setPartnerPreferences(prev => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    toast.success('Message handling preferences updated');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message Handling Settings</DialogTitle>
          <DialogDescription>
            Configure how escalated messages are handled and who gets notified
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Partner Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Choose who receives notifications for escalated messages
            </p>

            {partners.map((partner) => (
              <div key={partner.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{partner.name}</span>
                  <Checkbox
                    checked={partnerPreferences[partner.id]?.enabled ?? true}
                    onCheckedChange={(checked) => 
                      updatePartnerPref(partner.id, 'enabled', checked as boolean)
                    }
                  />
                </div>

                {partnerPreferences[partner.id]?.enabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-muted">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${partner.id}-email`}
                        checked={partnerPreferences[partner.id]?.email ?? true}
                        onCheckedChange={(checked) => 
                          updatePartnerPref(partner.id, 'email', checked as boolean)
                        }
                      />
                      <Label htmlFor={`${partner.id}-email`} className="text-sm">
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${partner.id}-sms`}
                        checked={partnerPreferences[partner.id]?.sms ?? false}
                        onCheckedChange={(checked) => 
                          updatePartnerPref(partner.id, 'sms', checked as boolean)
                        }
                      />
                      <Label htmlFor={`${partner.id}-sms`} className="text-sm">
                        SMS notifications
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
