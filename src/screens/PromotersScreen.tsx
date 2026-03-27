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
import { Promoter } from '../types';

const PromoterCard = ({
  promoter,
  onApprove,
}: {
  promoter: Promoter;
  onApprove: (id: string) => void;
}) => {
  const initials = promoter.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{promoter.name}</Text>
          <Text style={styles.email}>{promoter.email}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                promoter.status === 'active'
                  ? 'rgba(16,185,129,0.15)'
                  : promoter.status === 'pending'
                  ? 'rgba(139,92,246,0.15)'
                  : 'rgba(107,114,128,0.15)',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  promoter.status === 'active'
                    ? colors.success
                    : promoter.status === 'pending'
                    ? colors.violet
                    : colors.textMuted,
              },
            ]}
          >
            {promoter.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {promoter.status === 'active' && (
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{promoter.ticketsSold}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>${promoter.revenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              ${promoter.commission.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Commission</Text>
          </View>
        </View>
      )}

      {promoter.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApprove(promoter.id)}
          >
            <Ionicons name="checkmark" size={18} color={colors.text} />
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Ionicons name="close" size={18} color={colors.error} />
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PromotersScreen() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPromoters = async () => {
    const data = await api.getPromoters();
    setPromoters(data);
  };

  useEffect(() => {
    loadPromoters().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPromoters();
    setRefreshing(false);
  };

  const handleApprove = (id: string) => {
    Alert.alert('Approve Promoter', 'Approve this promoter application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          await api.approvePromoter(id);
          setPromoters((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, status: 'active' as const } : p
            )
          );
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  const pending = promoters.filter((p) => p.status === 'pending');
  const active = promoters.filter((p) => p.status === 'active');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promoters</Text>
        <Text style={styles.count}>
          {active.length} active, {pending.length} pending
        </Text>
      </View>

      <FlatList
        data={[...pending, ...active]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PromoterCard promoter={item} onApprove={handleApprove} />
        )}
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
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  count: { fontSize: 13, color: colors.textSecondary },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.violet },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  email: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.violet,
  },
  approveText: { fontSize: 14, fontWeight: '600', color: colors.text },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  declineText: { fontSize: 14, fontWeight: '600', color: colors.error },
});
