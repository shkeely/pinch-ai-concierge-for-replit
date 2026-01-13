import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp, ThumbsDown, Smile, Briefcase, Heart, Sparkles, Check, X, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AIAssistButton } from "@/components/ai/AIAssistButton";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContent: string;
  onApplyChanges?: (newContent: string, tone?: string) => void;
}

export function FeedbackDialog({ open, onOpenChange, messageContent, onApplyChanges }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [rewriteRequest, setRewriteRequest] = useState(messageContent);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const tones = [
    { id: 'warm', name: 'More Warm', icon: Heart },
    { id: 'formal', name: 'More Formal', icon: Briefcase },
    { id: 'fun', name: 'More Fun', icon: Smile },
    { id: 'less-warm', name: 'Less Warm', icon: Heart },
    { id: 'less-formal', name: 'Less Formal', icon: Briefcase },
    { id: 'less-fun', name: 'Less Fun', icon: Smile }
  ];

  const handleRewrite = () => {
    if (!rewriteRequest.trim() && !selectedTone) {
      toast.error("Please select a tone or describe changes");
      return;
    }

    const rewrittenContent = `${rewriteRequest} (Rewritten with ${selectedTone || 'custom changes'})`;
    onApplyChanges?.(rewrittenContent, selectedTone);
    toast.success("Message rewritten successfully");
    onOpenChange(false);
  };

  const generateRecommendations = () => {
    const generatedRecs = [
      `Update tone guidelines based on ${feedbackType} feedback`,
      `Add FAQ entry: "${messageContent.substring(0, 50)}..." with improved response`,
      `Refine response patterns for similar queries`
    ];

    setRecommendations(generatedRecs);
    setShowRecommendations(true);
  };

  const handleApproveAll = () => {
    toast.success("Concierge Brain updated successfully!");
    handleReset();
    onOpenChange(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(recommendations[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...recommendations];
      updated[editingIndex] = editText;
      setRecommendations(updated);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const handleRemove = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFeedbackType(null);
    setFeedbackText('');
    setSelectedTone('');
    setRewriteRequest(messageContent);
    setShowRecommendations(false);
    setRecommendations([]);
    setEditingIndex(null);
    setEditText('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim() && !feedbackType) {
      toast.error("Please provide feedback");
      return;
    }

    generateRecommendations();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Provide Feedback on AI Response
          </DialogTitle>
          <DialogDescription>
            Help improve AI responses by sharing what you liked or didn't like
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!showRecommendations ? (
            <>
              {/* Original Message */}
              <div className="bg-muted/50 rounded-lg p-4">
                <Label className="text-sm font-medium text-muted-foreground">AI Response</Label>
                <p className="text-sm mt-2 leading-relaxed">{messageContent}</p>
              </div>

              {/* Like/Dislike */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex gap-3">
                  <Button
                    variant={feedbackType === 'like' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setFeedbackType('like')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant={feedbackType === 'dislike' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setFeedbackType('dislike')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Dislike
                  </Button>
                </div>
              </div>

              {/* Tone Adjustment */}
              <div className="space-y-2">
                <Label>Adjust Tone (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map(tone => {
                    const Icon = tone.icon;
                    return (
                      <Button
                        key={tone.id}
                        variant={selectedTone === tone.id ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setSelectedTone(tone.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tone.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Rewrite Request with AI Assist */}
              <div className="space-y-2">
                <Label htmlFor="rewrite">Request Rewrite (Optional)</Label>
                <div className="flex items-start gap-2">
                  <Textarea
                    id="rewrite"
                    value={rewriteRequest}
                    onChange={(e) => setRewriteRequest(e.target.value)}
                    placeholder="Edit the message or describe changes..."
                    className="min-h-[80px] flex-1"
                  />
                  <AIAssistButton
                    currentText={rewriteRequest}
                    onAIGenerate={setRewriteRequest}
                    context={`Original message: "${messageContent}". User wants to rewrite this message.`}
                  />
                </div>
                {(rewriteRequest.trim() !== messageContent || selectedTone) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleRewrite}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Apply Rewrite
                  </Button>
                )}
              </div>

              {/* General Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Additional Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share specific callouts, what you liked or didn't like..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Recommended Concierge Brain Changes</h3>
              </div>

              {recommendations.map((rec, idx) => (
                <Card key={idx} className="p-4">
                  {editingIndex === idx ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm flex-1">{rec}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(idx)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(idx)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {recommendations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All recommendations removed. Submit feedback to generate new ones.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            handleReset();
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          {!showRecommendations ? (
            <Button onClick={handleSubmitFeedback} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          ) : (
            <Button
              onClick={handleApproveAll}
              disabled={recommendations.length === 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve & Update
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
