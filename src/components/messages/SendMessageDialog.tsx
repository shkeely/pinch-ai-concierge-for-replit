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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments?: { id: string; name: string }[];
  onSend?: (message: string, segmentId?: string) => Promise<void>;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  segments = [],
  onSend,
}: SendMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      if (onSend) {
        await onSend(message, selectedSegment === 'all' ? undefined : selectedSegment);
      }
      toast.success('Message sent successfully');
      setMessage('');
      setSelectedSegment('all');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="segment">Send to</Label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    All Guests
                  </div>
                </SelectItem>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/160 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !message.trim()}>
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
