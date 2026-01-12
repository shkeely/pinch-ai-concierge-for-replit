import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/90 via-primary to-primary/80"
    >
      {/* Logo + Auth */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center justify-between w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]">
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-[0.3em] text-primary-foreground">
          PINCH.
        </h1>
        {user ? (
          <Button
            variant="ghost"
            onClick={() => navigate("/homepage")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 pt-32 pb-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">AI Wedding Concierge</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance text-primary-foreground">
            Never Answer Another
            <br />
            <span className="text-accent">Guest Question</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-balance text-primary-foreground/80">
            Set it up once, and let your wedding concierge handle guest Q&A 24/7 via SMS
          </p>

          <Button 
            size="lg" 
            onClick={() => navigate("/auth")} 
            className="bg-accent hover:bg-accent/90 text-lg px-12 py-6 h-auto text-accent-foreground"
          >
            Get Started Free
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card/10 backdrop-blur-sm rounded-2xl">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3 text-primary-foreground">Smart Q&A</h3>
            <p className="text-primary-foreground/70">
              Answers timing, location, dress code, parking, and custom questions automatically
            </p>
          </div>

          <div className="text-center p-6 bg-card/10 backdrop-blur-sm rounded-2xl">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3 text-primary-foreground">Your Voice, Your Tone</h3>
            <p className="text-primary-foreground/70">
              Choose warm, formal, or fun — responses match your wedding style
            </p>
          </div>

          <div className="text-center p-6 bg-card/10 backdrop-blur-sm rounded-2xl">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3 text-primary-foreground">5-Minute Setup</h3>
            <p className="text-primary-foreground/70">
              Import from your website or enter details manually — live in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
