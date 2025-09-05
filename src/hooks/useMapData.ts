import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import marketplaceService from '../services/marketplaceService';
import { Listing, Zone } from '../../types/app';
import { fetchZoneRecommendations, ZoneRecommendation } from '../utils/zoneRecommendations';
import { CACHE_KEYS, getCache, setCache } from '../utils/offlineCache';
import { BusinessType as FilterBusinessType } from '../context/FilterContext';

const ZONE_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA',
  '#007AFF', '#5856D6', '#FF2D55', '#8A2BE2', '#FF1493',
  '#00FF7F', '#1E90FF', '#FFD700', '#FF4500', '#9370DB'
];

const recCacheKey = (type: string) => `${CACHE_KEYS.ZONE_RECOMMENDATIONS}_${type || 'none'}`;

export function useMapData(selectedBusinessType: FilterBusinessType | 'all') {
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const [cachedListings, cachedZones] = await Promise.all([
        getCache<Listing[]>('map_listings'),
        getCache<Zone[]>('map_zones'),
      ]);
      if (cachedListings) queryClient.setQueryData(['map', 'listings'], cachedListings);
      if (cachedZones) queryClient.setQueryData(['map', 'zones'], cachedZones);
      if (selectedBusinessType && selectedBusinessType !== 'none' && selectedBusinessType !== 'all') {
        const cachedRecs = await getCache<ZoneRecommendation[]>(recCacheKey(String(selectedBusinessType)));
        if (cachedRecs) queryClient.setQueryData(['map', 'zone-recs', selectedBusinessType], cachedRecs);
      }
    })();
  }, [queryClient, selectedBusinessType]);

  const listingsQuery = useQuery({
    queryKey: ['map', 'listings'],
    queryFn: () => marketplaceService.fetchListings(50),
    onSuccess: (data) => setCache('map_listings', data),
  });

  const zonesQuery = useQuery({
    queryKey: ['map', 'zones'],
    queryFn: () => marketplaceService.fetchZones(),
    onSuccess: (data) => setCache('map_zones', data),
  });

  const shouldFetchRecs = selectedBusinessType !== 'none' && selectedBusinessType !== 'all';

  const recsQuery = useQuery({
    queryKey: ['map', 'zone-recs', selectedBusinessType],
    enabled: shouldFetchRecs,
    queryFn: () => fetchZoneRecommendations(selectedBusinessType as FilterBusinessType),
    onSuccess: (data) => setCache(recCacheKey(String(selectedBusinessType)), data),
  });

  const processedListings = useMemo(() => {
    const base = listingsQuery.data || [];
    return base.map((l) => ({
      ...l,
      zoneColor: ZONE_COLORS[Number(l.zone_id) % ZONE_COLORS.length] || '#888888',
    }));
  }, [listingsQuery.data]);

  const recommendedZoneIds = useMemo(() => {
    return (recsQuery.data || []).map((z) => z.zone_id);
  }, [recsQuery.data]);

  return {
    listings: processedListings,
    zones: zonesQuery.data || [],
    recommendations: recsQuery.data || [],
    recommendedZoneIds,
    isLoading: listingsQuery.isLoading || zonesQuery.isLoading,
    isError: !!(listingsQuery.error || zonesQuery.error || recsQuery.error),
    error: (listingsQuery.error || zonesQuery.error || recsQuery.error) as any,
    refetchAll: async () => {
      await Promise.all([listingsQuery.refetch(), zonesQuery.refetch(), recsQuery.refetch()]);
    },
  };
}

export default useMapData;
