import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  escalationAlerts: boolean;
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => Promise<void>;
}

export function NotificationPreferencesDialog({
  open,
  onOpenChange,
  preferences,
  onSave,
}: NotificationPreferencesDialogProps) {
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localPrefs);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={localPrefs.emailNotifications}
              onCheckedChange={(checked) =>
                setLocalPrefs((prev) => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via text
                </p>
              </div>
            </div>
            <Switch
              checked={localPrefs.smsNotifications}
              onCheckedChange={(checked) =>
                setLocalPrefs((prev) => ({ ...prev, smsNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <Label className="text-base">Escalation Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Immediate alerts for escalated questions
                </p>
              </div>
            </div>
            <Switch
              checked={localPrefs.escalationAlerts}
              onCheckedChange={(checked) =>
                setLocalPrefs((prev) => ({ ...prev, escalationAlerts: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Digest Frequency</Label>
            <Select
              value={localPrefs.digestFrequency}
              onValueChange={(value) =>
                setLocalPrefs((prev) => ({
                  ...prev,
                  digestFrequency: value as NotificationPreferences['digestFrequency'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How often to receive conversation summaries
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
