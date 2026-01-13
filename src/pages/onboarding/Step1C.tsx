import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Step1C() {
  const navigate = useNavigate();
  const { wedding, updateWedding, createWedding } = useWedding();
  
  const [couple1, setCouple1] = useState(wedding?.couple1 || '');
  const [couple2, setCouple2] = useState(wedding?.couple2 || '');
  const [date, setDate] = useState(wedding?.date || '');
  const [time, setTime] = useState(wedding?.time || '');
  const [venue, setVenue] = useState(wedding?.venue || '');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!couple1.trim()) {
      toast.error('Please enter at least one name');
      return;
    }

    setLoading(true);
    
    try {
      if (!wedding?.id) {
        await createWedding({
          couple1,
          couple2,
          date,
          time,
          venue,
          onboardingStep: 2
        });
      } else {
        await updateWedding({
          couple1,
          couple2,
          date,
          time,
          venue,
          onboardingStep: 2
        });
      }
      
      navigate('/onboarding/step-2');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Wedding Details</h1>
          <p className="text-muted-foreground">
            Tell us about your special day
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="couple1">Partner 1 Name</Label>
                <Input
                  id="couple1"
                  placeholder="First name"
                  value={couple1}
                  onChange={(e) => setCouple1(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="couple2">Partner 2 Name</Label>
                <Input
                  id="couple2"
                  placeholder="First name"
                  value={couple2}
                  onChange={(e) => setCouple2(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="venue" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Venue
              </Label>
              <Input
                id="venue"
                placeholder="Venue name"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/step-1a')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleContinue}
            disabled={loading || !couple1.trim()}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}