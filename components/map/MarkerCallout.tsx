import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Listing } from '../../types/app';

interface Props {
  listing: Listing;
}

export default function MarkerCallout({ listing }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{listing.Title || `Listing ${listing.Listing_ID}`}</Text>
      <Text style={styles.subtitle}>
        {listing.Price ? `${listing.Price} SAR` : ''} {listing.Area ? `• ${listing.Area} m²` : ''}
      </Text>
      <Text style={styles.subtitle}>Zone: {listing.zone_id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
