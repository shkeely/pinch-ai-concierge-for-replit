export const FAKE_DATA = {
  homepage: {
    userName: "Rachel",
    needsAttention: [
      {
        id: "1",
        type: "escalated",
        title: "Guest Question Escalated",
        description: "Sarah asked about bringing her service dog - requires your personal approval",
        urgent: true,
        timestamp: "2 hours ago"
      },
      {
        id: "2",
        type: "suggestion",
        title: "Consider Adding Hotel Block Info",
        description: "3 guests have asked about nearby hotels in the past week",
        urgent: false,
        timestamp: "Today"
      },
      {
        id: "3",
        type: "suggestion",
        title: "Update Ceremony Time",
        description: "You mentioned the time might change - update your knowledge base to avoid confusion",
        urgent: false,
        timestamp: "Yesterday"
      }
    ],
    handledToday: [
      {
        guestName: "Sally",
        question: "Parking",
        timestamp: "10 mins ago"
      },
      {
        guestName: "Tom",
        question: "Dress Code",
        timestamp: "1 hour ago"
      },
      {
        guestName: "John",
        question: "Registry",
        timestamp: "2 hours ago"
      },
      {
        guestName: "Emma",
        question: "Plus-ones",
        timestamp: "3 hours ago"
      },
      {
        guestName: "Mike",
        question: "Ceremony Location",
        timestamp: "4 hours ago"
      }
    ],
    upcomingAnnouncements: [
      {
        id: "1",
        title: "RSVP Deadline Reminder",
        date: "Nov 15, 2025",
        time: "9:00 AM",
        guests: 120,
        status: "Scheduled"
      },
      {
        id: "2",
        title: "Day-Of Reminder",
        date: "Apr 15, 2025",
        time: "9:00 AM",
        guests: 127,
        status: "Scheduled"
      }
    ]
  },
  recentConversations: [
    {
      id: '1',
      guestName: 'Emily Thompson',
      phoneNumber: '(415) 555-0123',
      question: 'What time does the ceremony start?',
      answer: 'The ceremony begins at 4:30 PM on Saturday, June 15th at The Grove Estate. We recommend arriving 15 minutes early.',
      timestamp: '2:30 PM',
      date: '5/10/2025',
      status: 'auto' as const,
      confidence: 'high',
      confidencePercent: '95% confident'
    },
    {
      id: '2',
      guestName: 'Michael Chen',
      phoneNumber: '(628) 555-0198',
      question: 'Is there parking available at the venue?',
      answer: 'Yes, there is complimentary valet parking available at the venue entrance.',
      timestamp: '1:45 PM',
      date: '5/10/2025',
      status: 'auto' as const,
      confidence: 'high',
      confidencePercent: '92% confident'
    },
    {
      id: '3',
      guestName: 'Jessica Martinez',
      phoneNumber: '(510) 555-0145',
      question: 'Can I bring my kids?',
      answer: 'We love your little ones, but we have planned an adults-only celebration. We hope you understand!',
      timestamp: '11:20 AM',
      date: '5/11/2025',
      status: 'auto' as const,
      confidence: 'medium',
      confidencePercent: '88% confident'
    },
    {
      id: '4',
      guestName: 'David Park',
      phoneNumber: '(415) 555-0167',
      question: 'I might need to cancel - what should I do?',
      answer: '',
      timestamp: '9:15 AM',
      date: '5/11/2025',
      status: 'escalated' as const,
      confidence: 'low',
      confidencePercent: ''
    },
    {
      id: '5',
      guestName: 'Sarah Williams',
      phoneNumber: '(650) 555-0189',
      question: 'What\'s the dress code?',
      answer: 'We recommend cocktail attire. Think dressy but comfortable for an outdoor celebration.',
      timestamp: '8:45 AM',
      date: '5/12/2025',
      status: 'auto' as const,
      confidence: 'high',
      confidencePercent: '97% confident'
    },
    {
      id: '6',
      guestName: 'Robert Johnson',
      phoneNumber: '(408) 555-0134',
      question: 'Are there hotels nearby?',
      answer: 'We have a room block at The Grand Hotel (2 miles away) and Comfort Inn (3 miles away). Use code WEDDING2025 for discounts.',
      timestamp: '7:30 AM',
      date: '5/12/2025',
      status: 'auto' as const,
      confidence: 'medium',
      confidencePercent: '85% confident'
    }
  ]
};
