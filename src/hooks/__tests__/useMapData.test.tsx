import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMapData as useMapDataRaw } from '../useMapData';

jest.mock('../../services/marketplaceService', () => ({
  __esModule: true,
  default: {
    fetchListings: jest.fn(async () => [
      { Listing_ID: 1, Title: 'A', Price: 10, Area: 100, zone_id: 1, Latitude: 24.7, Longitude: 46.6 },
    ]),
    fetchZones: jest.fn(async () => [
      { zone_id: 1, district_name: 'D1', latitude_center: 24.7, longitude_center: 46.6 },
    ]),
  },
}));

jest.mock('../../utils/zoneRecommendations', () => ({
  __esModule: true,
  fetchZoneRecommendations: jest.fn(async () => [
    { zone_id: 1, zone_score: 1, total_popularity_score: 1, total_user_ratings: 1, number_of_same_type_businesses: 0 },
  ]),
}));

function HookHarness({ businessType = 'none' as any, probe }: any) {
  const data = useMapDataRaw(businessType);
  probe.current = data;
  return <Text>ok</Text>;
}

describe('useMapData', () => {
  const createWrapper = () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: 0 } },
    });
    const probe: any = { current: null };
    const root = renderer.create(
      <QueryClientProvider client={client}>
        <HookHarness probe={probe} />
      </QueryClientProvider>
    );
    return { root, probe };
  };

  it('returns loading then data on success', async () => {
    const { probe } = createWrapper();
    expect(probe.current?.isLoading).toBeTruthy();
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    expect(probe.current?.isLoading).toBeFalsy();
    expect(Array.isArray(probe.current?.listings)).toBe(true);
    expect(probe.current?.listings.length).toBe(1);
  });

  it('handles errors', async () => {
    const svc = require('../../services/marketplaceService').default;
    svc.fetchListings.mockImplementationOnce(async () => { throw new Error('fail'); });
    const { probe } = createWrapper();
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    expect(probe.current?.isError).toBeTruthy();
  });
});
