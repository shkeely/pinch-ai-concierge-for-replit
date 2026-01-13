import React, { useState, useEffect, useRef, useMemo } from "react";

interface AnimatedGreetingProps {
  userName: string;
  handledCount: number;
  attentionCount: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function AnimatedGreeting({ userName, handledCount, attentionCount, onComplete, onSkip }: AnimatedGreetingProps) {
  const [step, setStep] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const completedRef = useRef(false);

  const dynamicUpdates = useMemo(() => ([
    handledCount > 0 ? `${handledCount} ${handledCount === 1 ? 'person' : 'people'} asked Pinch questions.` : null,
    attentionCount > 0 ? `${attentionCount} ${attentionCount === 1 ? 'thing' : 'things'} need your attention.` : null,
  ].filter(Boolean) as string[]), [handledCount, attentionCount]);

  const messages = useMemo<(string | null)[]>(() => ([
    null,
    "Everything is running smoothly ✨",
    "Let's get into today's updates",
    ...dynamicUpdates,
    "Here are today's updates",
  ]), [dynamicUpdates]);

  const timings = useMemo<number[]>(() => {
    const baseDurations = [975, 1950, 1950];
    const dynamicDurations = Array(dynamicUpdates.length).fill(1950);
    return [...baseDurations, ...dynamicDurations, 1560];
  }, [dynamicUpdates]);

  useEffect(() => {
    if (!onComplete) return;
    if (skipped) return;
    const isLast = step === messages.length - 1;
    setSubtitleOpacity(1);
    if (isLast && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setSubtitleOpacity(0);
      setTimeout(() => setStep(s => s + 1), 300);
    }, timings[step] || 1500);
    return () => clearTimeout(timer);
  }, [step, messages.length, timings, onComplete, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    if (!completedRef.current) {
      completedRef.current = true;
      onSkip?.();
    }
  };

  const currentMessage = messages[step];

  return (
    <div className="text-center py-8 space-y-4">
      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
        Welcome back, {userName} 👋
      </h1>
      {currentMessage && (
        <p className="text-lg text-muted-foreground transition-opacity duration-300" style={{ opacity: subtitleOpacity }}>
          {currentMessage}
        </p>
      )}
      {!completedRef.current && onSkip && (
        <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground underline">
          Skip animation
        </button>
      )}
    </div>
  );
}
