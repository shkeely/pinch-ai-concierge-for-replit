import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Brain, MessageSquare, Lightbulb, AlertTriangle } from 'lucide-react';

const features = [
  { 
    icon: MessageSquare, 
    title: 'Custom FAQs', 
    description: 'Add questions and answers specific to your wedding' 
  },
  { 
    icon: Lightbulb, 
    title: 'Smart Responses', 
    description: 'AI generates natural responses based on your info' 
  },
  { 
    icon: AlertTriangle, 
    title: 'Escalation Rules', 
    description: 'Control when questions get sent to you' 
  },
];

export default function Step6ChatbotSetup() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleContinue = async () => {
    await updateWedding({ onboardingStep: 7 });
    navigate('/onboarding/step-7');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Concierge Brain</h1>
          <p className="text-muted-foreground">
            Your AI concierge learns from the information you provide
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
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

        <p className="text-sm text-muted-foreground text-center mb-6">
          You can access the Concierge Brain anytime from the main menu
        </p>

        <Button className="w-full" size="lg" onClick={handleContinue}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}