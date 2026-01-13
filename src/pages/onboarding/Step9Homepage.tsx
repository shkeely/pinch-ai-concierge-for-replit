import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Home, Activity, Sparkles, Clock } from 'lucide-react';

const features = [
  { 
    icon: Activity, 
    title: 'Activity Feed', 
    description: 'See recent guest interactions at a glance' 
  },
  { 
    icon: Sparkles, 
    title: 'AI Summary', 
    description: 'Daily highlights of what your concierge handled' 
  },
  { 
    icon: Clock, 
    title: 'Countdown', 
    description: 'Days until your big day' 
  },
];

export default function Step9Homepage() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleContinue = async () => {
    await updateWedding({ onboardingStep: 10 });
    navigate('/onboarding/step-10');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Your Homepage</h1>
          <p className="text-muted-foreground">
            Your command center for everything wedding
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 bg-sage/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button className="w-full" size="lg" onClick={handleContinue}>
          Almost done!
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}