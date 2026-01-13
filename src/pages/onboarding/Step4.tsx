import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, Bot, Bell } from 'lucide-react';
import { NotificationFrequency, UnknownAnswerBehavior } from '@/types/wedding';

export default function Step4() {
  const navigate = useNavigate();
  const { wedding, updateWedding } = useWedding();
  
  const [chatbotName, setChatbotName] = useState(wedding?.chatbotSettings?.name || 'Concierge');
  const [unknownAnswer, setUnknownAnswer] = useState<UnknownAnswerBehavior>(
    wedding?.chatbotSettings?.unknownAnswer || 'escalate'
  );
  const [notifications, setNotifications] = useState<NotificationFrequency>(
    wedding?.chatbotSettings?.notifications || 'daily'
  );

  const handleContinue = async () => {
    await updateWedding({
      chatbotSettings: {
        name: chatbotName,
        tone: wedding?.chatbotSettings?.tone || 'warm',
        unknownAnswer,
        notifications
      },
      onboardingStep: 5
    });
    navigate('/onboarding/step-5');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Chatbot Settings</h1>
          <p className="text-muted-foreground">
            Customize how your concierge behaves
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <Card className="p-6">
            <Label htmlFor="name" className="text-base font-medium">Concierge Name</Label>
            <p className="text-sm text-muted-foreground mb-3">
              What should your chatbot call itself?
            </p>
            <Input
              id="name"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder="e.g., Concierge, Emma, Wedding Bot"
            />
          </Card>

          <Card className="p-6">
            <Label className="text-base font-medium">Unknown Questions</Label>
            <p className="text-sm text-muted-foreground mb-3">
              What happens when the bot can't answer?
            </p>
            <RadioGroup 
              value={unknownAnswer} 
              onValueChange={(value) => setUnknownAnswer(value as UnknownAnswerBehavior)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="escalate" id="escalate" />
                <Label htmlFor="escalate" className="flex-1 cursor-pointer">
                  <span className="font-medium">Escalate to you</span>
                  <p className="text-xs text-muted-foreground">Get notified to respond personally</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="generic" id="generic" />
                <Label htmlFor="generic" className="flex-1 cursor-pointer">
                  <span className="font-medium">Generic response</span>
                  <p className="text-xs text-muted-foreground">Send a polite "I don't know" message</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website" className="flex-1 cursor-pointer">
                  <span className="font-medium">Redirect to website</span>
                  <p className="text-xs text-muted-foreground">Point guests to your wedding website</p>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4" />
              <Label className="text-base font-medium">Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              How often should we notify you?
            </p>
            <RadioGroup 
              value={notifications} 
              onValueChange={(value) => setNotifications(value as NotificationFrequency)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="realtime" id="realtime" />
                <Label htmlFor="realtime" className="cursor-pointer">Real-time</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">Daily digest</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">Weekly summary</Label>
              </div>
            </RadioGroup>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/step-3')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button className="flex-1" onClick={handleContinue}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}