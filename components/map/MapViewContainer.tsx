import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Listing } from '../../types/app';

const INITIAL_REGION = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

interface Props {
  listings: (Listing & { zoneColor?: string })[];
  recommendedZoneIds: number[];
  isLoading: boolean;
  isLoadingRecommendations?: boolean;
  onOpenGoogleMaps: () => void;
}

const CustomMarker = React.memo(({ listing }: { listing: Listing & { zoneColor?: string } }) => {
  const markerColor = listing.zoneColor || '#FF3B30';
  return (
    <Marker
      key={`listing-${listing.Listing_ID}`}
      coordinate={{ latitude: listing.Latitude, longitude: listing.Longitude }}
      title={listing.Title || `Listing ${listing.Listing_ID}`}
      description={`${listing.Price ? `${listing.Price} SAR - ` : ''}${listing.Area ? `${listing.Area} m² - ` : ''}Zone: ${listing.zone_id}`}
      tracksViewChanges={false}
    >
      <View style={[styles.listingMarker, { backgroundColor: markerColor, borderColor: '#FFFFFF' }]}>
        <Text style={styles.listingMarkerText}>{listing.zone_id}</Text>
      </View>
    </Marker>
  );
});

export default function MapViewContainer({ listings, recommendedZoneIds, isLoading, isLoadingRecommendations, onOpenGoogleMaps }: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [visibleListings, setVisibleListings] = useState<(Listing & { zoneColor?: string })[]>([]);

  const onRegionChangeComplete = (region: Region) => {
    const visibleList = listings.filter((listing) => {
      const inLatRange = listing.Latitude >= region.latitude - region.latitudeDelta && listing.Latitude <= region.latitude + region.latitudeDelta;
      const inLngRange = listing.Longitude >= region.longitude - region.longitudeDelta && listing.Longitude <= region.longitude + region.longitudeDelta;
      return inLatRange && inLngRange;
    });
    const limitedList = visibleList.slice(0, 100);
    setVisibleListings(limitedList);
  };

  const filteredListings = useMemo(() => {
    const baseListings = visibleListings.length > 0 ? visibleListings : listings.slice(0, 50);
    if (!recommendedZoneIds || recommendedZoneIds.length === 0 || isLoadingRecommendations) return baseListings;
    return baseListings.filter((l) => recommendedZoneIds.includes(Number(l.zone_id)));
  }, [visibleListings, listings, recommendedZoneIds, isLoadingRecommendations]);

  if (isLoading) {
    return (
      <View style={styles.mapContainer}>
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        zoomControlEnabled
        moveOnMarkerPress={false}
        onRegionChangeComplete={onRegionChangeComplete}
        maxZoomLevel={18}
        minZoomLevel={5}
        loadingEnabled={true}
        loadingIndicatorColor="#F5A623"
        loadingBackgroundColor="rgba(255, 255, 255, 0.7)"
      >
        {filteredListings.map((listing) => (
          <CustomMarker key={`listing-${listing.Listing_ID}`} listing={listing} />
        ))}
      </MapView>

      <TouchableOpacity style={styles.googleMapsButton} onPress={onOpenGoogleMaps}>
        <MaterialIcons name="map" size={24} color="#F5A623" />
        <Text style={styles.googleMapsText}>View Full Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listingMarker: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  listingMarkerText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  googleMapsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleMapsText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: 'bold',
  },
});
