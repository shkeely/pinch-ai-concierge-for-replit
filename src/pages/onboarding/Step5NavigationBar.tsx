import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Navigation, Home, Users, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Homepage', description: 'Your dashboard overview' },
  { icon: Users, label: 'Guests', description: 'Manage your guest list' },
  { icon: MessageSquare, label: 'Messages', description: 'View conversations' },
  { icon: Settings, label: 'Settings', description: 'Configure preferences' },
];

export default function Step5NavigationBar() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleContinue = async () => {
    await updateWedding({ onboardingStep: 6 });
    navigate('/onboarding/step-6');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Navigation Tour</h1>
          <p className="text-muted-foreground">
            Here's how to get around your dashboard
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <div 
                key={item.label}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button className="w-full" size="lg" onClick={handleContinue}>
          Got it, continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}