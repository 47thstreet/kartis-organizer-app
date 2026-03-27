import {
  DashboardStats,
  Event,
  Order,
  Promoter,
  CheckInResult,
  AnalyticsData,
  Webhook,
  VenueMap,
  LiveStatsData,
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

  async getWebhooks(): Promise<Webhook[]> {
    await delay(300);
    return [
      {
        id: 'wh-1',
        name: 'Ticket Purchase',
        url: 'https://hooks.example.com/ticket-sold',
        events: ['ticket.purchased', 'ticket.refunded'],
        active: true,
        lastTriggered: '2026-03-27T14:30:00Z',
        failCount: 0,
        secret: 'whsec_****',
        createdAt: '2026-02-15',
      },
      {
        id: 'wh-2',
        name: 'Check-In Sync',
        url: 'https://hooks.example.com/checkin',
        events: ['checkin.completed'],
        active: true,
        lastTriggered: '2026-03-27T22:15:00Z',
        failCount: 0,
        secret: 'whsec_****',
        createdAt: '2026-03-01',
      },
      {
        id: 'wh-3',
        name: 'CRM Integration',
        url: 'https://crm.example.com/webhook',
        events: ['ticket.purchased', 'order.refunded', 'promoter.applied'],
        active: false,
        lastTriggered: '2026-03-20T10:00:00Z',
        failCount: 3,
        secret: 'whsec_****',
        createdAt: '2026-01-20',
      },
    ];
  },

  async toggleWebhook(id: string): Promise<{ success: boolean }> {
    await delay(300);
    return { success: true };
  },

  async deleteWebhook(id: string): Promise<{ success: boolean }> {
    await delay(300);
    return { success: true };
  },

  async testWebhook(id: string): Promise<{ success: boolean; statusCode: number }> {
    await delay(800);
    return { success: true, statusCode: 200 };
  },

  async getVenueMap(): Promise<VenueMap> {
    await delay(300);
    return {
      id: 'vm-1',
      name: 'The Black Pearl - Main Floor',
      width: 400,
      height: 600,
      zones: [
        { id: 'z-1', name: 'Main Stage', type: 'stage', x: 100, y: 20, width: 200, height: 80, color: '#8B5CF6' },
        { id: 'z-2', name: 'VIP Area', type: 'vip', x: 20, y: 140, width: 120, height: 100, capacity: 60, color: '#F59E0B' },
        { id: 'z-3', name: 'Dance Floor', type: 'general', x: 160, y: 140, width: 220, height: 160, capacity: 300, color: '#6D28D9' },
        { id: 'z-4', name: 'Main Bar', type: 'bar', x: 20, y: 280, width: 120, height: 60, color: '#10B981' },
        { id: 'z-5', name: 'Side Bar', type: 'bar', x: 300, y: 340, width: 80, height: 60, color: '#10B981' },
        { id: 'z-6', name: 'Entrance', type: 'entrance', x: 160, y: 520, width: 80, height: 40, color: '#3B82F6' },
        { id: 'z-7', name: 'VIP Lounge', type: 'vip', x: 20, y: 400, width: 140, height: 80, capacity: 40, color: '#F59E0B' },
        { id: 'z-8', name: 'Backstage', type: 'backstage', x: 300, y: 20, width: 80, height: 80, color: '#6B7280' },
        { id: 'z-9', name: 'Restrooms', type: 'restroom', x: 300, y: 440, width: 80, height: 50, color: '#9CA3AF' },
      ],
    };
  },

  async saveVenueMap(map: VenueMap): Promise<{ success: boolean }> {
    await delay(400);
    return { success: true };
  },

  async getLiveStats(eventId: string): Promise<LiveStatsData> {
    await delay(300);
    return {
      eventId: '1',
      eventTitle: 'Neon Nights - DJ Set',
      currentAttendance: 287,
      totalCapacity: 500,
      checkInsPerMinute: 4.2,
      revenueToday: 17100,
      doorRevenue: 2400,
      barRevenue: 5800,
      peakHour: '11:00 PM',
      timeline: [
        { time: '9PM', checkIns: 12, revenue: 600 },
        { time: '10PM', checkIns: 45, revenue: 2250 },
        { time: '10:30', checkIns: 68, revenue: 3400 },
        { time: '11PM', checkIns: 89, revenue: 4450 },
        { time: '11:30', checkIns: 48, revenue: 2400 },
        { time: '12AM', checkIns: 25, revenue: 4000 },
      ],
      zoneOccupancy: [
        { zone: 'Dance Floor', current: 180, capacity: 300 },
        { zone: 'VIP Area', current: 52, capacity: 60 },
        { zone: 'VIP Lounge', current: 28, capacity: 40 },
        { zone: 'Main Bar', current: 15, capacity: 30 },
        { zone: 'Side Bar', current: 12, capacity: 20 },
      ],
    };
  },
};
