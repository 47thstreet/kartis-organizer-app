import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { Event } from '../types';

const statusColors: Record<Event['status'], string> = {
  draft: colors.textMuted,
  published: colors.violetLight,
  live: colors.error,
  completed: colors.success,
  cancelled: colors.textMuted,
};

const EventCard = ({ event }: { event: Event }) => {
  const date = new Date(event.date);
  const progress = event.totalTickets > 0 ? event.ticketsSold / event.totalTickets : 0;

  return (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.7}>
      <View style={styles.eventHeader}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateMonth}>
            {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </Text>
          <Text style={styles.dateDay}>{date.getDate()}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.venueText}>{event.venue}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[event.status] + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: statusColors[event.status] }]}
          >
            {event.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.eventStats}>
        <View style={styles.eventStat}>
          <Text style={styles.eventStatValue}>{event.ticketsSold}</Text>
          <Text style={styles.eventStatLabel}>Sold</Text>
        </View>
        <View style={styles.eventStat}>
          <Text style={styles.eventStatValue}>${event.revenue.toLocaleString()}</Text>
          <Text style={styles.eventStatLabel}>Revenue</Text>
        </View>
        <View style={styles.eventStat}>
          <Text style={styles.eventStatValue}>{event.checkIns}</Text>
          <Text style={styles.eventStatLabel}>Check-ins</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.capacityText}>
        {event.ticketsSold}/{event.totalTickets} tickets
      </Text>
    </TouchableOpacity>
  );
};

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    const data = await api.getEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Create Event', 'Event creation form would open here.')}
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.violet}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBlock: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.violet,
    letterSpacing: 0.5,
  },
  dateDay: { fontSize: 18, fontWeight: '700', color: colors.violet },
  eventInfo: { flex: 1, marginRight: 8 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  venueText: { fontSize: 13, color: colors.textSecondary },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventStat: { alignItems: 'center', flex: 1 },
  eventStatValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  eventStatLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.violet,
    borderRadius: 2,
  },
  capacityText: { fontSize: 11, color: colors.textMuted, textAlign: 'right' },
});
