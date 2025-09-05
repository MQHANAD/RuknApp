import { supabase } from '../../lib/supabaseClient';
import { Listing as AppListing, Zone as AppZone } from '../../types/app';

export interface Competitor {
  zone_id: number;
  business_type: string;
  number_of_same_type_businesses: number;
}

export const marketplaceService = {
  async fetchZones(): Promise<AppZone[]> {
    const { data, error } = await supabase
      .from('Zones')
      .select('zone_id, district_name, latitude_center, longitude_center');

    if (error) throw error;
    return (data || []).map((z: any) => ({
      zone_id: Number(z.zone_id),
      district_name: z.district_name,
      latitude_center: typeof z.latitude_center === 'string' ? Number(z.latitude_center) : z.latitude_center,
      longitude_center: typeof z.longitude_center === 'string' ? Number(z.longitude_center) : z.longitude_center,
    }));
  },

  async fetchListings(limit = 50): Promise<AppListing[]> {
    const { data, error } = await supabase
      .from('Listings')
      .select('Listing_ID, Title, Price, Area, Images, zone_id, Latitude, Longitude')
      .limit(limit);

    if (error) throw error;

    return (data || [])
      .filter((l: any) => l.Latitude && l.Longitude)
      .map((l: any) => ({
        Listing_ID: l.Listing_ID,
        Title: l.Title,
        Price: l.Price,
        Area: l.Area,
        zone_id: l.zone_id,
        Latitude: Number(l.Latitude),
        Longitude: Number(l.Longitude),
        Images: Array.isArray(l.Images) ? l.Images : l.Images ? [l.Images] : [],
      }));
  },

  async fetchAllListings(): Promise<any[]> {
    const { data, error } = await supabase
      .from('Listings')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async fetchZonesFull(): Promise<any[]> {
    const { data, error } = await supabase
      .from('Zones')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async fetchCompetitors(): Promise<Competitor[]> {
    const { data, error } = await supabase
      .from('Competitors')
      .select('*');

    if (error) throw error;
    return (data || []).map((c: any) => ({
      zone_id: Number(c.zone_id),
      business_type: c.business_type,
      number_of_same_type_businesses: Number(c.number_of_same_type_businesses || 0),
    }));
  },
};

export default marketplaceService;
