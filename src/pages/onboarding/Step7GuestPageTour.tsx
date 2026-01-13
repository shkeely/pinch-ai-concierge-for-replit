import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Users, Search, Tag, Upload } from 'lucide-react';

const features = [
  { 
    icon: Upload, 
    title: 'Import Guests', 
    description: 'Bulk import from CSV or add manually' 
  },
  { 
    icon: Tag, 
    title: 'Segments', 
    description: 'Organize guests into groups' 
  },
  { 
    icon: Search, 
    title: 'Search & Filter', 
    description: 'Quickly find any guest' 
  },
];

export default function Step7GuestPageTour() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleContinue = async () => {
    await updateWedding({ onboardingStep: 8 });
    navigate('/onboarding/step-8');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Guest Management</h1>
          <p className="text-muted-foreground">
            Keep track of all your guests in one place
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 bg-mint/30 rounded-full flex items-center justify-center flex-shrink-0">
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
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}