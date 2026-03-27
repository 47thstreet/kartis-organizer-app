import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { CheckInResult } from '../types';

export default function CheckInScreen() {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCheckIn = async (code: string) => {
    if (!code.trim()) return;
    setProcessing(true);
    try {
      const checkInResult = await api.checkIn(code);
      setResult(checkInResult);
    } catch {
      Alert.alert('Error', 'Failed to check in ticket.');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualSubmit = () => {
    handleCheckIn(manualCode);
    setManualCode('');
  };

  const resetResult = () => setResult(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Check-In</Text>
      </View>

      {result ? (
        <View style={styles.resultContainer}>
          <View
            style={[
              styles.resultIcon,
              {
                backgroundColor: result.valid && !result.alreadyCheckedIn
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(239,68,68,0.15)',
              },
            ]}
          >
            <Ionicons
              name={
                result.valid && !result.alreadyCheckedIn
                  ? 'checkmark-circle'
                  : 'close-circle'
              }
              size={64}
              color={
                result.valid && !result.alreadyCheckedIn
                  ? colors.success
                  : colors.error
              }
            />
          </View>

          <Text
            style={[
              styles.resultStatus,
              {
                color:
                  result.valid && !result.alreadyCheckedIn
                    ? colors.success
                    : colors.error,
              },
            ]}
          >
            {result.alreadyCheckedIn
              ? 'ALREADY CHECKED IN'
              : result.valid
              ? 'CHECK-IN SUCCESS'
              : 'INVALID TICKET'}
          </Text>

          <View style={styles.resultDetails}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Guest</Text>
              <Text style={styles.resultValue}>{result.customerName}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Event</Text>
              <Text style={styles.resultValue}>{result.eventTitle}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Ticket</Text>
              <Text style={styles.resultValue}>{result.ticketType}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>ID</Text>
              <Text style={styles.resultValue}>{result.ticketId}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.scanAgainButton} onPress={resetResult}>
            <Ionicons name="scan-outline" size={20} color={colors.text} />
            <Text style={styles.scanAgainText}>Scan Next</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scanContainer}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() =>
              Alert.alert(
                'Camera Scanner',
                'QR scanner requires a physical device with expo-camera. Use manual entry for testing.'
              )
            }
            activeOpacity={0.8}
          >
            <View style={styles.scanIconContainer}>
              <Ionicons name="qr-code-outline" size={80} color={colors.violet} />
            </View>
            <Text style={styles.scanText}>Tap to Scan QR Code</Text>
            <Text style={styles.scanSubtext}>
              Point camera at ticket QR code
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.manualLabel}>Manual Entry</Text>
          <View style={styles.manualRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="Enter ticket code..."
              placeholderTextColor={colors.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              returnKeyType="go"
              onSubmitEditing={handleManualSubmit}
            />
            <TouchableOpacity
              style={[
                styles.manualSubmit,
                !manualCode.trim() && styles.manualSubmitDisabled,
              ]}
              onPress={handleManualSubmit}
              disabled={!manualCode.trim() || processing}
            >
              <Ionicons name="arrow-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  scanContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  scanButton: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.violetDark,
    borderStyle: 'dashed',
  },
  scanIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.violetMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  scanSubtext: { fontSize: 14, color: colors.textSecondary },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  manualLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  manualRow: { flexDirection: 'row', gap: 12 },
  manualInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  manualSubmit: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualSubmitDisabled: { opacity: 0.5 },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  resultIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultStatus: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 32,
  },
  resultDetails: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultLabel: { fontSize: 14, color: colors.textSecondary },
  resultValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.violet,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  scanAgainText: { fontSize: 16, fontWeight: '600', color: colors.text },
});
