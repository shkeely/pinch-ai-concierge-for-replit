import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  FileText,
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import { KnowledgeBaseEditor } from './KnowledgeBaseEditor';
import { LucideIcon } from 'lucide-react';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  type: 'system' | 'custom';
  itemCount?: number;
}

interface KnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inTourMode?: boolean;
  onCategoryEdit?: () => void;
  currentTourStep?: string;
}

export function KnowledgeBaseDialog({ open, onOpenChange, inTourMode = false, onCategoryEdit, currentTourStep }: KnowledgeBaseDialogProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      name: 'Wedding Details',
      description: 'Venue, date, time, dress code, and ceremony information',
      icon: Calendar,
      active: true,
      type: 'system',
      itemCount: 12
    },
    {
      id: '2',
      name: 'Custom FAQs',
      description: 'Your personalized questions and answers',
      icon: MessageSquare,
      active: true,
      type: 'custom',
      itemCount: 8
    },
    {
      id: '3',
      name: 'Venue Information',
      description: 'Parking, accessibility, facilities, and directions',
      icon: MapPin,
      active: true,
      type: 'system',
      itemCount: 6
    },
    {
      id: '4',
      name: 'Guest Services',
      description: 'Accommodations, transportation, and local recommendations',
      icon: Users,
      active: false,
      type: 'system',
      itemCount: 10
    },
    {
      id: '5',
      name: 'Event Schedule',
      description: 'Timeline, activities, and special moments',
      icon: FileText,
      active: true,
      type: 'system',
      itemCount: 5
    }
  ]);

  const [showAddNew, setShowAddNew] = useState(false);
  const [newKBName, setNewKBName] = useState('');
  const [newKBDescription, setNewKBDescription] = useState('');
  const [editingKB, setEditingKB] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (currentTourStep === '7f' && editingKB) {
      setEditingKB(null);
    }
  }, [currentTourStep, editingKB]);

  const toggleKnowledgeBase = (id: string) => {
    setKnowledgeBases(prev =>
      prev.map(kb => kb.id === id ? { ...kb, active: !kb.active } : kb)
    );
  };

  const handleAddNew = () => {
    if (!newKBName.trim()) return;

    const newKB: KnowledgeBase = {
      id: Date.now().toString(),
      name: newKBName,
      description: newKBDescription,
      icon: FileText,
      active: true,
      type: 'custom',
      itemCount: 0
    };

    setKnowledgeBases(prev => [...prev, newKB]);
    setNewKBName('');
    setNewKBDescription('');
    setShowAddNew(false);
  };

  const handleDelete = (id: string) => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
  };

  const activeCount = knowledgeBases.filter(kb => kb.active).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Concierge Brain Management</DialogTitle>
          <DialogDescription>
            Configure what information your AI concierge can access to answer guest questions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Stats */}
          <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Sources</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold">{knowledgeBases.length}</p>
              <p className="text-sm text-muted-foreground">Total Sources</p>
            </div>
          </div>

          {/* Concierge Brain Sources */}
          <div className="space-y-3" data-tour-id="knowledge-categories">
            {knowledgeBases.map((kb) => {
              const Icon = kb.icon;
              return (
                <div
                  key={kb.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    kb.active
                      ? 'border-accent/50 bg-accent/5'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      kb.active ? 'bg-accent/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        kb.active ? 'text-accent' : 'text-muted-foreground'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{kb.name}</h3>
                            <Badge variant={kb.type === 'system' ? 'secondary' : 'outline'} className="text-xs">
                              {kb.type === 'system' ? 'System' : 'Custom'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{kb.description}</p>
                        </div>
                        <Switch
                          checked={kb.active}
                          onCheckedChange={() => toggleKnowledgeBase(kb.id)}
                        />
                      </div>

                      {kb.itemCount !== undefined && (
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground">
                            {kb.itemCount} {kb.itemCount === 1 ? 'item' : 'items'}
                          </p>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingKB({ id: kb.id, name: kb.name });
                                if (onCategoryEdit) {
                                  onCategoryEdit();
                                }
                              }}
                              data-tour-id="edit-category-button"
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              <span className="text-xs">Edit Items</span>
                            </Button>
                            {kb.type === 'custom' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(kb.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Chatbot Brain */}
          {showAddNew ? (
            <div className="p-4 rounded-lg border-2 border-dashed border-border space-y-3">
              <Input
                placeholder="Chatbot brain name"
                value={newKBName}
                onChange={(e) => setNewKBName(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newKBDescription}
                onChange={(e) => setNewKBDescription(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddNew} className="flex-1">
                  Add Chatbot Brain
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewKBName('');
                    setNewKBDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setShowAddNew(true)}
              data-tour-id="add-category-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add category
            </Button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Knowledge Source Editor Dialog */}
      {editingKB && (
        <KnowledgeBaseEditor
          open={!!editingKB}
          onOpenChange={(open) => {
            const isInEditorTour = ['7d', '7e'].includes(currentTourStep || '');
            if (!isInEditorTour || open) {
              !open && setEditingKB(null);
            }
          }}
          knowledgeBaseName={editingKB.name}
          knowledgeBaseId={editingKB.id}
        />
      )}
    </Dialog>
  );
}
