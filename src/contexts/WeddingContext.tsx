import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Wedding, SimulatedMessage, Partner } from '@/types/wedding';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, ApiWedding, ApiPartner } from '@/lib/api';
import { toast } from 'sonner';

interface WeddingContextType {
  wedding: Wedding | null;
  weddingId: string | null;
  loading: boolean;
  error: string | null;
  updateWedding: (updates: Partial<Wedding>) => Promise<void>;
  createWedding: (data: Partial<Wedding>) => Promise<Wedding | null>;
  loadWedding: () => Promise<void>;
  conversations: SimulatedMessage[];
  addConversation: (message: SimulatedMessage) => void;
  clearConversations: () => void;
}

const defaultWedding: Wedding = {
  id: '',
  couple1: '',
  couple2: '',
  partners: [],
  date: '',
  time: '',
  venue: '',
  venueAddress: '',
  dressCode: '',
  parking: '',
  hotels: '',
  registry: '',
  kidsPolicy: '',
  customFAQs: [],
  websiteUrl: '',
  chatbotSettings: {
    name: 'Concierge',
    tone: 'warm',
    unknownAnswer: 'escalate',
    notifications: 'daily',
  },
  onboardingStep: 1,
  onboardingComplete: false,
  tourMode: false,
  canGoBack: false,
  tourProgress: {
    homepage: false,
    conversations: false,
    guestPage: false,
    weddingInfo: false,
    chatbotSettings: false,
    analytics: false,
  },
};

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

// Convert API response to local Wedding type
function apiToLocalWedding(api: ApiWedding, partners: Partner[] = []): Wedding {
  return {
    id: api.id,
    couple1: api.couple1 || '',
    couple2: api.couple2 || '',
    partners,
    date: api.date || '',
    time: api.time || '',
    venue: api.venue || '',
    venueAddress: api.venue_address || '',
    dressCode: api.dress_code || '',
    parking: api.parking || '',
    hotels: api.hotels || '',
    registry: api.registry || '',
    kidsPolicy: api.kids_policy || '',
    customFAQs: [],
    websiteUrl: api.website_url || '',
    chatbotSettings: {
      name: 'Concierge',
      tone: 'warm',
      unknownAnswer: 'escalate',
      notifications: 'daily',
    },
    onboardingStep: (api.onboarding_step || 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    onboardingComplete: api.onboarding_complete || false,
    tourMode: false,
    canGoBack: false,
    tourProgress: {
      homepage: false,
      conversations: false,
      guestPage: false,
      weddingInfo: false,
      chatbotSettings: false,
      analytics: false,
    },
  };
}

// Convert local Wedding to API format for updates
function localToApiWedding(local: Partial<Wedding>): Partial<ApiWedding> {
  const api: Partial<ApiWedding> = {};

  if (local.couple1 !== undefined) api.couple1 = local.couple1;
  if (local.couple2 !== undefined) api.couple2 = local.couple2;
  if (local.date !== undefined) api.date = local.date || null;
  if (local.time !== undefined) api.time = local.time || null;
  if (local.venue !== undefined) api.venue = local.venue || null;
  if (local.venueAddress !== undefined) api.venue_address = local.venueAddress || null;
  if (local.dressCode !== undefined) api.dress_code = local.dressCode || null;
  if (local.parking !== undefined) api.parking = local.parking || null;
  if (local.hotels !== undefined) api.hotels = local.hotels || null;
  if (local.registry !== undefined) api.registry = local.registry || null;
  if (local.kidsPolicy !== undefined) api.kids_policy = local.kidsPolicy || null;
  if (local.websiteUrl !== undefined) api.website_url = local.websiteUrl || null;
  if (local.onboardingStep !== undefined) api.onboarding_step = local.onboardingStep;
  if (local.onboardingComplete !== undefined) api.onboarding_complete = local.onboardingComplete;

  return api;
}

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<SimulatedMessage[]>([]);

  const loadWedding = async () => {
    if (!session) {
      setWedding(null);
      setWeddingId(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedWeddingId = localStorage.getItem('current_wedding_id');

      if (storedWeddingId) {
        const response = await apiClient.get<ApiWedding>(`/api/weddings/${storedWeddingId}`);

        if (response.data) {
          const partnersResponse = await apiClient.get<ApiPartner[]>('/api/partners', { wedding_id: storedWeddingId });
          const partners: Partner[] = (partnersResponse.data || []).map(p => ({
            id: p.id,
            name: p.name,
            email: p.email || '',
            phone: p.phone || '',
          }));

          const loadedWedding = apiToLocalWedding(response.data, partners);
          setWedding(loadedWedding);
          setWeddingId(response.data.id);
        }
      }
    } catch (err: any) {
      if (err.code !== 'HTTP_404' && err.code !== 'NOT_FOUND') {
        setError(err.message || 'Failed to load wedding');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadWedding();
    } else {
      setWedding(null);
      setWeddingId(null);
    }
  }, [session]);

  const createWedding = async (data: Partial<Wedding>): Promise<Wedding | null> => {
    if (!session) {
      toast.error('Please sign in to create a wedding');
      return null;
    }

    setLoading(true);
    try {
      const apiData = localToApiWedding(data);
      const response = await apiClient.post<ApiWedding>('/api/weddings', apiData);

      if (response.data) {
        const newWedding = apiToLocalWedding(response.data);
        setWedding(newWedding);
        setWeddingId(response.data.id);
        localStorage.setItem('current_wedding_id', response.data.id);
        return newWedding;
      }
      return null;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create wedding');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateWedding = async (updates: Partial<Wedding>) => {
    if (!weddingId) {
      await createWedding(updates);
      return;
    }

    setWedding(prev => prev ? { ...prev, ...updates } : null);

    try {
      const apiData = localToApiWedding(updates);
      const response = await apiClient.patch<ApiWedding>(`/api/weddings/${weddingId}`, apiData);

      if (response.data) {
        setWedding(prev => {
          if (!prev) return null;
          return apiToLocalWedding(response.data!, prev.partners);
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
      loadWedding();
    }
  };

  const addConversation = (message: SimulatedMessage) => {
    setConversations(prev => [...prev, message]);
  };

  const clearConversations = () => {
    setConversations([]);
  };

  return (
    <WeddingContext.Provider
      value={{
        wedding,
        weddingId,
        loading,
        error,
        updateWedding,
        createWedding,
        loadWedding,
        conversations,
        addConversation,
        clearConversations
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within WeddingProvider');
  }
  return context;
}
