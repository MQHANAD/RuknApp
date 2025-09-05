import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import ErrorBoundary from '../../components/ErrorBoundary';
import FilterBar from '../../components/map/FilterBar';
import MapViewContainer from '../../components/map/MapViewContainer';

import { useFilters } from '../../src/context/FilterContext';
import useMapData from '../../src/hooks/useMapData';

export default function MapScreen() {
  const { selectedBusinessType } = useFilters();
  const { listings, recommendations, recommendedZoneIds, isLoading, isError } = useMapData(selectedBusinessType);

  const openGoogleMapsLink = () => {
    const url = 'https://www.google.com/maps/d/u/0/viewer?mid=1kpPnbLmYdaQIlFee8vTxr2_LNHS43UE&usp=sharing';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
    });
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <FilterBar />

        {isError ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#d00' }}>Failed to load map data. Please try again.</Text>
          </View>
        ) : null}
        <MapViewContainer
          listings={listings}
          recommendedZoneIds={recommendedZoneIds}
          isLoading={isLoading}
          onOpenGoogleMaps={openGoogleMapsLink}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
