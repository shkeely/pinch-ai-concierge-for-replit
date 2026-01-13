import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  User,
  Bot
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/dateUtils';

interface Message {
  id: string;
  guestName: string;
  guestPhone: string;
  content: string;
  response?: string;
  timestamp: Date;
  status: 'answered' | 'pending' | 'escalated';
  isFromBot: boolean;
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    guestName: 'Sarah Johnson',
    guestPhone: '+1 555-0101',
    content: 'What time does the ceremony start?',
    response: 'The ceremony begins at 4:00 PM. Please arrive 15-20 minutes early to find your seats!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'answered',
    isFromBot: true
  },
  {
    id: '2',
    guestName: 'Michael Chen',
    guestPhone: '+1 555-0102',
    content: 'Is there parking available at the venue?',
    response: 'Yes! Complimentary valet parking is available at the main entrance of the venue.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'answered',
    isFromBot: true
  },
  {
    id: '3',
    guestName: 'Emily Davis',
    guestPhone: '+1 555-0103',
    content: 'I have a dietary restriction - are there vegetarian options?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'escalated',
    isFromBot: false
  },
  {
    id: '4',
    guestName: 'James Wilson',
    guestPhone: '+1 555-0104',
    content: 'Can I bring my kids to the reception?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'pending',
    isFromBot: false
  }
];

export default function Messages() {
  const [messages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      answered: { variant: 'secondary', label: 'Answered' },
      escalated: { variant: 'destructive', label: 'Needs Attention' },
      pending: { variant: 'outline', label: 'Pending' }
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Messages</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage guest conversations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Answered</span>
            </div>
            <p className="text-2xl font-serif font-bold mt-1">
              {messages.filter(m => m.status === 'answered').length}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Escalated</span>
            </div>
            <p className="text-2xl font-serif font-bold mt-1">
              {messages.filter(m => m.status === 'escalated').length}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-serif font-bold mt-1">
              {messages.filter(m => m.status === 'pending').length}
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Message List */}
          <Card className="p-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant={selectedStatus === 'escalated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(selectedStatus === 'escalated' ? 'all' : 'escalated')}
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Escalated
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedMessage?.id === message.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <span className="font-medium">{message.guestName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Detail */}
          <Card className="p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-lg">{selectedMessage.guestName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMessage.guestPhone}</p>
                  </div>
                  {getStatusBadge(selectedMessage.status)}
                </div>

                <div className="space-y-4">
                  {/* Guest Message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                        <p className="text-sm">{selectedMessage.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(selectedMessage.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Bot Response */}
                  {selectedMessage.response && (
                    <div className="flex gap-3 justify-end">
                      <div className="flex-1">
                        <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none ml-8">
                          <p className="text-sm">{selectedMessage.response}</p>
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Bot className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Auto-replied</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                {(selectedMessage.status === 'escalated' || selectedMessage.status === 'pending') && (
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="Type your response..." />
                      <Button>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}