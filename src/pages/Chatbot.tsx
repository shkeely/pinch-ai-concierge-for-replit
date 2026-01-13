import { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Brain, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function Chatbot() {
  const { wedding, updateWedding } = useWedding();
  const [faqs, setFaqs] = useState<FAQ[]>(wedding?.customFAQs || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [escalationKeywords, setEscalationKeywords] = useState<string[]>([
    'urgent', 'emergency', 'help', 'problem', 'issue'
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    const newFaq: FAQ = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      category: 'custom'
    };

    const updatedFaqs = [...faqs, newFaq];
    setFaqs(updatedFaqs);
    updateWedding({ customFAQs: updatedFaqs });
    setNewQuestion('');
    setNewAnswer('');
    toast.success('FAQ added successfully');
  };

  const handleDeleteFAQ = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    setFaqs(updatedFaqs);
    updateWedding({ customFAQs: updatedFaqs });
    toast.success('FAQ deleted');
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (escalationKeywords.includes(newKeyword.toLowerCase())) {
      toast.error('Keyword already exists');
      return;
    }
    setEscalationKeywords([...escalationKeywords, newKeyword.toLowerCase()]);
    setNewKeyword('');
    toast.success('Keyword added');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setEscalationKeywords(escalationKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Concierge Brain</h1>
          </div>
          <p className="text-muted-foreground">
            Customize how your AI concierge responds to guest questions
          </p>
        </div>

        <Tabs defaultValue="knowledge" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Behavior
            </TabsTrigger>
            <TabsTrigger value="escalation" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Escalation
            </TabsTrigger>
          </TabsList>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Add Custom FAQ</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="What question might guests ask?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="How should the concierge respond?"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddFAQ} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </Card>

            {/* Existing FAQs */}
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Custom FAQs ({faqs.length})</h2>
              {faqs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No custom FAQs yet. Add your first one above!
                </p>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{faq.question}</p>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Response Behavior</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-respond to common questions</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically answer FAQs without escalating
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Include wedding details in responses</p>
                    <p className="text-sm text-muted-foreground">
                      Reference venue, time, and other details when relevant
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Suggest follow-up questions</p>
                    <p className="text-sm text-muted-foreground">
                      Offer related questions after answering
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Escalation Tab */}
          <TabsContent value="escalation" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Escalation Keywords</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Messages containing these keywords will be flagged for your review
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {escalationKeywords.map((keyword) => (
                  <Badge 
                    key={keyword} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    {keyword}
                    <Trash2 className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-serif font-semibold mb-4">Escalation Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notify on escalation</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when messages need your attention
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-respond to escalated messages</p>
                    <p className="text-sm text-muted-foreground">
                      Send acknowledgment while you review
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
