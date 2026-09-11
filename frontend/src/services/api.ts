import axios from 'axios';
import { 
  Contact, 
  Event, 
  Interaction, 
  MeetingLocation, 
  NearbyContact, 
  Suggestion, 
  DuplicateCheckResponse, 
  NotificationItem, 
  RelationshipGraph 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Seed mock data with initial letter rendering
let mockContacts: Contact[] = [
  {
    id: 1,
    fullName: 'Ravi Kumar',
    phoneNumber: '+91 9876543210',
    email: 'ravi@gmail.com',
    category: 'COLLEGE',
    address: 'Anna Nagar, Chennai',
    notes: 'Met at college hackathon 2026. Full-stack developer proficient in React and Java.',
    relationshipScore: 85,
    homeLatitude: 13.0850,
    homeLongitude: 80.2100,
    homeCityArea: 'Chennai Anna Nagar',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [
      { id: 1, locationName: 'Chennai Trade Centre', latitude: 13.0182, longitude: 80.1942, meetingDate: '2026-08-10', relatedEventName: 'Chennai Tech Conference 2026', description: 'Met during keynote session' }
    ],
    interactions: [
      { id: 1, interactionType: 'MEETING', interactionDate: '2026-08-10T11:30:00', notes: 'Met at Chennai Tech Conference, discussed Spring Boot microservices.', locationName: 'Chennai Trade Centre', relatedEventName: 'Chennai Tech Conference 2026' }
    ]
  },
  {
    id: 2,
    fullName: 'Suresh Babu',
    phoneNumber: '+91 9443211223',
    email: 'suresh.vellore@gmail.com',
    category: 'PROFESSIONAL',
    address: 'Katpadi Road, Vellore',
    notes: 'Senior Systems Engineer in Vellore.',
    relationshipScore: 82,
    homeLatitude: 12.9165,
    homeLongitude: 79.1325,
    homeCityArea: 'Vellore Fort Region',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [
      { id: 2, locationName: 'VIT University Campus, Vellore', latitude: 12.9692, longitude: 79.1559, meetingDate: '2026-06-18', description: 'Met at VIT Vellore campus' }
    ],
    interactions: []
  },
  {
    id: 3,
    fullName: 'Sophia Anderson',
    phoneNumber: '+44 7911123456',
    email: 'sophia.london@techcorp.uk',
    category: 'PROFESSIONAL',
    address: 'Canary Wharf, London, UK',
    notes: 'Global Product Lead at FinTech Global. Met at London Tech Summit.',
    relationshipScore: 90,
    homeLatitude: 51.5074,
    homeLongitude: -0.1278,
    homeCityArea: 'London, United Kingdom',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [
      { id: 3, locationName: 'ExCeL London Convention Center', latitude: 51.5085, longitude: 0.0298, meetingDate: '2026-05-10', relatedEventName: 'London Tech Summit 2026', description: 'Met at AI in Finance Panel' }
    ],
    interactions: []
  },
  {
    id: 4,
    fullName: 'Kenji Takahashi',
    phoneNumber: '+81 9012345678',
    email: 'kenji.tokyo@ai-labs.jp',
    category: 'COLLEGE',
    address: 'Shibuya, Tokyo, Japan',
    notes: 'Robotics Researcher & AI Engineer.',
    relationshipScore: 88,
    homeLatitude: 35.6762,
    homeLongitude: 139.6503,
    homeCityArea: 'Tokyo, Japan',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [
      { id: 4, locationName: 'Tokyo Big Sight Center', latitude: 35.6298, longitude: 139.7942, meetingDate: '2026-04-14', description: 'World Robotics Expo' }
    ],
    interactions: []
  },
  {
    id: 5,
    fullName: 'David Miller',
    phoneNumber: '+1 2125550199',
    email: 'david.m@nytech.com',
    category: 'OFFICE',
    address: 'Manhattan, New York, USA',
    notes: 'VP of Engineering at Cloud Scale Inc.',
    relationshipScore: 84,
    homeLatitude: 40.7128,
    homeLongitude: -74.0060,
    homeCityArea: 'New York City, USA',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [],
    interactions: []
  },
  {
    id: 6,
    fullName: 'Fatima Al-Mansoor',
    phoneNumber: '+971 501234567',
    email: 'fatima@dubai-innovations.ae',
    category: 'FRIEND',
    address: 'Downtown Dubai, UAE',
    notes: 'Smart Cities Consultant. Met at GITEX Global.',
    relationshipScore: 86,
    homeLatitude: 25.2048,
    homeLongitude: 55.2708,
    homeCityArea: 'Dubai, UAE',
    privacyLevel: 'APPROXIMATE',
    allowNearbyDiscovery: true,
    meetingLocations: [
      { id: 5, locationName: 'Dubai World Trade Centre', latitude: 25.2285, longitude: 55.2868, meetingDate: '2026-03-20', description: 'GITEX Global Smart City Forum' }
    ],
    interactions: []
  }
];

let mockEvents: Event[] = [
  {
    id: 1,
    eventName: 'London Global Tech Summit 2026',
    description: 'International conference on AI, Cloud Systems, and FinTech.',
    eventDate: '2026-05-10',
    eventTime: '09:00',
    locationName: 'ExCeL London Convention Center',
    latitude: 51.5085,
    longitude: 0.0298,
    category: 'Conference',
    participants: [mockContacts[2]]
  },
  {
    id: 2,
    eventName: 'Tokyo World Robotics Expo',
    description: 'Global robotics innovation expo in Odaiba Tokyo.',
    eventDate: '2026-04-14',
    eventTime: '10:00',
    locationName: 'Tokyo Big Sight Center',
    latitude: 35.6298,
    longitude: 139.7942,
    category: 'Expo',
    participants: [mockContacts[3]]
  },
  {
    id: 3,
    eventName: 'Chennai Tech Conference 2026',
    description: 'Annual developer conference on Cloud Native, Spring Boot, and Web Frameworks.',
    eventDate: '2026-08-10',
    eventTime: '10:00',
    locationName: 'Chennai Trade Centre',
    latitude: 13.0182,
    longitude: 80.1942,
    category: 'Conference',
    participants: [mockContacts[0]]
  }
];

let mockNotifications: NotificationItem[] = [
  { id: 1, title: 'Global Location Intelligence Active', message: 'You can now select and plot contacts anywhere in the world.', type: 'PRIVACY_ALERT', isRead: false, createdAt: '2026-08-09T08:00:00' },
  { id: 2, title: 'Follow-up Reminder: Sophia Anderson', message: 'Follow-up call scheduled regarding London Tech Summit partnership.', type: 'FOLLOWUP_REMINDER', isRead: false, createdAt: '2026-08-08T14:30:00' }
];

// --- CONTACT API SERVICES ---
export const fetchContacts = async (searchQuery?: string): Promise<Contact[]> => {
  try {
    const res = await api.get<Contact[]>('/contacts', { params: { search: searchQuery } });
    return res.data;
  } catch (err) {
    let result = [...mockContacts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.fullName.toLowerCase().includes(q) || 
        c.phoneNumber.includes(q) || 
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        (c.homeCityArea && c.homeCityArea.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    }
    return result;
  }
};

export const getContactById = async (id: number): Promise<Contact> => {
  try {
    const res = await api.get<Contact>(`/contacts/${id}`);
    return res.data;
  } catch (err) {
    const found = mockContacts.find(c => c.id === id);
    if (!found) throw new Error('Contact not found');
    return found;
  }
};

export const checkDuplicateContact = async (phone: string, email: string, currentId?: number): Promise<DuplicateCheckResponse> => {
  try {
    const res = await api.post<DuplicateCheckResponse>('/contacts/check-duplicate', null, {
      params: { phone, email, currentId }
    });
    return res.data;
  } catch (err) {
    const dup = mockContacts.find(c => (c.phoneNumber === phone || (email && c.email === email)) && c.id !== currentId);
    if (dup) {
      const matchedBy = dup.phoneNumber === phone ? 'PHONE' : 'EMAIL';
      return {
        duplicate: true,
        matchedBy,
        existingContact: dup,
        message: `Possible duplicate contact found matching ${matchedBy.toLowerCase()}: ${dup.fullName}`
      };
    }
    return { duplicate: false, message: 'No duplicates found' };
  }
};

export const createContact = async (contact: Partial<Contact>, forceSave = false): Promise<Contact> => {
  try {
    const res = await api.post<Contact>('/contacts', contact, { params: { forceSave } });
    return res.data;
  } catch (err) {
    const newContact: Contact = {
      id: Date.now(),
      fullName: contact.fullName || '',
      phoneNumber: contact.phoneNumber || '',
      email: contact.email,
      category: contact.category || 'OTHER',
      address: contact.address,
      notes: contact.notes,
      relationshipScore: 50,
      homeLatitude: typeof contact.homeLatitude === 'number' ? contact.homeLatitude : 13.0827,
      homeLongitude: typeof contact.homeLongitude === 'number' ? contact.homeLongitude : 80.2707,
      homeCityArea: contact.homeCityArea || 'Global Location',
      privacyLevel: contact.privacyLevel || 'APPROXIMATE',
      allowNearbyDiscovery: contact.allowNearbyDiscovery ?? true,
      meetingLocations: [],
      interactions: []
    };
    mockContacts.unshift(newContact);
    return newContact;
  }
};

export const updateContact = async (id: number, contact: Partial<Contact>): Promise<Contact> => {
  try {
    const res = await api.put<Contact>(`/contacts/${id}`, contact);
    return res.data;
  } catch (err) {
    const index = mockContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContacts[index] = { ...mockContacts[index], ...contact };
      return mockContacts[index];
    }
    throw new Error('Contact not found');
  }
};

export const mergeContacts = async (targetId: number, incomingData: Partial<Contact>): Promise<Contact> => {
  try {
    const res = await api.post<Contact>(`/contacts/${targetId}/merge`, incomingData);
    return res.data;
  } catch (err) {
    const index = mockContacts.findIndex(c => c.id === targetId);
    if (index !== -1) {
      const existing = mockContacts[index];
      if (!existing.email && incomingData.email) existing.email = incomingData.email;
      if (incomingData.notes) existing.notes = (existing.notes ? existing.notes + '\n--- Merged Notes ---\n' : '') + incomingData.notes;
      existing.relationshipScore = Math.min(100, (existing.relationshipScore || 50) + 15);
      mockContacts[index] = { ...existing };
      return existing;
    }
    throw new Error('Contact not found');
  }
};

export const deleteContact = async (id: number): Promise<void> => {
  try {
    await api.delete(`/contacts/${id}`);
  } catch (err) {
    mockContacts = mockContacts.filter(c => c.id !== id);
  }
};

// --- EVENT API SERVICES ---
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get<Event[]>('/events');
    return res.data;
  } catch (err) {
    return mockEvents;
  }
};

export const getEventById = async (id: number): Promise<Event> => {
  try {
    const res = await api.get<Event>(`/events/${id}`);
    return res.data;
  } catch (err) {
    const found = mockEvents.find(e => e.id === id);
    if (!found) throw new Error('Event not found');
    return found;
  }
};

export const createEvent = async (event: Partial<Event>): Promise<Event> => {
  try {
    const res = await api.post<Event>('/events', event);
    return res.data;
  } catch (err) {
    const newEvent: Event = {
      id: Date.now(),
      eventName: event.eventName || 'New Event',
      description: event.description,
      eventDate: event.eventDate || new Date().toISOString().split('T')[0],
      eventTime: event.eventTime || '10:00',
      locationName: event.locationName || 'Main Venue',
      latitude: event.latitude || 13.0827,
      longitude: event.longitude || 80.2707,
      category: event.category || 'General',
      participants: []
    };
    mockEvents.unshift(newEvent);
    return newEvent;
  }
};

export const addParticipantToEvent = async (eventId: number, contactId: number): Promise<Event> => {
  try {
    const res = await api.post<Event>(`/events/${eventId}/participants/${contactId}`);
    return res.data;
  } catch (err) {
    const event = mockEvents.find(e => e.id === eventId);
    const contact = mockContacts.find(c => c.id === contactId);
    if (event && contact) {
      if (!event.participants) event.participants = [];
      if (!event.participants.some(p => p.id === contactId)) {
        event.participants.push(contact);
      }
      return event;
    }
    throw new Error('Event or contact not found');
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
  } catch (err) {
    mockEvents = mockEvents.filter(e => e.id !== id);
  }
};

// --- LOCATION & PRIVACY SERVICES ---
export const fetchNearbyContacts = async (lat = 13.0827, lng = 80.2707, radius = 20000): Promise<NearbyContact[]> => {
  try {
    const res = await api.get<NearbyContact[]>('/nearby-contacts', { params: { lat, lng, radius } });
    return res.data;
  } catch (err) {
    return mockContacts
      .filter(c => c.allowNearbyDiscovery !== false && c.privacyLevel !== 'PRIVATE' && typeof c.homeLatitude === 'number' && typeof c.homeLongitude === 'number')
      .map(c => {
        const dLat = (c.homeLatitude! - lat) * 111;
        const dLng = (c.homeLongitude! - lng) * 111;
        const dist = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10;

        return {
          contactId: c.id!,
          fullName: c.fullName,
          category: c.category,
          approximateDistanceKm: dist,
          approximateArea: c.homeCityArea || 'Global Region',
          displayLatitude: c.homeLatitude!,
          displayLongitude: c.homeLongitude!,
          isExactLocationHidden: true
        };
      });
  }
};

// --- SMART SUGGESTIONS SERVICE ---
export const fetchSmartSuggestions = async (event?: string, location?: string, category?: string): Promise<Suggestion[]> => {
  try {
    const res = await api.get<Suggestion[]>('/suggestions', { params: { event, location, category } });
    return res.data;
  } catch (err) {
    return [
      {
        contactId: 3,
        fullName: 'Sophia Anderson',
        category: 'PROFESSIONAL',
        rationale: 'Key FinTech lead contact in London, UK',
        relevanceScore: 95,
        previousEventName: 'London Global Tech Summit',
        meetingLocationName: 'ExCeL London Convention Center'
      },
      {
        contactId: 4,
        fullName: 'Kenji Takahashi',
        category: 'COLLEGE',
        rationale: 'AI Robotics collaborator in Tokyo, Japan',
        relevanceScore: 92,
        previousEventName: 'Tokyo World Robotics Expo',
        meetingLocationName: 'Tokyo Big Sight'
      }
    ];
  }
};

// --- RELATIONSHIP GRAPH SERVICE ---
export const fetchRelationshipGraph = async (): Promise<RelationshipGraph> => {
  try {
    const res = await api.get<RelationshipGraph>('/graph');
    return res.data;
  } catch (err) {
    return {
      nodes: [
        { id: 'c_1', label: 'Ravi Kumar (Chennai)', type: 'CONTACT', category: 'COLLEGE' },
        { id: 'c_3', label: 'Sophia Anderson (London)', type: 'CONTACT', category: 'PROFESSIONAL' },
        { id: 'c_4', label: 'Kenji Takahashi (Tokyo)', type: 'CONTACT', category: 'COLLEGE' },
        { id: 'c_6', label: 'Fatima (Dubai)', type: 'CONTACT', category: 'FRIEND' },
        { id: 'e_1', label: 'London Tech Summit', type: 'EVENT' },
        { id: 'e_2', label: 'Tokyo Robotics Expo', type: 'EVENT' }
      ],
      edges: [
        { source: 'e_1', target: 'c_3', label: 'Attended By' },
        { source: 'e_2', target: 'c_4', label: 'Attended By' }
      ]
    };
  }
};

// --- ANALYTICS & INTERACTION SERVICES ---
export const fetchAnalytics = async () => {
  try {
    const res = await api.get('/analytics');
    return res.data;
  } catch (err) {
    return {
      totalContacts: mockContacts.length,
      categoryDistribution: {
        COLLEGE: 2,
        PROFESSIONAL: 2,
        FRIEND: 1,
        OFFICE: 1
      },
      totalInteractions: 6,
      averageRelationshipScore: 86.5
    };
  }
};

export const addInteractionToContact = async (contactId: number, interaction: Partial<Interaction>): Promise<Interaction> => {
  try {
    const res = await api.post<Interaction>(`/interactions/contact/${contactId}`, interaction);
    return res.data;
  } catch (err) {
    const contact = mockContacts.find(c => c.id === contactId);
    const newInter: Interaction = {
      id: Date.now(),
      interactionType: interaction.interactionType || 'MEETING',
      interactionDate: interaction.interactionDate || new Date().toISOString(),
      notes: interaction.notes || '',
      locationName: interaction.locationName || '',
      relatedEventName: interaction.relatedEventName || ''
    };
    if (contact) {
      if (!contact.interactions) contact.interactions = [];
      contact.interactions.unshift(newInter);
      contact.relationshipScore = Math.min(100, (contact.relationshipScore || 50) + 5);
    }
    return newInter;
  }
};

// --- NOTIFICATION SERVICES ---
export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const res = await api.get<NotificationItem[]>('/notifications');
    return res.data;
  } catch (err) {
    return mockNotifications;
  }
};

export const markNotificationRead = async (id: number): Promise<void> => {
  try {
    await api.put(`/notifications/${id}/read`);
  } catch (err) {
    const n = mockNotifications.find(x => x.id === id);
    if (n) n.isRead = true;
  }
};
