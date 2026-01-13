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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Sparkles, Edit3 } from 'lucide-react';

interface ReplyComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalMessage: string;
  guestName: string;
  aiSuggestion?: string;
  onSend: (reply: string) => Promise<void>;
}

export function ReplyComposerModal({
  open,
  onOpenChange,
  originalMessage,
  guestName,
  aiSuggestion,
  onSend,
}: ReplyComposerModalProps) {
  const [reply, setReply] = useState(aiSuggestion || '');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'custom'>(aiSuggestion ? 'ai' : 'custom');

  const handleSend = async () => {
    if (!reply.trim()) return;

    setSending(true);
    try {
      await onSend(reply);
      setReply('');
      onOpenChange(false);
    } finally {
      setSending(false);
    }
  };

  const handleUseAISuggestion = () => {
    if (aiSuggestion) {
      setReply(aiSuggestion);
      setActiveTab('custom');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Reply to {guestName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Original message:</p>
            <p className="text-sm">{originalMessage}</p>
          </Card>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ai' | 'custom')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" disabled={!aiSuggestion}>
                <Sparkles className="w-3 h-3 mr-1" />
                AI Suggestion
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Edit3 className="w-3 h-3 mr-1" />
                Custom Reply
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="mt-4">
              {aiSuggestion && (
                <div className="space-y-3">
                  <Card className="p-4 border-primary/20 bg-primary/5">
                    <p className="text-sm">{aiSuggestion}</p>
                  </Card>
                  <Button onClick={handleUseAISuggestion} className="w-full">
                    Use This & Edit
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <Textarea
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !reply.trim()}>
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
