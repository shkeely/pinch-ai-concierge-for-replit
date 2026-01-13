import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
import TopNav from '@/components/navigation/TopNav';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar, Users, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ConversationModal } from '@/components/homepage/ConversationModal';
import { EscalatedQuestionModal } from '@/components/modals/EscalatedQuestionModal';
import { AISuggestionModal } from '@/components/modals/AISuggestionModal';
import { useWedding } from '@/contexts/WeddingContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Homepage() {
  const navigate = useNavigate();
  const { wedding, weddingId, loading: weddingLoading } = useWedding();
  const { user } = useAuth();

  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [escalatedModalOpen, setEscalatedModalOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [handledExpanded, setHandledExpanded] = useState(false);
  const [attentionExpanded, setAttentionExpanded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showEndSection, setShowEndSection] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  // Get user's name from wedding or email
  const userName = wedding?.couple1 || user?.email?.split('@')[0] || 'there';

  // TODO: These should come from real API endpoints when available
  // For now, show empty state since we don't have mock data for main app
  const needsAttention: any[] = [];
  const handledToday: any[] = [];
  const conversations: any[] = [];

  const hasUrgent = needsAttention.some(item => item.urgent);

  // Redirect to onboarding if no wedding exists
  useEffect(() => {
    if (!weddingLoading && !weddingId && user) {
      navigate('/onboarding/step-1a');
    }
  }, [weddingLoading, weddingId, user, navigate]);

  // Stable callback for AnimatedGreeting
  const handleGreetingComplete = useCallback(() => {
    setGreetingDone(true);
  }, []);

  // Skip animation callback
  const handleSkip = useCallback(() => {
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    setSkipClicked(true);
    setGreetingDone(true);
  }, []);

  // One-time button reveal sequence after greeting completes
  useEffect(() => {
    if (!greetingDone) return;

    setShowButtons(true);

    const ids: number[] = [];

    if (skipClicked) {
      setVisibleButtons(3);
      ids.push(window.setTimeout(() => setShowEndSection(true), 300));
    } else {
      ids.push(window.setTimeout(() => setVisibleButtons(1), 150));
      ids.push(window.setTimeout(() => setVisibleButtons(2), 600));
      ids.push(window.setTimeout(() => setVisibleButtons(3), 1050));
      ids.push(window.setTimeout(() => setShowEndSection(true), 1400));
    }

    timeoutsRef.current = ids;

    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [greetingDone, skipClicked]);

  if (weddingLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Animated Greeting */}
        <AnimatedGreeting
          userName={userName}
          handledCount={handledToday.length}
          attentionCount={needsAttention.length}
          onComplete={handleGreetingComplete}
          onSkip={handleSkip}
        />

        {/* Updates Section - All Collapsible */}
        {showButtons && (
          <div className="space-y-4">
            {/* Needs Attention - Collapsible with urgent indicator */}
            {needsAttention.length > 0 && (
              <Collapsible
                open={attentionExpanded}
                onOpenChange={setAttentionExpanded}
                className={`transition-opacity transition-transform duration-500 ease-out transform-gpu will-change-[transform,opacity] ${visibleButtons >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <div className={`w-full border-2 border-destructive/50 hover:shadow-lg hover:border-destructive/70 ${attentionExpanded ? 'rounded-3xl bg-card transition-[background-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]' : 'rounded-full bg-background transition-[background-color,box-shadow,border-radius] duration-300 [transition-timing-function:cubic-bezier(0.7,0,0.84,0)] delay-200'}`}>
                  <CollapsibleTrigger asChild>
                    <button id="tour-btn-1" className="w-full p-6 text-center transition-all hover:border-destructive">
                      <div className="flex items-center justify-between">
                        <span className="flex-1 text-xl font-semibold text-foreground">
                          {needsAttention.length} things need your attention.
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          {hasUrgent && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
                          {attentionExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t border-border px-6 py-6 space-y-4 overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-timing-function:cubic-bezier(0.7,0,0.84,0)]">
                    {needsAttention.map(item => (
                      <div key={item.id} className={`relative rounded-2xl p-6 border-2 ${item.type === 'escalated' ? 'border-orange-200 bg-orange-50/15' : 'border-purple-200 bg-purple-50/15'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-background">
                              {item.type === 'escalated' ? 'Escalated' : 'Suggestion'}
                            </Badge>
                            {item.urgent && <span className="h-2 w-2 rounded-full bg-destructive" />}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.timestamp}
                          </span>
                        </div>
                        <h4 className="font-sans font-semibold text-foreground text-lg mb-2">
                          {item.title}
                        </h4>
                        <div className="flex flex-col md:flex-row md:items-center items-start gap-3 md:gap-4">
                          <p className="text-muted-foreground flex-1">
                            {item.description}
                          </p>
                          <Button
                            variant="outline"
                            className={`rounded-full shrink-0 w-full md:w-auto !justify-start ${item.type === 'escalated' ? 'border-orange-400 text-orange-700 hover:bg-orange-50' : 'border-purple-400 text-purple-700 hover:bg-purple-50'}`}
                            onClick={() => {
                              setSelectedItem(item);
                              if (item.type === 'escalated') {
                                setEscalatedModalOpen(true);
                              } else {
                                setSuggestionModalOpen(true);
                              }
                            }}
                          >
                            Review
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {/* Handled by Pinch - Collapsible */}
            <Collapsible
              open={handledExpanded}
              onOpenChange={setHandledExpanded}
              className={`transition-opacity transition-transform duration-500 ease-out transform-gpu will-change-[transform,opacity] ${visibleButtons >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
              <div className={`w-full border-2 border-border hover:shadow-lg hover:border-primary/30 ${handledExpanded ? 'rounded-3xl bg-card transition-[background-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]' : 'rounded-full bg-background transition-[background-color,box-shadow,border-radius] duration-300 [transition-timing-function:cubic-bezier(0.7,0,0.84,0)] delay-200'}`}>
                <CollapsibleTrigger asChild>
                  <button id="tour-btn-2" className="w-full p-6 text-center transition-all hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-xl font-semibold text-foreground">
                        {handledToday.length > 0
                          ? `Pinch answered ${handledToday.length} guest questions`
                          : 'No guest questions yet today'}
                      </span>
                      {handledExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground ml-2" /> : <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t border-border overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-timing-function:cubic-bezier(0.7,0,0.84,0)]">
                  {handledToday.length > 0 ? (
                    <>
                      <div className="px-6 py-4 flex items-center justify-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                          <Check className="w-3 h-3 mr-1" />
                          Handled by Pinch
                        </Badge>
                      </div>
                      <div className="divide-y divide-border pb-4">
                        {handledToday.slice(0, 3).map((item, index) => {
                          const fullConversation = conversations.find(
                            (conv) => conv.guestName === item.guestName
                          );
                          return (
                            <div
                              key={index}
                              className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:translate-x-1"
                              style={{ animationDelay: `${index * 50}ms` }}
                              onClick={() => fullConversation && setSelectedConversation(fullConversation)}
                            >
                              <div className="text-foreground">
                                <span className="font-semibold">{item.guestName}</span>
                                <span className="text-muted-foreground"> asked about {item.question}</span>
                              </div>
                              <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                                {item.timestamp}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-8 text-center text-muted-foreground">
                      <p>When guests message your concierge, their questions will appear here.</p>
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        )}

        {/* End Message */}
        {showEndSection && (
          <div className="text-center space-y-2 py-8 animate-in fade-in-0 duration-500">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              {needsAttention.length === 0 && handledToday.length === 0
                ? "You're all set!"
                : "That's all for today."}
            </h2>
            <p className="text-muted-foreground">
              {needsAttention.length === 0 && handledToday.length === 0
                ? "Share your concierge link with guests to get started."
                : "Want to change your notifications?"}
            </p>
            {needsAttention.length === 0 && handledToday.length === 0 && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/chatbot')}
              >
                Set Up Concierge
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        <ConversationModal
          open={!!selectedConversation}
          onOpenChange={(open) => !open && setSelectedConversation(null)}
          conversations={selectedConversation ? [selectedConversation] : []}
        />

        {selectedItem?.type === 'escalated' && (
          <EscalatedQuestionModal
            open={escalatedModalOpen}
            onOpenChange={(open) => {
              setEscalatedModalOpen(open);
              if (!open) setSelectedItem(null);
            }}
            question={selectedItem ? {
              id: selectedItem.id || '1',
              guestName: selectedItem.guestName || '',
              question: selectedItem.question || '',
              timestamp: selectedItem.timestamp || '',
              status: 'pending' as const,
            } : null}
            onReply={async (questionId, reply) => {
              console.log('Reply sent:', questionId, reply);
              setEscalatedModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}

        {selectedItem?.type === 'suggestion' && (
          <AISuggestionModal
            open={suggestionModalOpen}
            onOpenChange={(open) => {
              setSuggestionModalOpen(open);
              if (!open) setSelectedItem(null);
            }}
            question={selectedItem.title || ''}
            suggestion={selectedItem.recommendedAction || ''}
            onAccept={(suggestion) => {
              console.log('Suggestion accepted:', suggestion);
              setSuggestionModalOpen(false);
              setSelectedItem(null);
            }}
            onReject={() => {
              setSuggestionModalOpen(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
