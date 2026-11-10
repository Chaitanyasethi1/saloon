export type UserRole = 'customer' | 'salon_owner' | 'staff' | 'super_admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  salonId?: string; // For owners and staff
  createdAt: string;
}

export type TokenType = 'online' | 'walk_in' | 'priority';

export type TokenStatus =
  | 'booked'
  | 'checked_in'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'skipped';

export interface SalonHours {
  id?: string;
  salonId: string;
  weekday: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  breakStart?: string;
  breakEnd?: string;
  isClosed: boolean;
}

export interface Chair {
  id: string;
  salonId: string;
  chairNumber: number;
  name: string;
  isActive: boolean;
  assignedStaffId?: string;
  currentToken?: Token;
}

export interface Service {
  id: string;
  salonId: string;
  name: string;
  category: 'Hair' | 'Color' | 'Spa' | 'Beard' | 'Bridal' | 'Nails' | 'Grooming' | 'Keratin';
  durationMin: number;
  price: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  salonId: string;
  profileId?: string;
  name: string;
  roleTitle: string;
  specialties: string[];
  chairId?: string;
  avatarUrl?: string;
  rating: number;
  isActive: boolean;
}

export interface TokenService {
  id: string;
  tokenId: string;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMin: number;
}

export interface Token {
  id: string;
  salonId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  tokenNo: number;
  date: string; // YYYY-MM-DD
  slotStart?: string; // HH:mm
  slotEnd?: string; // HH:mm
  type: TokenType;
  status: TokenStatus;
  chairId?: string;
  staffId?: string;
  estWaitMin: number;
  qrCode?: string;
  notes?: string;
  checkedInAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  services: TokenService[];
  salon?: Salon;
  staff?: Staff;
  chair?: Chair;
}

export interface SalonSettings {
  autoCallNext: boolean;
  cancellationGraceMins: number;
  noShowGraceMins: number;
  delayNoticeMins: number;
  allowWalkIns: boolean;
  soundChime: boolean;
  maxDailyCapacity: number;
}

export interface Salon {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  genderType: 'unisex' | 'men' | 'women';
  coverUrl: string;
  gallery: string[];
  ratingAvg: number;
  ratingCount: number;
  chairsCount: number;
  status: 'pending' | 'approved' | 'suspended';
  settings: SalonSettings;
  services?: Service[];
  staff?: Staff[];
  chairs?: Chair[];
  hours?: SalonHours[];
  currentQueueLength?: number;
  estWaitTimeMin?: number;
  nowServingTokenNo?: number | null;
}

export interface Review {
  id: string;
  salonId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  photos?: string[];
  ownerReply?: string;
  ownerRepliedAt?: string;
  createdAt: string;
}

export interface FavoriteSalon {
  id: string;
  customerId: string;
  salonId: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'queue_alert' | 'your_turn' | 'delayed' | 'cancelled';
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

