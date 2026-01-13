import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareChatbotDialog({ open, onOpenChange }: ShareChatbotDialogProps) {
  const [copied, setCopied] = useState(false);
  const chatbotUrl = `${window.location.origin}/landing`;

  const handleCopy = () => {
    navigator.clipboard.writeText(chatbotUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(chatbotUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your AI Concierge</DialogTitle>
          <DialogDescription>
            Share this link with your guests so they can ask questions about your wedding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="chatbot-url">Concierge Link</Label>
            <div className="flex gap-2">
              <Input
                id="chatbot-url"
                value={chatbotUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenLink}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tips for sharing:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include the link in your wedding invitations</li>
              <li>• Add it to your wedding website</li>
              <li>• Share via email or group chat</li>
              <li>• Create a QR code for physical invites</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
