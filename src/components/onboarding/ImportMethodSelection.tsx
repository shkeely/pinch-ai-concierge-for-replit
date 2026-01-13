import { Globe, PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImportMethodSelectionProps {
  selectedMethod: 'website' | 'manual' | null;
  onSelect: (method: 'website' | 'manual') => void;
}

export function ImportMethodSelection({ selectedMethod, onSelect }: ImportMethodSelectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card
        className={cn("p-8 cursor-pointer transition-all border-2 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]",
          selectedMethod === 'website' ? "border-accent" : "hover:border-foreground/10"
        )}
        onClick={() => onSelect('website')}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all text-foreground" style={{ backgroundColor: '#F7F5F3' }}>
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Website Scan</h3>
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium mb-3" style={{ backgroundColor: '#c8deb9', color: '#2E2B27' }}>Recommended</span>
            <p className="text-muted-foreground text-sm">Automatically import wedding details from your existing wedding website.</p>
          </div>
        </div>
      </Card>
      <Card
        className={cn("p-8 cursor-pointer transition-all border-2 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]",
          selectedMethod === 'manual' ? "border-accent" : "hover:border-foreground/10"
        )}
        onClick={() => onSelect('manual')}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all text-foreground" style={{ backgroundColor: '#F7F5F3' }}>
            <PenLine className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Manual Entry</h3>
            <p className="text-muted-foreground text-sm">Enter your wedding details manually step by step.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
