import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const SettingRow = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={20} color={colors.violet} />
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <View style={styles.settingRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </View>
  </TouchableOpacity>
);

const ToggleRow = ({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={20} color={colors.violet} />
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.surfaceLight, true: colors.violetDark }}
      thumbColor={value ? colors.violet : colors.textMuted}
    />
  </View>
);

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [checkInAlerts, setCheckInAlerts] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>KO</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Kartis Organizer</Text>
          <Text style={styles.profileEmail}>admin@kartis.io</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={20} color={colors.violet} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.section}>
        <SettingRow
          icon="person-outline"
          label="Profile"
          onPress={() => Alert.alert('Profile', 'Profile editor would open here.')}
        />
        <SettingRow
          icon="business-outline"
          label="Venue Details"
          onPress={() => Alert.alert('Venue', 'Venue editor would open here.')}
        />
        <SettingRow
          icon="card-outline"
          label="Billing"
          value="Active"
          onPress={() => Alert.alert('Billing', 'Billing settings would open here.')}
        />
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.section}>
        <ToggleRow
          icon="notifications-outline"
          label="Push Notifications"
          value={pushEnabled}
          onToggle={setPushEnabled}
        />
        <ToggleRow
          icon="mail-outline"
          label="Email Notifications"
          value={emailEnabled}
          onToggle={setEmailEnabled}
        />
        <ToggleRow
          icon="cash-outline"
          label="Sale Alerts"
          value={salesAlerts}
          onToggle={setSalesAlerts}
        />
        <ToggleRow
          icon="scan-outline"
          label="Check-in Alerts"
          value={checkInAlerts}
          onToggle={setCheckInAlerts}
        />
      </View>

      <Text style={styles.sectionTitle}>General</Text>
      <View style={styles.section}>
        <SettingRow
          icon="shield-checkmark-outline"
          label="Security"
          onPress={() => Alert.alert('Security', 'Security settings would open here.')}
        />
        <SettingRow
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => Alert.alert('Help', 'Support center would open here.')}
        />
        <SettingRow
          icon="document-text-outline"
          label="Terms of Service"
          onPress={() => Alert.alert('Terms', 'Terms of service would open here.')}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive' },
          ])
        }
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Kartis Organizer v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInitials: { fontSize: 20, fontWeight: '700', color: colors.violet },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '600', color: colors.text },
  profileEmail: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: { flex: 1, fontSize: 15, color: colors.text },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: { fontSize: 14, color: colors.textMuted },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: 20,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
  version: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
