import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { wedding, loading: weddingLoading } = useWedding();

  useEffect(() => {
    if (authLoading || weddingLoading) return;

    if (!user) {
      // Not logged in - go to landing page
      navigate('/landing', { replace: true });
    } else if (wedding?.onboardingComplete) {
      // Onboarding complete - go to homepage
      navigate('/homepage', { replace: true });
    } else if (wedding) {
      // Has wedding but onboarding not complete - resume onboarding
      const step = wedding.onboardingStep || 1;
      const stepMap: Record<number, string> = {
        1: '/onboarding/step-1a',
        2: '/onboarding/step-2',
        3: '/onboarding/step-3',
        4: '/onboarding/step-4',
        5: '/onboarding/step-5',
        6: '/onboarding/step-6',
        7: '/onboarding/step-7',
        8: '/onboarding/step-8',
        9: '/onboarding/step-9',
        10: '/onboarding/step-10',
      };
      navigate(stepMap[step] || '/onboarding/step-1a', { replace: true });
    } else {
      // Logged in but no wedding - start onboarding
      navigate('/onboarding/step-1a', { replace: true });
    }
  }, [user, wedding, authLoading, weddingLoading, navigate]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
