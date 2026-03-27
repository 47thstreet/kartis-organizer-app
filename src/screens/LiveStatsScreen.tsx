import React, { useEffect, useState, useRef } from 'react';
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
import { LiveStatsData } from '../types';

const PulseDot = () => {
  return (
    <View style={styles.pulseContainer}>
      <View style={styles.pulseDot} />
      <View style={styles.pulseRing} />
    </View>
  );
};

const BigStat = ({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.bigStat}>
    <Ionicons name={icon} size={22} color={colors.violet} />
    <Text style={styles.bigStatValue}>{value}</Text>
    <Text style={styles.bigStatLabel}>{label}</Text>
    {sub && <Text style={styles.bigStatSub}>{sub}</Text>}
  </View>
);

const OccupancyBar = ({
  zone,
  current,
  capacity,
}: {
  zone: string;
  current: number;
  capacity: number;
}) => {
  const pct = capacity > 0 ? (current / capacity) * 100 : 0;
  const isHigh = pct > 80;
  return (
    <View style={styles.occupancyRow}>
      <View style={styles.occupancyInfo}>
        <Text style={styles.occupancyZone}>{zone}</Text>
        <Text style={styles.occupancyCount}>
          {current}/{capacity}
        </Text>
      </View>
      <View style={styles.occupancyBarTrack}>
        <View
          style={[
            styles.occupancyBarFill,
            {
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: isHigh ? colors.warning : colors.violet,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.occupancyPct,
          { color: isHigh ? colors.warning : colors.textSecondary },
        ]}
      >
        {Math.round(pct)}%
      </Text>
    </View>
  );
};

const TimelineChart = ({
  data,
}: {
  data: { time: string; checkIns: number; revenue: number }[];
}) => {
  const maxCheckIns = Math.max(...data.map((d) => d.checkIns));
  return (
    <View style={styles.timelineCard}>
      <Text style={styles.sectionTitle}>Check-In Timeline</Text>
      <View style={styles.timelineBars}>
        {data.map((item, i) => {
          const height = maxCheckIns > 0 ? (item.checkIns / maxCheckIns) * 100 : 0;
          return (
            <View key={i} style={styles.timelineItem}>
              <Text style={styles.timelineValue}>{item.checkIns}</Text>
              <View style={styles.timelineBarTrack}>
                <View style={[styles.timelineBarFill, { height }]} />
              </View>
              <Text style={styles.timelineLabel}>{item.time}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function LiveStatsScreen() {
  const [data, setData] = useState<LiveStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = async () => {
    const stats = await api.getLiveStats('1');
    setData(stats);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));

    // Auto-refresh every 15 seconds for live data
    intervalRef.current = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  const attendancePct =
    data.totalCapacity > 0
      ? Math.round((data.currentAttendance / data.totalCapacity) * 100)
      : 0;

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
      <View style={styles.header}>
        <View>
          <View style={styles.liveRow}>
            <PulseDot />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
          <Text style={styles.title}>Live Stats</Text>
        </View>
        <Text style={styles.autoRefresh}>Auto-refreshing</Text>
      </View>

      <View style={styles.eventBanner}>
        <Ionicons name="musical-notes" size={20} color={colors.violet} />
        <Text style={styles.eventTitle}>{data.eventTitle}</Text>
      </View>

      {/* Attendance gauge */}
      <View style={styles.gaugeCard}>
        <Text style={styles.gaugeLabel}>Current Attendance</Text>
        <View style={styles.gaugeRow}>
          <Text style={styles.gaugeValue}>{data.currentAttendance}</Text>
          <Text style={styles.gaugeSeparator}>/</Text>
          <Text style={styles.gaugeTotal}>{data.totalCapacity}</Text>
        </View>
        <View style={styles.gaugeBar}>
          <View style={[styles.gaugeFill, { width: `${attendancePct}%` }]} />
        </View>
        <Text style={styles.gaugePct}>{attendancePct}% capacity</Text>
      </View>

      {/* Key metrics */}
      <View style={styles.statsGrid}>
        <BigStat
          label="Check-ins/min"
          value={data.checkInsPerMinute.toFixed(1)}
          icon="speedometer-outline"
        />
        <BigStat
          label="Revenue Today"
          value={`$${data.revenueToday.toLocaleString()}`}
          icon="cash-outline"
        />
        <BigStat
          label="Door Revenue"
          value={`$${data.doorRevenue.toLocaleString()}`}
          icon="ticket-outline"
        />
        <BigStat
          label="Bar Revenue"
          value={`$${data.barRevenue.toLocaleString()}`}
          icon="beer-outline"
        />
      </View>

      <View style={styles.peakCard}>
        <Ionicons name="flame" size={20} color={colors.warning} />
        <Text style={styles.peakText}>
          Peak hour: <Text style={styles.peakValue}>{data.peakHour}</Text>
        </Text>
      </View>

      <TimelineChart data={data.timeline} />

      {/* Zone occupancy */}
      <View style={styles.occupancyCard}>
        <Text style={styles.sectionTitle}>Zone Occupancy</Text>
        {data.zoneOccupancy.map((zone, i) => (
          <OccupancyBar
            key={i}
            zone={zone.zone}
            current={zone.current}
            capacity={zone.capacity}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pulseContainer: { width: 12, height: 12, justifyContent: 'center', alignItems: 'center' },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    position: 'absolute',
  },
  pulseRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.error,
    opacity: 0.5,
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
    letterSpacing: 1.5,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  autoRefresh: { fontSize: 11, color: colors.textMuted, marginTop: 8 },
  eventBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.violetMuted,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.violetDark,
  },
  eventTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  gaugeCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gaugeLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  gaugeValue: { fontSize: 48, fontWeight: '800', color: colors.text },
  gaugeSeparator: {
    fontSize: 28,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  gaugeTotal: { fontSize: 28, fontWeight: '600', color: colors.textMuted },
  gaugeBar: {
    width: '100%',
    height: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: colors.violet,
    borderRadius: 5,
  },
  gaugePct: { fontSize: 13, color: colors.textSecondary },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  bigStat: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bigStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  bigStatLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  bigStatSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  peakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(245,158,11,0.1)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  peakText: { fontSize: 14, color: colors.textSecondary },
  peakValue: { fontWeight: '700', color: colors.warning },
  timelineCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  timelineBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timelineItem: { alignItems: 'center', flex: 1 },
  timelineValue: { fontSize: 10, color: colors.textSecondary, marginBottom: 4 },
  timelineBarTrack: {
    width: 24,
    height: 100,
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  timelineBarFill: {
    width: '100%',
    backgroundColor: colors.violet,
    borderRadius: 6,
  },
  timelineLabel: { fontSize: 10, color: colors.textMuted, marginTop: 6 },
  occupancyCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  occupancyInfo: { width: 110 },
  occupancyZone: { fontSize: 13, fontWeight: '500', color: colors.text },
  occupancyCount: { fontSize: 11, color: colors.textMuted },
  occupancyBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  occupancyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  occupancyPct: { fontSize: 12, fontWeight: '600', width: 36, textAlign: 'right' },
});
