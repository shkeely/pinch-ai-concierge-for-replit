import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  HelpCircle, 
  MessageSquare,
  Mail,
  ExternalLink,
  Send
} from 'lucide-react';

const faqs = [
  {
    question: 'How does the AI concierge work?',
    answer: 'Your AI concierge automatically responds to guest questions via SMS using the information you provide about your wedding. It can answer questions about timing, location, dress code, parking, and any custom FAQs you set up.'
  },
  {
    question: 'How do guests contact the concierge?',
    answer: 'Guests can text your dedicated phone number (provided after setup) to ask questions. The AI responds instantly based on your wedding details and knowledge base.'
  },
  {
    question: 'Can I customize the responses?',
    answer: 'Yes! You can set the tone (warm, formal, or fun), add custom FAQs, and configure how unknown questions are handled. Visit the Concierge Brain page to customize responses.'
  },
  {
    question: 'What happens if the AI can\'t answer a question?',
    answer: 'Depending on your settings, questions the AI can\'t answer will either be escalated to you for a personal response, or answered with a polite fallback message.'
  },
  {
    question: 'How do I add guests to my list?',
    answer: 'Go to the Guests page where you can add guests manually one by one, or import them in bulk via CSV. You can also organize guests into segments like "Family" or "Wedding Party".'
  },
  {
    question: 'Can my partner access the dashboard?',
    answer: 'Yes! Visit your Profile page to invite your partner or wedding planner. They\'ll receive an email invitation to collaborate on managing your wedding concierge.'
  },
  {
    question: 'Is there a limit to how many guests I can add?',
    answer: 'Your plan determines guest limits. Free plans support up to 50 guests, while premium plans offer unlimited guests. Check the Settings page for your current plan details.'
  },
  {
    question: 'How do I change my wedding details?',
    answer: 'Visit the Wedding Details page to update your date, venue, dress code, parking info, and other details. Changes are automatically reflected in AI responses.'
  }
];

export default function HelpSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setSubject('');
    setMessage('');
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Help & Support</h1>
          </div>
          <p className="text-muted-foreground">
            Find answers or reach out to our support team
          </p>
        </div>

        {/* FAQs */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Contact Form */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">Contact Support</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What do you need help with?"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                rows={5}
              />
            </div>
            <Button type="submit" disabled={sending}>
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-lg font-serif font-semibold mb-4">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="#" 
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Chat with support now</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            
            <a 
              href="mailto:support@pinch.wedding" 
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Email Us</p>
                <p className="text-sm text-muted-foreground">support@pinch.wedding</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}