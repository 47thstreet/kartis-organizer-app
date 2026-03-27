import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { DashboardStats, Event } from '../types';

const StatCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: number;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.violet} />
      </View>
      {change !== undefined && (
        <View
          style={[
            styles.changeBadge,
            { backgroundColor: change >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
          ]}
        >
          <Ionicons
            name={change >= 0 ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={change >= 0 ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.changeText,
              { color: change >= 0 ? colors.success : colors.error },
            ]}
          >
            {Math.abs(change)}%
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const LiveEventCard = ({ event }: { event: Event }) => {
  const progress = event.totalTickets > 0 ? event.ticketsSold / event.totalTickets : 0;
  return (
    <View style={styles.liveEventCard}>
      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <Text style={styles.liveEventTitle}>{event.title}</Text>
      <Text style={styles.liveEventVenue}>{event.venue}</Text>
      <View style={styles.liveStats}>
        <View style={styles.liveStat}>
          <Text style={styles.liveStatValue}>{event.ticketsSold}</Text>
          <Text style={styles.liveStatLabel}>Sold</Text>
        </View>
        <View style={styles.liveStat}>
          <Text style={styles.liveStatValue}>{event.checkIns}</Text>
          <Text style={styles.liveStatLabel}>Check-ins</Text>
        </View>
        <View style={styles.liveStat}>
          <Text style={styles.liveStatValue}>${event.revenue.toLocaleString()}</Text>
          <Text style={styles.liveStatLabel}>Revenue</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {Math.round(progress * 100)}% capacity
      </Text>
    </View>
  );
};

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [dashData, eventsData] = await Promise.all([
      api.getDashboard(),
      api.getEvents(),
    ]);
    setStats(dashData);
    setEvents(eventsData);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  const liveEvents = events.filter((e) => e.status === 'live');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.violet}
        />
      }
    >
      <Text style={styles.greeting}>Welcome back</Text>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.statsGrid}>
        <StatCard
          title="Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() ?? '0'}`}
          change={stats?.revenueChange}
          icon="cash-outline"
        />
        <StatCard
          title="Tickets Sold"
          value={stats?.ticketsSold?.toLocaleString() ?? '0'}
          change={stats?.ticketsChange}
          icon="ticket-outline"
        />
        <StatCard
          title="Check-ins"
          value={stats?.totalCheckIns?.toLocaleString() ?? '0'}
          icon="scan-outline"
        />
        <StatCard
          title="Active Events"
          value={stats?.activeEvents?.toString() ?? '0'}
          icon="calendar-outline"
        />
      </View>

      {liveEvents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Live Now</Text>
          {liveEvents.map((event) => (
            <LiveEventCard key={event.id} event={event} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60 },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '48%' as any,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: { fontSize: 11, fontWeight: '600' },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: { fontSize: 13, color: colors.textSecondary },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  liveEventCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.violetDark,
    marginBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
    letterSpacing: 1,
  },
  liveEventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  liveEventVenue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  liveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveStat: { alignItems: 'center' },
  liveStatValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  liveStatLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.violet,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
