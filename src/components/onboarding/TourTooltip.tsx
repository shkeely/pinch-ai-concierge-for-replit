import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourTooltipProps {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: ReactNode;
}

export function TourTooltip({
  title,
  description,
  step,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  position = 'bottom',
  children,
}: TourTooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block">
      {children}
      <Card
        className={`absolute ${positionClasses[position]} z-50 w-72 p-4 shadow-lg border-2 border-primary/20`}
      >
        {onSkip && (
          <button
            onClick={onSkip}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">
            Step {step} of {totalSteps}
          </div>
          <h4 className="font-serif font-semibold">{title}</h4>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex justify-between items-center">
          {onBack ? (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {onNext && (
            <Button size="sm" onClick={onNext}>
              Next
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
