import {
  DashboardStats,
  Event,
  Order,
  Promoter,
  CheckInResult,
  AnalyticsData,
} from '../types';

const API_BASE = 'https://api.kartis.io/v1/organizer';

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Neon Nights - DJ Set',
    date: '2026-03-28T22:00:00Z',
    venue: 'The Black Pearl',
    ticketsSold: 342,
    totalTickets: 500,
    revenue: 17100,
    checkIns: 287,
    status: 'live',
  },
  {
    id: '2',
    title: 'Sunset Sessions Vol. 4',
    date: '2026-04-05T18:00:00Z',
    venue: 'Skybar Rooftop',
    ticketsSold: 189,
    totalTickets: 300,
    revenue: 9450,
    checkIns: 0,
    status: 'published',
  },
  {
    id: '3',
    title: 'Underground Techno',
    date: '2026-04-12T23:00:00Z',
    venue: 'Warehouse 42',
    ticketsSold: 78,
    totalTickets: 400,
    revenue: 3900,
    checkIns: 0,
    status: 'published',
  },
  {
    id: '4',
    title: 'Latin Heat Friday',
    date: '2026-03-21T21:00:00Z',
    venue: 'Club Havana',
    ticketsSold: 250,
    totalTickets: 250,
    revenue: 12500,
    checkIns: 243,
    status: 'completed',
  },
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    eventId: '1',
    eventTitle: 'Neon Nights - DJ Set',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    amount: 50,
    quantity: 1,
    status: 'completed',
    createdAt: '2026-03-27T14:30:00Z',
    ticketType: 'VIP',
  },
  {
    id: 'ORD-002',
    eventId: '1',
    eventTitle: 'Neon Nights - DJ Set',
    customerName: 'Marcus Chen',
    customerEmail: 'marcus@email.com',
    amount: 100,
    quantity: 2,
    status: 'completed',
    createdAt: '2026-03-27T12:15:00Z',
    ticketType: 'General',
  },
  {
    id: 'ORD-003',
    eventId: '2',
    eventTitle: 'Sunset Sessions Vol. 4',
    customerName: 'Emily Torres',
    customerEmail: 'emily@email.com',
    amount: 75,
    quantity: 3,
    status: 'pending',
    createdAt: '2026-03-27T10:45:00Z',
    ticketType: 'Early Bird',
  },
  {
    id: 'ORD-004',
    eventId: '1',
    eventTitle: 'Neon Nights - DJ Set',
    customerName: 'Jake Williams',
    customerEmail: 'jake@email.com',
    amount: 50,
    quantity: 1,
    status: 'refunded',
    createdAt: '2026-03-26T20:00:00Z',
    ticketType: 'General',
  },
];

const mockPromoters: Promoter[] = [
  {
    id: 'P-001',
    name: 'Alex Rivera',
    email: 'alex@promo.com',
    ticketsSold: 87,
    revenue: 4350,
    commission: 435,
    status: 'active',
    joinedAt: '2025-11-15',
  },
  {
    id: 'P-002',
    name: 'Jessica Nguyen',
    email: 'jessica@promo.com',
    ticketsSold: 64,
    revenue: 3200,
    commission: 320,
    status: 'active',
    joinedAt: '2026-01-03',
  },
  {
    id: 'P-003',
    name: 'David Kim',
    email: 'david@promo.com',
    ticketsSold: 45,
    revenue: 2250,
    commission: 225,
    status: 'active',
    joinedAt: '2026-02-10',
  },
  {
    id: 'P-004',
    name: 'Maria Santos',
    email: 'maria@promo.com',
    ticketsSold: 0,
    revenue: 0,
    commission: 0,
    status: 'pending',
    joinedAt: '2026-03-25',
  },
];

const mockDashboard: DashboardStats = {
  totalRevenue: 42950,
  ticketsSold: 859,
  totalCheckIns: 530,
  activeEvents: 3,
  revenueChange: 12.5,
  ticketsChange: 8.3,
};

const mockAnalytics: AnalyticsData = {
  revenueByDay: [
    { date: '03/21', amount: 2400 },
    { date: '03/22', amount: 3100 },
    { date: '03/23', amount: 2800 },
    { date: '03/24', amount: 4200 },
    { date: '03/25', amount: 3600 },
    { date: '03/26', amount: 5100 },
    { date: '03/27', amount: 4800 },
  ],
  ticketsByType: [
    { type: 'General', count: 450, revenue: 22500 },
    { type: 'VIP', count: 210, revenue: 15750 },
    { type: 'Early Bird', count: 120, revenue: 3600 },
    { type: 'Table', count: 79, revenue: 11850 },
  ],
  topPromoters: [
    { name: 'Alex Rivera', tickets: 87, revenue: 4350 },
    { name: 'Jessica Nguyen', tickets: 64, revenue: 3200 },
    { name: 'David Kim', tickets: 45, revenue: 2250 },
  ],
  conversionRate: 4.2,
  avgOrderValue: 62.5,
};

// Simulates API delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async getDashboard(): Promise<DashboardStats> {
    await delay(300);
    return mockDashboard;
  },

  async getEvents(): Promise<Event[]> {
    await delay(300);
    return mockEvents;
  },

  async getEvent(id: string): Promise<Event | undefined> {
    await delay(200);
    return mockEvents.find((e) => e.id === id);
  },

  async getOrders(): Promise<Order[]> {
    await delay(300);
    return mockOrders;
  },

  async refundOrder(orderId: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },

  async getPromoters(): Promise<Promoter[]> {
    await delay(300);
    return mockPromoters;
  },

  async approvePromoter(id: string): Promise<{ success: boolean }> {
    await delay(400);
    return { success: true };
  },

  async checkIn(ticketCode: string): Promise<CheckInResult> {
    await delay(300);
    return {
      valid: true,
      ticketId: 'TKT-' + ticketCode.slice(0, 6),
      customerName: 'Sarah Johnson',
      ticketType: 'VIP',
      eventTitle: 'Neon Nights - DJ Set',
      alreadyCheckedIn: false,
    };
  },

  async getAnalytics(): Promise<AnalyticsData> {
    await delay(400);
    return mockAnalytics;
  },
};
