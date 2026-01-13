import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, Star, Send } from 'lucide-react';
import { toast } from 'sonner';

interface GiveFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (feedback: { rating: number; category: string; message: string }) => Promise<void>;
}

export function GiveFeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
}: GiveFeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ rating, category, message });
      }
      toast.success('Thank you for your feedback!');
      setRating(0);
      setCategory('general');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Give Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>How would you rate your experience?</Label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>What is your feedback about?</Label>
            <RadioGroup value={category} onValueChange={setCategory}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="font-normal cursor-pointer">
                  General feedback
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature" id="feature" />
                <Label htmlFor="feature" className="font-normal cursor-pointer">
                  Feature request
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug" className="font-normal cursor-pointer">
                  Report a bug
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your feedback</Label>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what you think..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
