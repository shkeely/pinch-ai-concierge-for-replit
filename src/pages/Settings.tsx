import { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Bell,
  Palette,
  MessageSquare,
  Shield,
  Save
} from 'lucide-react';

export default function Settings() {
  const { wedding, updateWedding } = useWedding();
  const [saving, setSaving] = useState(false);

  const [chatbotName, setChatbotName] = useState(wedding?.chatbotSettings?.name || 'Concierge');
  const [tone, setTone] = useState(wedding?.chatbotSettings?.tone || 'warm');
  const [unknownAnswer, setUnknownAnswer] = useState(wedding?.chatbotSettings?.unknownAnswer || 'escalate');
  const [notifications, setNotifications] = useState(wedding?.chatbotSettings?.notifications || 'daily');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWedding({
        chatbotSettings: {
          name: chatbotName,
          tone: tone as 'warm' | 'formal' | 'fun',
          unknownAnswer: unknownAnswer as 'escalate' | 'fallback',
          notifications: notifications as 'instant' | 'daily' | 'off'
        }
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your chatbot and notification preferences
          </p>
        </div>

        <Tabs defaultValue="chatbot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Chatbot Settings */}
          <TabsContent value="chatbot" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Chatbot Identity</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Concierge Name</Label>
                  <Input
                    id="name"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    placeholder="e.g., Concierge, Emma, Wedding Bot"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    The name your guests will see when chatting
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Response Tone</h2>
              <RadioGroup value={tone} onValueChange={setTone} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="warm" id="warm" />
                  <Label htmlFor="warm" className="flex-1 cursor-pointer">
                    <span className="font-medium">Warm & Friendly</span>
                    <p className="text-sm text-muted-foreground">
                      Casual, approachable responses with personality
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="formal" id="formal" />
                  <Label htmlFor="formal" className="flex-1 cursor-pointer">
                    <span className="font-medium">Formal & Professional</span>
                    <p className="text-sm text-muted-foreground">
                      Polished, elegant responses for a sophisticated feel
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="fun" id="fun" />
                  <Label htmlFor="fun" className="flex-1 cursor-pointer">
                    <span className="font-medium">Fun & Playful</span>
                    <p className="text-sm text-muted-foreground">
                      Energetic, celebratory responses with emojis
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Unknown Questions</h2>
              <RadioGroup value={unknownAnswer} onValueChange={setUnknownAnswer} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="escalate" id="escalate" />
                  <Label htmlFor="escalate" className="flex-1 cursor-pointer">
                    <span className="font-medium">Escalate to You</span>
                    <p className="text-sm text-muted-foreground">
                      Flag unknown questions for your personal response
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="fallback" id="fallback" />
                  <Label htmlFor="fallback" className="flex-1 cursor-pointer">
                    <span className="font-medium">Use Fallback Response</span>
                    <p className="text-sm text-muted-foreground">
                      Provide a polite generic response automatically
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Notification Frequency</h2>
              <RadioGroup value={notifications} onValueChange={setNotifications} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant" className="flex-1 cursor-pointer">
                    <span className="font-medium">Instant</span>
                    <p className="text-sm text-muted-foreground">
                      Get notified immediately for escalated questions
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="flex-1 cursor-pointer">
                    <span className="font-medium">Daily Digest</span>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary once per day
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="off" id="off" />
                  <Label htmlFor="off" className="flex-1 cursor-pointer">
                    <span className="font-medium">Off</span>
                    <p className="text-sm text-muted-foreground">
                      No notifications - check manually
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Notification Channels</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get text alerts for urgent items
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Theme</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}