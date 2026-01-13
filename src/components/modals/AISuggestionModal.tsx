import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface AISuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  suggestion: string;
  onAccept: (suggestion: string) => void;
  onReject: () => void;
  onRegenerate?: () => Promise<string>;
}

export function AISuggestionModal({
  open,
  onOpenChange,
  question,
  suggestion,
  onAccept,
  onReject,
  onRegenerate,
}: AISuggestionModalProps) {
  const [currentSuggestion, setCurrentSuggestion] = useState(suggestion);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    
    setRegenerating(true);
    try {
      const newSuggestion = await onRegenerate();
      setCurrentSuggestion(newSuggestion);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Suggested Response
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Guest Question:</p>
            <p className="font-medium">{question}</p>
          </Card>

          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Suggested Reply:</span>
            </div>
            <p className="text-sm">{currentSuggestion}</p>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            {onRegenerate && (
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex-1"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReject}>
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => onAccept(currentSuggestion)}>
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
