import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';
import { VenueMap, VenueZone } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const MAP_PADDING = 40;
const MAP_WIDTH = screenWidth - MAP_PADDING;

const zoneTypeIcons: Record<VenueZone['type'], keyof typeof Ionicons.glyphMap> = {
  stage: 'musical-notes',
  bar: 'beer-outline',
  vip: 'star',
  general: 'people',
  entrance: 'enter-outline',
  exit: 'exit-outline',
  restroom: 'water-outline',
  backstage: 'lock-closed-outline',
};

const ZoneBlock = ({
  zone,
  scale,
  selected,
  onPress,
}: {
  zone: VenueZone;
  scale: number;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.zoneBlock,
      {
        left: zone.x * scale,
        top: zone.y * scale,
        width: zone.width * scale,
        height: zone.height * scale,
        backgroundColor: zone.color + '30',
        borderColor: selected ? colors.text : zone.color + '60',
        borderWidth: selected ? 2 : 1,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons
      name={zoneTypeIcons[zone.type]}
      size={Math.min(zone.width * scale * 0.3, 20)}
      color={zone.color}
    />
    <Text
      style={[styles.zoneName, { fontSize: Math.min(zone.width * scale * 0.12, 11) }]}
      numberOfLines={1}
    >
      {zone.name}
    </Text>
    {zone.capacity && (
      <Text
        style={[
          styles.zoneCapacity,
          { fontSize: Math.min(zone.width * scale * 0.1, 9) },
        ]}
      >
        Cap: {zone.capacity}
      </Text>
    )}
  </TouchableOpacity>
);

const ZoneDetail = ({ zone }: { zone: VenueZone }) => (
  <View style={styles.detailCard}>
    <View style={styles.detailHeader}>
      <View style={[styles.detailColorDot, { backgroundColor: zone.color }]} />
      <Text style={styles.detailTitle}>{zone.name}</Text>
      <View style={styles.detailTypeBadge}>
        <Text style={styles.detailTypeText}>{zone.type.toUpperCase()}</Text>
      </View>
    </View>
    <View style={styles.detailBody}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Position</Text>
        <Text style={styles.detailValue}>
          x: {zone.x}, y: {zone.y}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Size</Text>
        <Text style={styles.detailValue}>
          {zone.width} x {zone.height}
        </Text>
      </View>
      {zone.capacity && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Capacity</Text>
          <Text style={styles.detailValue}>{zone.capacity} people</Text>
        </View>
      )}
    </View>
    <View style={styles.detailActions}>
      <TouchableOpacity
        style={styles.detailActionBtn}
        onPress={() => Alert.alert('Edit Zone', 'Zone editor would open here.')}
      >
        <Ionicons name="create-outline" size={16} color={colors.violet} />
        <Text style={styles.detailActionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.detailActionBtn, styles.detailDeleteBtn]}
        onPress={() => Alert.alert('Delete Zone', 'Zone would be removed.')}
      >
        <Ionicons name="trash-outline" size={16} color={colors.error} />
        <Text style={[styles.detailActionText, { color: colors.error }]}>Remove</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function VenueMapScreen() {
  const [venueMap, setVenueMap] = useState<VenueMap | null>(null);
  const [selectedZone, setSelectedZone] = useState<VenueZone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVenueMap().then((data) => {
      setVenueMap(data);
      setLoading(false);
    });
  }, []);

  if (loading || !venueMap) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  const scale = MAP_WIDTH / venueMap.width;
  const mapHeight = venueMap.height * scale;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Venue Map</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            await api.saveVenueMap(venueMap);
            Alert.alert('Saved', 'Venue map saved successfully.');
          }}
        >
          <Ionicons name="save-outline" size={18} color={colors.text} />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mapName}>{venueMap.name}</Text>

      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <View style={[styles.mapGrid, { width: MAP_WIDTH, height: mapHeight }]}>
          {venueMap.zones.map((zone) => (
            <ZoneBlock
              key={zone.id}
              zone={zone}
              scale={scale}
              selected={selectedZone?.id === zone.id}
              onPress={() =>
                setSelectedZone(
                  selectedZone?.id === zone.id ? null : zone
                )
              }
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addZoneButton}
        onPress={() =>
          Alert.alert('Add Zone', 'Zone creation form would open here.')
        }
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.violet} />
        <Text style={styles.addZoneText}>Add Zone</Text>
      </TouchableOpacity>

      {selectedZone && <ZoneDetail zone={selectedZone} />}

      <Text style={styles.legendTitle}>Legend</Text>
      <View style={styles.legendGrid}>
        {(
          Object.keys(zoneTypeIcons) as VenueZone['type'][]
        ).map((type) => (
          <View key={type} style={styles.legendItem}>
            <Ionicons name={zoneTypeIcons[type]} size={16} color={colors.textSecondary} />
            <Text style={styles.legendText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.violet,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: { fontSize: 14, fontWeight: '600', color: colors.text },
  mapName: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mapContainer: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapGrid: {
    position: 'relative',
  },
  zoneBlock: {
    position: 'absolute',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  zoneName: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  zoneCapacity: {
    color: colors.textMuted,
    marginTop: 1,
  },
  addZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.violetMuted,
    borderWidth: 1,
    borderColor: colors.violetDark,
    borderStyle: 'dashed',
  },
  addZoneText: { fontSize: 14, fontWeight: '600', color: colors.violet },
  detailCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  detailTitle: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  detailTypeBadge: {
    backgroundColor: colors.violetMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.violet,
    letterSpacing: 0.5,
  },
  detailBody: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '500', color: colors.text },
  detailActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  detailActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.violetMuted,
  },
  detailDeleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  detailActionText: { fontSize: 13, fontWeight: '600', color: colors.violet },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  legendText: { fontSize: 13, color: colors.textSecondary },
});
