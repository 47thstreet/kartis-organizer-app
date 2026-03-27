export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  checkIns: number;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  imageUrl?: string;
}

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  quantity: number;
  status: 'completed' | 'refunded' | 'pending' | 'failed';
  createdAt: string;
  ticketType: string;
}

export interface Promoter {
  id: string;
  name: string;
  email: string;
  ticketsSold: number;
  revenue: number;
  commission: number;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  totalCheckIns: number;
  activeEvents: number;
  revenueChange: number;
  ticketsChange: number;
}

export interface CheckInResult {
  valid: boolean;
  ticketId: string;
  customerName: string;
  ticketType: string;
  eventTitle: string;
  alreadyCheckedIn: boolean;
}

export interface AnalyticsData {
  revenueByDay: { date: string; amount: number }[];
  ticketsByType: { type: string; count: number; revenue: number }[];
  topPromoters: { name: string; tickets: number; revenue: number }[];
  conversionRate: number;
  avgOrderValue: number;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
  failCount: number;
  secret: string;
  createdAt: string;
}

export interface VenueZone {
  id: string;
  name: string;
  type: 'stage' | 'bar' | 'vip' | 'general' | 'entrance' | 'exit' | 'restroom' | 'backstage';
  x: number;
  y: number;
  width: number;
  height: number;
  capacity?: number;
  color: string;
}

export interface VenueMap {
  id: string;
  name: string;
  width: number;
  height: number;
  zones: VenueZone[];
}

export interface LiveStatsData {
  eventId: string;
  eventTitle: string;
  currentAttendance: number;
  totalCapacity: number;
  checkInsPerMinute: number;
  revenueToday: number;
  doorRevenue: number;
  barRevenue: number;
  peakHour: string;
  timeline: { time: string; checkIns: number; revenue: number }[];
  zoneOccupancy: { zone: string; current: number; capacity: number }[];
}

export type RootTabParamList = {
  Dashboard: undefined;
  Events: undefined;
  CheckIn: undefined;
  Orders: undefined;
  Promoters: undefined;
  Analytics: undefined;
  Webhooks: undefined;
  VenueMap: undefined;
  LiveStats: undefined;
  Settings: undefined;
};
