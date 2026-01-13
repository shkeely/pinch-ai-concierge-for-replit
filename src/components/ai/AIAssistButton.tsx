import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIAssistButtonProps {
  id?: string;
  className?: string;
  currentText: string;
  onAIGenerate: (text: string) => void;
  context?: string;
}

export function AIAssistButton({ id, className, currentText, onAIGenerate, context }: AIAssistButtonProps) {
  const hasText = currentText.trim().length > 0;

  const handleGenerateDraft = () => {
    // Mock AI generation - replace with real AI call when Cloud is enabled
    const mockDraft = context
      ? `Hi everyone! ${context} We've made arrangements to ensure everyone has a great time. Looking forward to celebrating with you all!`
      : "Hi everyone! Thank you for your question. Let me provide you with the information you need. We're excited to celebrate with you!";
    onAIGenerate(mockDraft);
  };

  const handleRewrite = () => {
    // Mock AI rewrite
    const mockRewrite = currentText
      .replace(/Hi/g, "Hello")
      .replace(/!/g, ".")
      + " Please let us know if you have any other questions.";
    onAIGenerate(mockRewrite);
  };

  const handleImprove = () => {
    // Mock AI improve
    const improved = `${currentText}\n\nWe truly appreciate your understanding and can't wait to see you there! Feel free to reach out if you need anything else.`;
    onAIGenerate(improved);
  };

  const handleMakeFriendlier = () => {
    const friendly = currentText + " 😊 We're so excited to celebrate with you!";
    onAIGenerate(friendly);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id={id}
          variant="outline"
          size="sm"
          className={className}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!hasText && (
          <DropdownMenuItem onClick={handleGenerateDraft}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Draft
          </DropdownMenuItem>
        )}
        {hasText && (
          <>
            <DropdownMenuItem onClick={handleRewrite}>
              <Sparkles className="h-4 w-4 mr-2" />
              Rewrite
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImprove}>
              <Sparkles className="h-4 w-4 mr-2" />
              Improve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMakeFriendlier}>
              <Sparkles className="h-4 w-4 mr-2" />
              Make Friendlier
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
