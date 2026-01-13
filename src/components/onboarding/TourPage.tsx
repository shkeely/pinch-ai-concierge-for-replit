import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface TourPageProps {
  title: string;
  description: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
}

export function TourPage({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  backLabel = 'Back',
  showBack = true,
  showNext = true,
}: TourPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-serif font-bold tracking-wide">PINCH.</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-3">{title}</h2>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>

          <div className="mb-8">{children}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {showBack && onBack ? (
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLabel}
              </Button>
            ) : (
              <div />
            )}

            {showNext && onNext && (
              <Button onClick={onNext}>
                {nextLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
