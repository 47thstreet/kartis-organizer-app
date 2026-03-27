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
import { Order } from '../types';

const statusConfig: Record<
  Order['status'],
  { color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  completed: { color: colors.success, icon: 'checkmark-circle' },
  refunded: { color: colors.warning, icon: 'return-down-back' },
  pending: { color: colors.violetLight, icon: 'time' },
  failed: { color: colors.error, icon: 'close-circle' },
};

const OrderCard = ({
  order,
  onRefund,
}: {
  order: Order;
  onRefund: (id: string) => void;
}) => {
  const config = statusConfig[order.status];
  const date = new Date(order.createdAt);

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>
            {date.toLocaleDateString()} at{' '}
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Customer</Text>
          <Text style={styles.orderValue}>{order.customerName}</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Event</Text>
          <Text style={styles.orderValue} numberOfLines={1}>
            {order.eventTitle}
          </Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Ticket</Text>
          <Text style={styles.orderValue}>
            {order.quantity}x {order.ticketType}
          </Text>
        </View>
        <View style={[styles.orderRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.orderLabel}>Amount</Text>
          <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
        </View>
      </View>

      {order.status === 'completed' && (
        <TouchableOpacity
          style={styles.refundButton}
          onPress={() => onRefund(order.id)}
        >
          <Ionicons name="return-down-back" size={16} color={colors.warning} />
          <Text style={styles.refundText}>Process Refund</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    const data = await api.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleRefund = (orderId: string) => {
    Alert.alert('Process Refund', `Refund order ${orderId}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Refund',
        style: 'destructive',
        onPress: async () => {
          await api.refundOrder(orderId);
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId ? { ...o, status: 'refunded' as const } : o
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.count}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onRefund={handleRefund} />
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
  count: { fontSize: 14, color: colors.textSecondary },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: { fontSize: 14, fontWeight: '600', color: colors.text },
  orderDate: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  orderBody: {},
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderLabel: { fontSize: 13, color: colors.textSecondary },
  orderValue: { fontSize: 13, fontWeight: '500', color: colors.text, maxWidth: '60%' },
  orderAmount: { fontSize: 16, fontWeight: '700', color: colors.violet },
  refundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  refundText: { fontSize: 14, fontWeight: '600', color: colors.warning },
});
