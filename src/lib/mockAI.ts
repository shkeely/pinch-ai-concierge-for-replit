import { Wedding, AIResponse, Tone } from '@/types/wedding';
import { format } from 'date-fns';

const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

interface IntentKeywords {
  [key: string]: string[];
}

const intents: IntentKeywords = {
  timing: ['time', 'when', 'start', 'begin', 'ceremony', 'schedule'],
  location: ['where', 'location', 'venue', 'address', 'directions', 'place'],
  attire: ['wear', 'dress', 'attire', 'outfit', 'clothes', 'code'],
  parking: ['park', 'parking', 'lot', 'valet'],
  kids: ['kid', 'child', 'children', 'baby', 'babies', 'toddler'],
  hotels: ['hotel', 'stay', 'accommodation', 'lodging', 'sleep'],
  registry: ['registry', 'gift', 'present', 'register'],
  rsvp: ['rsvp', 'respond', 'confirm', 'attending', 'coming'],
};

export function mockAIResponse(question: string, weddingData: Wedding): AIResponse {
  const lowerQ = question.toLowerCase();

  // Find matching intent
  let matchedIntent: string | null = null;
  let maxMatches = 0;

  for (const [intent, keywords] of Object.entries(intents)) {
    const matches = keywords.filter(kw => lowerQ.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedIntent = intent;
    }
  }

  // Check custom FAQs first
  for (const faq of weddingData.customFAQs) {
    if (lowerQ.includes(faq.question.toLowerCase())) {
      return {
        text: faq.answer,
        confidence: 'high',
        source: 'Custom FAQ',
      };
    }
  }

  if (!matchedIntent || maxMatches === 0) {
    return {
      text: generateResponse('unknown', weddingData.chatbotSettings.tone, weddingData),
      confidence: 'low',
      source: null,
    };
  }

  const hasData = checkDataAvailability(matchedIntent, weddingData);
  const response = generateResponse(matchedIntent, weddingData.chatbotSettings.tone, weddingData);

  return {
    text: response,
    confidence: hasData ? 'high' : 'medium',
    source: hasData ? getSourceField(matchedIntent) : null,
  };
}

function checkDataAvailability(intent: string, data: Wedding): boolean {
  switch (intent) {
    case 'timing':
      return !!(data.date && data.time);
    case 'location':
      return !!(data.venue && data.venueAddress);
    case 'attire':
      return !!data.dressCode;
    case 'parking':
      return !!data.parking;
    case 'kids':
      return !!data.kidsPolicy;
    case 'hotels':
      return !!data.hotels;
    case 'registry':
      return !!data.registry;
    default:
      return false;
  }
}

function getSourceField(intent: string): string {
  const sourceMap: { [key: string]: string } = {
    timing: 'Wedding Date & Time',
    location: 'Venue Information',
    attire: 'Dress Code',
    parking: 'Parking Details',
    kids: 'Kids Policy',
    hotels: 'Hotel Recommendations',
    registry: 'Registry Information',
  };
  return sourceMap[intent] || 'Wedding Details';
}

function generateResponse(intent: string, tone: Tone, data: Wedding): string {
  const responses: { [key: string]: { [key in Tone]: (d: Wedding) => string } } = {
    timing: {
      warm: (d) => `We'd love to see you there! The ceremony starts at ${d.time} on ${formatDate(d.date)}. Please arrive 15 minutes early! 💐`,
      formal: (d) => `The ceremony will commence at ${d.time} on ${formatDate(d.date)}. We request that guests arrive 15 minutes prior.`,
      fun: (d) => `Party starts at ${d.time} on ${formatDate(d.date)}! Don't be late! 🎉`,
    },
    location: {
      warm: (d) => `The celebration will be at ${d.venue}, located at ${d.venueAddress}. Can't wait to see you there! 🗺️`,
      formal: (d) => `The ceremony and reception will take place at ${d.venue}, ${d.venueAddress}.`,
      fun: (d) => `We're getting married at ${d.venue}! Find us at: ${d.venueAddress} 📍`,
    },
    attire: {
      warm: (d) => d.dressCode ? `The dress code is ${d.dressCode}. We can't wait to celebrate with you! ✨` : `We'll share dress code details soon!`,
      formal: (d) => d.dressCode ? `The requested attire for the occasion is ${d.dressCode}.` : `Dress code information will be provided shortly.`,
      fun: (d) => d.dressCode ? `Dress code: ${d.dressCode}. Come looking fabulous! 💃` : `Dress code coming soon!`,
    },
    parking: {
      warm: (d) => d.parking || `We'll share parking details closer to the date! 🚗`,
      formal: (d) => d.parking || `Parking information will be provided in advance of the event.`,
      fun: (d) => d.parking || `Parking info coming soon! We got you covered! 🅿️`,
    },
    kids: {
      warm: (d) => d.kidsPolicy || `Please check with us directly about bringing children! 👶`,
      formal: (d) => d.kidsPolicy || `Kindly inquire with the couple regarding children attendance.`,
      fun: (d) => d.kidsPolicy || `Kids question? Message us! 🧒`,
    },
    hotels: {
      warm: (d) => d.hotels || `We're working on hotel recommendations! Check back soon! 🏨`,
      formal: (d) => d.hotels || `Accommodation recommendations will be shared in due course.`,
      fun: (d) => d.hotels || `Hotel block coming soon! Stay tuned! 🛏️`,
    },
    registry: {
      warm: (d) => d.registry || `Your presence is the best gift! Registry details coming soon! 🎁`,
      formal: (d) => d.registry || `Registry information will be provided at a later date.`,
      fun: (d) => d.registry || `Registry info on the way! 🎉`,
    },
    rsvp: {
      warm: () => `We'd love to have you! Please let us know if you can make it! 💕`,
      formal: () => `Please confirm your attendance at your earliest convenience.`,
      fun: () => `Can you make it? Let us know! 🎊`,
    },
    unknown: {
      warm: () => `That's a great question! I'll check with the couple and get back to you! 💌`,
      formal: () => `I will confirm this information with the couple and respond shortly.`,
      fun: () => `Good question! Let me ask the couple and circle back! 🔄`,
    },
  };

  const intentResponses = responses[intent];
  if (!intentResponses) {
    return responses.unknown[tone](data);
  }

  return intentResponses[tone](data);
}
