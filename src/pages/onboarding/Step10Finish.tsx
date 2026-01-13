import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function Step10Finish() {
  const navigate = useNavigate();
  const { wedding, updateWedding } = useWedding();

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleFinish = async () => {
    await updateWedding({ 
      onboardingComplete: true,
      onboardingStep: 10
    });
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-4xl font-serif font-bold mb-4">You're all set!</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          {wedding?.couple1 && wedding?.couple2 
            ? `${wedding.couple1} & ${wedding.couple2}'s` 
            : 'Your'} wedding concierge is ready to help
        </p>

        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PartyPopper className="w-6 h-6 text-primary" />
            <span className="font-serif font-semibold text-lg">What's Next?</span>
          </div>
          <ul className="text-left space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Add your guests to start receiving questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Customize your FAQs in the Concierge Brain</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Share your concierge number with guests</span>
            </li>
          </ul>
        </Card>

        <Button size="lg" className="w-full" onClick={handleFinish}>
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}