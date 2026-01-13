import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Plus, X, Users } from 'lucide-react';
import { toast } from 'sonner';

const defaultSegments = ['Family', 'Wedding Party', 'Friends', 'Coworkers'];

export default function Step3() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const [segments, setSegments] = useState<string[]>(defaultSegments);
  const [newSegment, setNewSegment] = useState('');

  const handleAddSegment = () => {
    if (!newSegment.trim()) return;
    if (segments.includes(newSegment.trim())) {
      toast.error('Segment already exists');
      return;
    }
    setSegments([...segments, newSegment.trim()]);
    setNewSegment('');
  };

  const handleRemoveSegment = (segment: string) => {
    setSegments(segments.filter(s => s !== segment));
  };

  const handleContinue = async () => {
    await updateWedding({ onboardingStep: 4 });
    navigate('/onboarding/step-4');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Guest Segments</h1>
          <p className="text-muted-foreground">
            Organize your guests into groups for personalized messaging
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="font-medium mb-4">Your Segments</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {segments.map((segment) => (
              <Badge 
                key={segment} 
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {segment}
                <button
                  onClick={() => handleRemoveSegment(segment)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a segment..."
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSegment()}
            />
            <Button onClick={handleAddSegment} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground text-center mb-6">
          You can add more segments and organize guests later
        </p>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/step-2')}
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