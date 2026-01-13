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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Send, User, Clock } from 'lucide-react';

interface EscalatedQuestion {
  id: string;
  guestName: string;
  question: string;
  timestamp: string;
  status: 'pending' | 'replied';
}

interface EscalatedQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: EscalatedQuestion | null;
  onReply: (questionId: string, reply: string) => Promise<void>;
}

export function EscalatedQuestionModal({
  open,
  onOpenChange,
  question,
  onReply,
}: EscalatedQuestionModalProps) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!question || !reply.trim()) return;

    setSending(true);
    try {
      await onReply(question.id, reply);
      setReply('');
      onOpenChange(false);
    } finally {
      setSending(false);
    }
  };

  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Escalated Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{question.guestName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              {question.timestamp}
            </div>
          </div>

          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <Badge variant="destructive" className="mb-2">
              Needs Your Response
            </Badge>
            <p className="text-sm">{question.question}</p>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Reply</label>
            <Textarea
              placeholder="Type your response..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendReply} disabled={sending || !reply.trim()}>
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
