import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZoneRecommendation } from '../../src/utils/zoneRecommendations';

interface Props {
  recommendations: ZoneRecommendation[];
}

export default function RecommendationPanel({ recommendations }: Props) {
  if (!recommendations || recommendations.length === 0) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Zones</Text>
      <View style={styles.chips}>
        {recommendations.map((z) => (
          <View key={z.zone_id} style={styles.chip}>
            <Text style={styles.chipText}>Zone {z.zone_id}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
  },
});
