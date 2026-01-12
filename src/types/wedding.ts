export type Tone = 'warm' | 'formal' | 'fun';

export type UnknownAnswerBehavior = 'escalate' | 'generic' | 'website';

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly';

export type Confidence = 'high' | 'medium' | 'low';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ChatbotSettings {
  name: string;
  tone: Tone;
  unknownAnswer: UnknownAnswerBehavior;
  notifications: NotificationFrequency;
}

export interface TourProgress {
  homepage: boolean;
  conversations: boolean;
  guestPage: boolean;
  weddingInfo: boolean;
  chatbotSettings: boolean;
  analytics: boolean;
}

export interface Wedding {
  id: string;
  couple1: string;
  couple2: string;
  partners: Partner[];
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  dressCode: string;
  parking: string;
  hotels: string;
  registry: string;
  kidsPolicy: string;
  customFAQs: FAQ[];
  websiteUrl: string;

  chatbotSettings: ChatbotSettings;

  onboardingStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  onboardingComplete: boolean;
  tourMode: boolean;
  canGoBack: boolean;
  tourProgress: TourProgress;
}

export interface SimulatedMessage {
  id: string;
  timestamp: string;
  guestMessage: string;
  botResponse: string;
  confidence: Confidence;
  source: string | null;
  isGuest: boolean;
}

export interface AIResponse {
  text: string;
  confidence: Confidence;
  source: string | null;
}
