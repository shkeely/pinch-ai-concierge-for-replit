import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, FileText, ArrowRight } from 'lucide-react';

export default function Step1A() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'website' | 'manual' | null>(null);

  const handleContinue = () => {
    if (selected === 'website') {
      navigate('/onboarding/step-1b');
    } else if (selected === 'manual') {
      navigate('/onboarding/step-1c');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Let's set up your concierge</h1>
          <p className="text-muted-foreground">
            How would you like to import your wedding details?
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              selected === 'website' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelected('website')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg mb-1">Import from website</h3>
                <p className="text-sm text-muted-foreground">
                  We'll scan your wedding website and automatically fill in the details
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              selected === 'manual' ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelected('manual')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg mb-1">Enter manually</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in your wedding details step by step
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}