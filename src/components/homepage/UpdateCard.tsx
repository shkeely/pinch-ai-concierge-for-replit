import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UpdateCardProps {
  type: 'handled' | 'attention';
  summary: string;
  details?: string[];
  urgent?: boolean;
  timestamp?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function UpdateCard({ type, summary, details, urgent = false, timestamp, actionLabel, onAction }: UpdateCardProps) {
  return (
    <Card className="transition-transform duration-200 hover:scale-[1.02] shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {urgent && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" aria-label="Urgent" />}
          <Badge
            variant={type === 'handled' ? 'secondary' : 'default'}
            className={type === 'handled' ? 'bg-mint/20 text-mint-foreground hover:bg-mint/30 border-mint/30' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 border-amber-500/30'}
          >
            {type === 'handled' ? 'Handled by Pinch' : 'Needs Your Attention'}
          </Badge>
        </div>
        <p className="text-lg font-semibold text-foreground leading-snug">{summary}</p>
        {details && details.length > 0 && (
          <ul className="space-y-1">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
        {timestamp && <p className="text-xs text-muted-foreground">{timestamp}</p>}
      </CardContent>
      {actionLabel && onAction && (
        <CardFooter className="px-6 pb-6 pt-0">
          <Button variant="outline" className="w-full" onClick={onAction}>{actionLabel}</Button>
        </CardFooter>
      )}
    </Card>
  );
}
