import React from "react";

interface StatsCardProps {
  total?: number;
  autoPercent?: number;
}

export default function StatsCard({ total = 47, autoPercent = 37 }: StatsCardProps) {
  return (
    <section
      aria-label="Statistics"
      className="antialiased"
    >
      {/* Stats Layout - Vertical on mobile/tablet, Horizontal on desktop */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10 py-[10px]">
        {/* Total Questions */}
        <div className="flex items-baseline gap-2.5">
          <div className="text-3xl lg:text-4xl font-semibold text-foreground">{total}</div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">total questions</p>
        </div>

        {/* Divider - Hidden on mobile/tablet */}
        <div className="hidden lg:block h-10 w-px bg-border" />

        {/* Auto-Answered */}
        <div className="flex items-baseline gap-2.5">
          <div className="text-3xl lg:text-4xl font-semibold text-foreground">{autoPercent}%</div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">auto-answered</p>
        </div>
      </div>
    </section>
  );
}
