import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, User, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import { SimulatedMessage } from '@/types/wedding';

interface ConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: SimulatedMessage[];
  onEscalate?: (conversation: SimulatedMessage) => void;
  onResolve?: (conversation: SimulatedMessage) => void;
}

export function ConversationModal({
  open,
  onOpenChange,
  conversations,
  onEscalate,
  onResolve,
}: ConversationModalProps) {
  const getConfidenceBadgeVariant = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Conversations
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Guest messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Guest</span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <Badge variant={getConfidenceBadgeVariant(conversation.confidence)}>
                      {conversation.confidence} confidence
                    </Badge>
                  </div>

                  {/* Guest message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-muted rounded-lg p-3">
                      <p className="text-sm">{conversation.guestMessage}</p>
                    </div>
                  </div>

                  {/* AI response */}
                  {conversation.botResponse && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 bg-primary/5 rounded-lg p-3">
                        <p className="text-sm">{conversation.botResponse}</p>
                        {conversation.source && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Source: {conversation.source}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    {onEscalate && conversation.confidence === 'low' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEscalate(conversation)}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Escalate
                      </Button>
                    )}
                    {onResolve && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResolve(conversation)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
