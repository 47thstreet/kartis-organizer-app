import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { AnalyticsData } from '../types';

const { width: screenWidth } = Dimensions.get('window');

const MetricCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.metricCard}>
    <Ionicons name={icon} size={20} color={colors.violet} />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const BarChart = ({
  data,
}: {
  data: { date: string; amount: number }[];
}) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Revenue (7 Days)</Text>
      <View style={styles.barContainer}>
        {data.map((item, i) => {
          const height = maxAmount > 0 ? (item.amount / maxAmount) * 120 : 0;
          return (
            <View key={i} style={styles.barItem}>
              <Text style={styles.barValue}>${(item.amount / 1000).toFixed(1)}k</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.date}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const TicketBreakdown = ({
  data,
}: {
  data: { type: string; count: number; revenue: number }[];
}) => {
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Tickets by Type</Text>
      {data.map((item, i) => {
        const pct = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
        return (
          <View key={i} style={styles.breakdownRow}>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownType}>{item.type}</Text>
              <Text style={styles.breakdownCount}>
                {item.count} tickets -- ${item.revenue.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[styles.breakdownFill, { width: `${pct}%` }]}
              />
            </View>
            <Text style={styles.breakdownPct}>{Math.round(pct)}%</Text>
          </View>
        );
      })}
    </View>
  );
};

const TopPromotersCard = ({
  data,
}: {
  data: { name: string; tickets: number; revenue: number }[];
}) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Top Promoters</Text>
    {data.map((item, i) => (
      <View key={i} style={styles.promoterRow}>
        <View style={styles.promoterRank}>
          <Text style={styles.promoterRankText}>{i + 1}</Text>
        </View>
        <View style={styles.promoterInfo}>
          <Text style={styles.promoterName}>{item.name}</Text>
          <Text style={styles.promoterStats}>
            {item.tickets} tickets -- ${item.revenue.toLocaleString()}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

export default function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const analytics = await api.getAnalytics();
    setData(analytics);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
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
      <Text style={styles.title}>Analytics</Text>

      <View style={styles.metricsRow}>
        <MetricCard
          label="Conversion Rate"
          value={`${data.conversionRate}%`}
          icon="trending-up"
        />
        <MetricCard
          label="Avg. Order Value"
          value={`$${data.avgOrderValue.toFixed(0)}`}
          icon="cart-outline"
        />
      </View>

      <BarChart data={data.revenueByDay} />
      <TicketBreakdown data={data.ticketsByType} />
      <TopPromotersCard data={data.topPromoters} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  metricLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barItem: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, color: colors.textSecondary, marginBottom: 6 },
  barTrack: {
    width: 28,
    height: 120,
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.violet,
    borderRadius: 6,
  },
  barLabel: { fontSize: 10, color: colors.textMuted, marginTop: 6 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownInfo: { width: 120 },
  breakdownType: { fontSize: 14, fontWeight: '500', color: colors.text },
  breakdownCount: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  breakdownBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: colors.violet,
    borderRadius: 4,
  },
  breakdownPct: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  promoterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoterRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoterRankText: { fontSize: 14, fontWeight: '700', color: colors.violet },
  promoterInfo: { flex: 1 },
  promoterName: { fontSize: 14, fontWeight: '600', color: colors.text },
  promoterStats: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
