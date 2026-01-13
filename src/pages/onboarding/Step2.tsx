import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Sparkles, Heart, Briefcase } from 'lucide-react';
import { Tone } from '@/types/wedding';

const tones: { value: Tone; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'warm',
    label: 'Warm & Friendly',
    description: 'Casual and approachable, like chatting with a friend',
    icon: <Heart className="w-6 h-6" />
  },
  {
    value: 'formal',
    label: 'Formal & Elegant',
    description: 'Professional and polished for a sophisticated feel',
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    value: 'fun',
    label: 'Fun & Playful',
    description: 'Energetic and celebratory with a touch of humor',
    icon: <Sparkles className="w-6 h-6" />
  }
];

export default function Step2() {
  const navigate = useNavigate();
  const { wedding, updateWedding } = useWedding();
  const [selected, setSelected] = useState<Tone>(wedding?.chatbotSettings?.tone || 'warm');

  const handleContinue = async () => {
    await updateWedding({
      chatbotSettings: {
        ...wedding?.chatbotSettings,
        name: wedding?.chatbotSettings?.name || 'Concierge',
        tone: selected,
        unknownAnswer: wedding?.chatbotSettings?.unknownAnswer || 'escalate',
        notifications: wedding?.chatbotSettings?.notifications || 'daily'
      },
      onboardingStep: 3
    });
    navigate('/onboarding/step-3');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Choose your tone</h1>
          <p className="text-muted-foreground">
            How should your concierge communicate with guests?
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {tones.map((tone) => (
            <Card
              key={tone.value}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                selected === tone.value ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelected(tone.value)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                  {tone.icon}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-1">{tone.label}</h3>
                  <p className="text-sm text-muted-foreground">{tone.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/step-1a')}
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