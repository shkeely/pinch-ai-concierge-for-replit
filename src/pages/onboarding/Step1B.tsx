import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Step1B() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter your wedding website URL');
      return;
    }

    setLoading(true);
    
    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await updateWedding({ 
      websiteUrl,
      onboardingStep: 2
    });
    
    toast.success('Website scanned successfully!');
    setLoading(false);
    navigate('/onboarding/step-2');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Import from website</h1>
          <p className="text-muted-foreground">
            Enter your wedding website URL and we'll extract the details
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Wedding Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://yourwedding.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We support most wedding website platforms including The Knot, Zola, WeddingWire, and custom sites
            </p>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/step-1a')}
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleScan}
            disabled={loading || !websiteUrl.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Scan Website
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}