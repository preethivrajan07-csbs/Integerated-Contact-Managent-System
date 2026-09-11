export type Category = 
  | 'FAMILY'
  | 'FRIEND'
  | 'OFFICE'
  | 'DOCTOR'
  | 'EMERGENCY'
  | 'COLLEGE'
  | 'PROFESSIONAL'
  | 'OTHER';

export type PrivacyLevel = 'PRIVATE' | 'APPROXIMATE' | 'PUBLIC';

export type InteractionType = 
  | 'MEETING'
  | 'CALL'
  | 'EMAIL'
  | 'MESSAGE'
  | 'EVENT'
  | 'PROJECT_DISCUSSION'
  | 'OTHER';

export interface MeetingLocation {
  id?: number;
  locationName: string;
  address?: string;
  latitude: number;
  longitude: number;
  meetingDate?: string;
  description?: string;
  relatedEventName?: string;
}

export interface Interaction {
  id?: number;
  interactionType: InteractionType;
  interactionDate?: string;
  notes?: string;
  locationName?: string;
  relatedEventName?: string;
}

export interface Contact {
  id?: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  category: Category;
  notes?: string;
  relationshipScore?: number;
  homeLatitude?: number;
  homeLongitude?: number;
  homeCityArea?: string;
  privacyLevel?: PrivacyLevel;
  allowNearbyDiscovery?: boolean;
  meetingLocations?: MeetingLocation[];
  interactions?: Interaction[];
  createdDate?: string;
  updatedDate?: string;
}

export interface Event {
  id?: number;
  eventName: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  participants?: Contact[];
}

export interface NearbyContact {
  contactId: number;
  fullName: string;
  avatarUrl?: string;
  category: Category;
  approximateDistanceKm: number;
  approximateArea: string;
  displayLatitude: number;
  displayLongitude: number;
  isExactLocationHidden: boolean;
}

export interface Suggestion {
  contactId: number;
  fullName: string;
  avatarUrl?: string;
  category: Category;
  rationale: string;
  relevanceScore: number;
  previousEventName?: string;
  meetingLocationName?: string;
}

export interface DuplicateCheckResponse {
  duplicate: boolean;
  matchedBy?: 'PHONE' | 'EMAIL';
  existingContact?: Contact;
  message: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'EVENT_REMINDER' | 'FOLLOWUP_REMINDER' | 'DUPLICATE_WARNING' | 'PRIVACY_ALERT' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'CONTACT' | 'EVENT' | 'LOCATION' | 'INTERACTION';
  category?: string;
  avatar?: string;
  date?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface RelationshipGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
