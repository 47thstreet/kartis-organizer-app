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

export type RootTabParamList = {
  Dashboard: undefined;
  Events: undefined;
  CheckIn: undefined;
  Orders: undefined;
  Promoters: undefined;
  Analytics: undefined;
  Settings: undefined;
};
