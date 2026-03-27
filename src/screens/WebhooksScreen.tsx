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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { Webhook } from '../types';

const WebhookCard = ({
  webhook,
  onToggle,
  onTest,
  onDelete,
}: {
  webhook: Webhook;
  onToggle: (id: string) => void;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const lastTriggered = webhook.lastTriggered
    ? new Date(webhook.lastTriggered)
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: webhook.active ? colors.success : colors.textMuted },
            ]}
          />
          <Text style={styles.cardTitle}>{webhook.name}</Text>
        </View>
        <Switch
          value={webhook.active}
          onValueChange={() => onToggle(webhook.id)}
          trackColor={{ false: colors.surfaceLight, true: colors.violetDark }}
          thumbColor={webhook.active ? colors.violet : colors.textMuted}
        />
      </View>

      <View style={styles.urlRow}>
        <Ionicons name="link-outline" size={14} color={colors.textMuted} />
        <Text style={styles.urlText} numberOfLines={1}>
          {webhook.url}
        </Text>
      </View>

      <View style={styles.eventsRow}>
        {webhook.events.map((evt, i) => (
          <View key={i} style={styles.eventTag}>
            <Text style={styles.eventTagText}>{evt}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metaRow}>
        {lastTriggered && (
          <Text style={styles.metaText}>
            Last fired: {lastTriggered.toLocaleDateString()}{' '}
            {lastTriggered.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
        {webhook.failCount > 0 && (
          <View style={styles.failBadge}>
            <Ionicons name="warning" size={12} color={colors.error} />
            <Text style={styles.failText}>{webhook.failCount} failures</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onTest(webhook.id)}
        >
          <Ionicons name="flash-outline" size={16} color={colors.violet} />
          <Text style={styles.actionText}>Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert('Edit Webhook', 'Webhook editor would open here.')
          }
        >
          <Ionicons name="create-outline" size={16} color={colors.violet} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteAction]}
          onPress={() => onDelete(webhook.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function WebhooksScreen() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWebhooks = async () => {
    const data = await api.getWebhooks();
    setWebhooks(data);
  };

  useEffect(() => {
    loadWebhooks().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWebhooks();
    setRefreshing(false);
  };

  const handleToggle = async (id: string) => {
    await api.toggleWebhook(id);
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const handleTest = async (id: string) => {
    const result = await api.testWebhook(id);
    Alert.alert(
      result.success ? 'Test Passed' : 'Test Failed',
      result.success
        ? `Webhook responded with status ${result.statusCode}.`
        : 'Webhook did not respond successfully.'
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Webhook', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.deleteWebhook(id);
          setWebhooks((prev) => prev.filter((w) => w.id !== id));
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
        <Text style={styles.title}>Webhooks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            Alert.alert('New Webhook', 'Webhook creation form would open here.')
          }
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={webhooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WebhookCard
            webhook={item}
            onToggle={handleToggle}
            onTest={handleTest}
            onDelete={handleDelete}
          />
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
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="git-network-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No webhooks configured</Text>
            <Text style={styles.emptySubtext}>
              Add a webhook to receive real-time event notifications.
            </Text>
          </View>
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 8,
  },
  urlText: { fontSize: 12, color: colors.textSecondary, flex: 1, fontFamily: 'Courier' },
  eventsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  eventTag: {
    backgroundColor: colors.violetMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventTagText: { fontSize: 11, color: colors.violetLight, fontWeight: '500' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: { fontSize: 11, color: colors.textMuted },
  failBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  failText: { fontSize: 11, color: colors.error, fontWeight: '500' },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.violetMuted,
  },
  deleteAction: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  actionText: { fontSize: 13, fontWeight: '600', color: colors.violet },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});
