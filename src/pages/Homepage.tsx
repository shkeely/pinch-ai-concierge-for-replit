import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Settings, MessageSquare } from 'lucide-react';

export default function Homepage() {
  const { user, signOut } = useAuth();
  const { wedding, loading } = useWedding();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold tracking-wide">PINCH.</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">
            Welcome{wedding?.couple1 ? `, ${wedding.couple1}` : ''}!
          </h2>
          <p className="text-muted-foreground">
            Your AI wedding concierge is ready to help.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Manage Guests</h3>
            <p className="text-sm text-muted-foreground">
              Add, edit, and organize your guest list with segments.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Concierge Brain</h3>
            <p className="text-sm text-muted-foreground">
              Customize FAQs, instructions, and response behavior.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-mint/30 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-mint-foreground" />
            </div>
            <h3 className="text-lg font-serif font-semibold mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure chatbot tone, notifications, and preferences.
            </p>
          </Card>
        </div>

        {/* Status */}
        {!wedding?.onboardingComplete && (
          <Card className="mt-8 p-6 bg-lavender/20 border-lavender">
            <h3 className="font-serif font-semibold mb-2">Complete Your Setup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Finish onboarding to activate your AI concierge.
            </p>
            <Button onClick={() => navigate('/onboarding/step-1a')}>
              Continue Setup
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
