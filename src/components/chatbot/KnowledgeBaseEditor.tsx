import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  source?: 'manual' | 'scraped';
}

interface KnowledgeBaseEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBaseName: string;
  knowledgeBaseId: string;
}

export function KnowledgeBaseEditor({
  open,
  onOpenChange,
  knowledgeBaseName,
  knowledgeBaseId
}: KnowledgeBaseEditorProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      question: 'What time does the ceremony start?',
      answer: 'The ceremony begins at 4:30 PM on Saturday, June 15th.',
      source: 'manual'
    },
    {
      id: '2',
      question: 'Where is the venue located?',
      answer: 'The wedding will take place at The Grove Estate, 123 Garden Lane, Austin, TX.',
      source: 'scraped'
    }
  ]);

  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to scrape",
        variant: "destructive",
      });
      return;
    }

    setIsScrapingLoading(true);

    setTimeout(() => {
      const scrapedItems: KnowledgeItem[] = [
        {
          id: Date.now().toString(),
          question: 'Is parking available?',
          answer: 'Yes, complimentary valet parking is available at the venue entrance.',
          source: 'scraped'
        },
        {
          id: (Date.now() + 1).toString(),
          question: 'What is the dress code?',
          answer: 'The dress code is formal attire. We recommend cocktail dresses or suits.',
          source: 'scraped'
        }
      ];

      setItems(prev => [...prev, ...scrapedItems]);
      setScrapeUrl('');
      setIsScrapingLoading(false);

      toast({
        title: "Success",
        description: `Added ${scrapedItems.length} items from website`,
      });
    }, 2000);
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setEditQuestion(item.question);
    setEditAnswer(item.answer);
  };

  const handleSaveEdit = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast({
        title: "Invalid Input",
        description: "Both question and answer are required",
        variant: "destructive",
      });
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === editingId
          ? { ...item, question: editQuestion, answer: editAnswer }
          : item
      )
    );

    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');

    toast({
      title: "Saved",
      description: "Item updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: "Item removed successfully",
    });
  };

  const handleAddNew = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast({
        title: "Invalid Input",
        description: "Both question and answer are required",
        variant: "destructive",
      });
      return;
    }

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      source: 'manual'
    };

    setItems(prev => [...prev, newItem]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddNew(false);

    toast({
      title: "Added",
      description: "New item added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Edit {knowledgeBaseName}
          </DialogTitle>
          <DialogDescription>
            Scrape website content or manually add question-answer pairs
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Web Scraper Section */}
          <Card className="p-4 bg-muted/30" data-tour-id="web-scraper">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Auto-Import from Website</h3>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="https://your-wedding-website.com"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                disabled={isScrapingLoading}
                className="flex-1"
              />
              <Button
                onClick={handleScrape}
                disabled={isScrapingLoading}
              >
                {isScrapingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Scrape
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Extract FAQs and information automatically from your website
            </p>
          </Card>

          <Separator />

          {/* Items List */}
          <div data-tour-id="knowledge-items">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Knowledge Items ({items.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddNew(!showAddNew)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </Button>
            </div>

            {/* Add New Item Form */}
            {showAddNew && (
              <Card className="p-4 mb-4 border-2 border-dashed">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Question
                    </label>
                    <Input
                      placeholder="e.g., What time does the ceremony start?"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Answer
                    </label>
                    <Textarea
                      placeholder="Provide a clear and helpful answer..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNew} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddNew(false);
                        setNewQuestion('');
                        setNewAnswer('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Items List */}
            <div className="space-y-2">
              {items.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No items yet. Add items manually or scrape from a website.
                  </p>
                </Card>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {editingId === item.id ? (
                      <div className="p-4 space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Question
                          </label>
                          <Input
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Answer
                          </label>
                          <Textarea
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                            <Check className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => toggleExpand(item.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium line-clamp-1">
                                  {item.question}
                                </p>
                                {item.source && (
                                  <Badge
                                    variant={item.source === 'scraped' ? 'secondary' : 'outline'}
                                    className="text-xs flex-shrink-0"
                                  >
                                    {item.source === 'scraped' ? 'Scraped' : 'Manual'}
                                  </Badge>
                                )}
                              </div>
                              {!expandedItems.has(item.id) && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.answer}
                                </p>
                              )}
                            </div>
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        {expandedItems.has(item.id) && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="bg-muted/30 rounded-lg p-3">
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {item.answer}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit2 className="w-3 h-3 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
