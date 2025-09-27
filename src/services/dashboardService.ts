import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@config/env';
import { supabase } from '@lib/supabase';

export interface DashboardMetrics {
  users: {
    totalEntrepreneurs: number;
    totalOwners: number;
    totalUsers: number;
    newSignupsToday: number;
    newSignupsThisWeek: number;
    newSignupsThisMonth: number;
  };
  businesses: {
    totalBusinesses: number;
    totalListings: number;
    totalFavorites: number;
    averageRating: number;
    businessesByType: Record<string, number>;
  };
  performance: {
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
    uptime: number;
  };
  activity: {
    dailySignups: Array<{ date: string; count: number }>;
    weeklyActivity: Array<{ week: string; count: number }>;
    monthlyGrowth: Array<{ month: string; count: number }>;
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

class DashboardService {
  private subscriptions: any[] = [];
  private listeners: ((metrics: DashboardMetrics) => void)[] = [];

  private getDefaultHeaders() {
    return {
      'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      console.log('Fetching dashboard metrics...');
      
      // Test table access first
      await this.testTableAccess();
      
      const [
        entrepreneursData,
        ownersData,
        businessesData,
        listingsData,
        favoritesData
      ] = await Promise.allSettled([
        this.getEntrepreneursData(),
        this.getOwnersData(),
        this.getBusinessesData(),
        this.getListingsData(),
        this.getFavoritesData()
      ]);

      // Extract data from settled promises, defaulting to empty arrays on failure
      const entrepreneurs = entrepreneursData.status === 'fulfilled' ? entrepreneursData.value : [];
      const owners = ownersData.status === 'fulfilled' ? ownersData.value : [];
      const businesses = businessesData.status === 'fulfilled' ? businessesData.value : [];
      const listings = listingsData.status === 'fulfilled' ? listingsData.value : [];
      const favorites = favoritesData.status === 'fulfilled' ? favoritesData.value : [];

      console.log('Data summary:', {
        entrepreneurs: entrepreneurs.length,
        owners: owners.length,
        businesses: businesses.length,
        listings: listings.length,
        favorites: favorites.length
      });

      const users = this.calculateUserMetrics(entrepreneurs, owners);
      const businessMetrics = this.calculateBusinessMetrics(businesses, listings, favorites);
      const performance = this.calculatePerformanceMetrics();
      const activity = this.calculateActivityMetrics(entrepreneurs, owners);

      return {
        users,
        businesses: businessMetrics,
        performance,
        activity
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  private async testTableAccess() {
    const tables = ['entrepreneurs', 'owners', 'Businesses', 'Listings', 'favorites'];
    
    for (const table of tables) {
      try {
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`,
          {
            method: 'GET',
            headers: this.getDefaultHeaders()
          }
        );
        
        console.log(`Table ${table} access:`, response.status, response.ok ? 'OK' : 'FAILED');
        
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            console.log(`Table ${table} columns:`, Object.keys(data[0]));
          }
        } else {
          const errorText = await response.text();
          console.log(`Table ${table} error:`, errorText);
        }
      } catch (error) {
        console.log(`Table ${table} exception:`, error);
      }
    }
  }

  private async getEntrepreneursData() {
    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?select=id,created_at`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch entrepreneurs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching entrepreneurs data:', error);
      return [];
    }
  }

  private async getOwnersData() {
    try {
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?select=id,created_at`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch owners: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching owners data:', error);
      return [];
    }
  }

  private async getBusinessesData() {
    try {
      console.log('Fetching businesses data...');
      let allBusinesses: any[] = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Businesses?select=business_id,rating,business_type&limit=${limit}&offset=${offset}`,
          {
            method: 'GET',
            headers: this.getDefaultHeaders()
          }
        );

        console.log(`Businesses batch ${Math.floor(offset/limit) + 1} response status:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Businesses fetch error:', response.status, response.statusText, errorText);
          break;
        }

        const data = await response.json();
        allBusinesses = allBusinesses.concat(data);
        
        console.log(`Fetched ${data.length} businesses (total: ${allBusinesses.length})`);
        
        // If we got less than the limit, we've reached the end
        hasMore = data.length === limit;
        offset += limit;
      }

      console.log('Total businesses data fetched:', allBusinesses.length, 'records');
      return allBusinesses;
    } catch (error) {
      console.error('Error fetching businesses data:', error);
      return [];
    }
  }

  private async getListingsData() {
    try {
      console.log('Fetching listings data...');
      let allListings: any[] = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?select=Listing_ID&limit=${limit}&offset=${offset}`,
          {
            method: 'GET',
            headers: this.getDefaultHeaders()
          }
        );

        console.log(`Listings batch ${Math.floor(offset/limit) + 1} response status:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Listings fetch error:', response.status, response.statusText, errorText);
          break;
        }

        const data = await response.json();
        allListings = allListings.concat(data);
        
        console.log(`Fetched ${data.length} listings (total: ${allListings.length})`);
        
        // If we got less than the limit, we've reached the end
        hasMore = data.length === limit;
        offset += limit;
      }

      console.log('Total listings data fetched:', allListings.length, 'records');
      return allListings;
    } catch (error) {
      console.error('Error fetching listings data:', error);
      return [];
    }
  }

  private async getFavoritesData() {
    try {
      console.log('Fetching favorites data...');
      const response = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/favorites?select=*`,
        {
          method: 'GET',
          headers: this.getDefaultHeaders()
        }
      );

      console.log('Favorites response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Favorites fetch error:', response.status, response.statusText, errorText);
        // Return empty array instead of throwing error
        return [];
      }

      const data = await response.json();
      console.log('Favorites data fetched:', data.length, 'records');
      return data;
    } catch (error) {
      console.error('Error fetching favorites data:', error);
      return [];
    }
  }

  private calculateUserMetrics(entrepreneurs: any[], owners: any[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const allUsers = [...entrepreneurs, ...owners];

    const newSignupsToday = allUsers.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate >= today;
    }).length;

    const newSignupsThisWeek = allUsers.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate >= weekAgo;
    }).length;

    const newSignupsThisMonth = allUsers.filter(user => {
      const createdDate = new Date(user.created_at);
      return createdDate >= monthAgo;
    }).length;

    return {
      totalEntrepreneurs: entrepreneurs.length,
      totalOwners: owners.length,
      totalUsers: allUsers.length,
      newSignupsToday,
      newSignupsThisWeek,
      newSignupsThisMonth
    };
  }

  private calculateBusinessMetrics(businesses: any[], listings: any[], favorites: any[]) {
    const businessesByType: Record<string, number> = {};
    let totalRating = 0;
    let ratedBusinesses = 0;

    businesses.forEach(business => {
      // Count by business type
      const type = business.business_type || 'unknown';
      businessesByType[type] = (businessesByType[type] || 0) + 1;

      // Calculate average rating
      if (business.rating && !isNaN(parseFloat(business.rating))) {
        totalRating += parseFloat(business.rating);
        ratedBusinesses++;
      }
    });

    const averageRating = ratedBusinesses > 0 ? totalRating / ratedBusinesses : 0;

    return {
      totalBusinesses: businesses.length,
      totalListings: listings.length,
      totalFavorites: favorites.length,
      averageRating: Math.round(averageRating * 10) / 10,
      businessesByType
    };
  }

  private calculatePerformanceMetrics() {
    // Mock performance data - in a real app, you'd collect this from your backend
    return {
      averageResponseTime: Math.random() * 200 + 50, // 50-250ms
      totalRequests: Math.floor(Math.random() * 1000),
      errorRate: Math.random() * 2, // 0-2%
      uptime: 99.5 + Math.random() * 0.5 // 99.5-100%
    };
  }

  private calculateActivityMetrics(entrepreneurs: any[], owners: any[]) {
    const allUsers = [...entrepreneurs, ...owners];
    const now = new Date();

    // Generate daily signups for the last 7 days
    const dailySignups = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = allUsers.filter(user => {
        const createdDate = new Date(user.created_at).toISOString().split('T')[0];
        return createdDate === dateStr;
      }).length;
      dailySignups.push({ date: dateStr, count });
    }

    // Generate weekly activity for the last 4 weeks
    const weeklyActivity = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      const weekStr = `Week ${4 - i}`;
      const count = allUsers.filter(user => {
        const createdDate = new Date(user.created_at);
        return createdDate >= weekStart && createdDate <= weekEnd;
      }).length;
      weeklyActivity.push({ week: weekStr, count });
    }

    // Generate monthly growth for the last 6 months
    const monthlyGrowth = [];
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                         'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthIndex = monthStart.getMonth();
      const monthStr = `${arabicMonths[monthIndex]}`; // Remove year to make it shorter
      const count = allUsers.filter(user => {
        const createdDate = new Date(user.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      }).length;
      monthlyGrowth.push({ month: monthStr, count });
    }

    return {
      dailySignups,
      weeklyActivity,
      monthlyGrowth
    };
  }

  // Chart data generators
  generateSignupsChart(activity: DashboardMetrics['activity']): ChartData {
    return {
      labels: activity.dailySignups.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('ar-SA', { weekday: 'short' });
      }),
      datasets: [{
        data: activity.dailySignups.map(item => item.count),
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
        strokeWidth: 2
      }]
    };
  }

  generateBusinessTypesChart(businessesByType: Record<string, number>): ChartData {
    const businessTypeTranslations: Record<string, string> = {
      'restaurant': 'مطعم',
      'cafe': 'مقهى',
      'retail': 'تجارة تجزئة',
      'grocery': 'بقالة',
      'pharmacy': 'صيدلية',
      'clinic': 'عيادة',
      'hospital': 'مستشفى',
      'school': 'مدرسة',
      'university': 'جامعة',
      'bank': 'بنك',
      'atm': 'صراف آلي',
      'gas_station': 'محطة وقود',
      'hotel': 'فندق',
      'gym': 'نادي رياضي',
      'salon': 'صالون',
      'laundry': 'مغسلة',
      'barber': 'حلاق',
      'electronics': 'إلكترونيات',
      'furniture': 'أثاث',
      'clothing': 'ملابس',
      'shoes': 'أحذية',
      'jewelry': 'مجوهرات',
      'bookstore': 'مكتبة',
      'stationery': 'أدوات مكتبية',
      'hardware': 'أدوات منزلية',
      'car_repair': 'تصليح سيارات',
      'car_wash': 'غسيل سيارات',
      'parking': 'موقف سيارات',
      'supermarket': 'سوبر ماركت',
      'bakery': 'مخبز',
      'butcher': 'جزارة',
      'fish_market': 'سوق السمك',
      'vegetable_market': 'سوق الخضار',
      'flower_shop': 'محل أزهار',
      'pet_shop': 'محل حيوانات أليفة',
      'travel_agency': 'وكالة سفر',
      'insurance': 'تأمين',
      'real_estate': 'عقارات',
      'lawyer': 'محامي',
      'accountant': 'محاسب',
      'consultant': 'استشاري',
      'photography': 'تصوير',
      'printing': 'طباعة',
      'internet_cafe': 'مقهى إنترنت',
      'game_center': 'مركز ألعاب',
      'cinema': 'سينما',
      'theater': 'مسرح',
      'museum': 'متحف',
      'library': 'مكتبة عامة',
      'post_office': 'مكتب بريد',
      'government': 'مكتب حكومي',
      'embassy': 'سفارة',
      'consulate': 'قنصلية',
      'mosque': 'مسجد',
      'church': 'كنيسة',
      'temple': 'معبد',
      'other': 'أخرى',
      'unknown': 'غير محدد'
    };

    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(34, 197, 94, 0.8)',     // Emerald
      'rgba(251, 146, 60, 0.8)',   // Orange
      'rgba(168, 85, 247, 0.8)',   // Violet
      'rgba(14, 165, 233, 0.8)',   // Sky Blue
      'rgba(20, 184, 166, 0.8)',   // Teal
      'rgba(245, 101, 101, 0.8)',  // Rose
      'rgba(132, 204, 22, 0.8)',   // Lime
      'rgba(249, 115, 22, 0.8)',   // Amber
    ];

    const labels = Object.keys(businessesByType);
    const data = Object.values(businessesByType);
    
    // Create translated labels
    const translatedLabels = labels.map(label => 
      businessTypeTranslations[label.toLowerCase()] || label
    );

    // Assign unique colors to each business type
    const colorMap = labels.map((_, index) => colors[index % colors.length]);

    return {
      labels: translatedLabels,
      datasets: [{
        data,
        color: (opacity = 1, index = 0) => {
          const colorIndex = index % colorMap.length;
          return colorMap[colorIndex].replace('0.8', opacity.toString());
        }
      }]
    };
  }

  generateGrowthChart(activity: DashboardMetrics['activity']): ChartData {
    return {
      labels: activity.monthlyGrowth.map(item => item.month),
      datasets: [{
        data: activity.monthlyGrowth.map(item => item.count),
        color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`, // Purple
        strokeWidth: 3
      }]
    };
  }

  // Real-time subscription methods
  async startRealTimeUpdates(callback: (metrics: DashboardMetrics) => void) {
    try {
      console.log('Starting real-time dashboard updates...');
      
      // Add callback to listeners
      this.listeners.push(callback);

      // Subscribe to entrepreneurs table changes
      const entrepreneursSubscription = supabase
        .channel('entrepreneurs_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'entrepreneurs' },
          () => this.handleDataChange()
        )
        .subscribe();

      // Subscribe to owners table changes
      const ownersSubscription = supabase
        .channel('owners_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'owners' },
          () => this.handleDataChange()
        )
        .subscribe();

      // Subscribe to businesses table changes
      const businessesSubscription = supabase
        .channel('businesses_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'Businesses' },
          () => this.handleDataChange()
        )
        .subscribe();

      // Subscribe to listings table changes
      const listingsSubscription = supabase
        .channel('listings_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'Listings' },
          () => this.handleDataChange()
        )
        .subscribe();

      // Subscribe to favorites table changes
      const favoritesSubscription = supabase
        .channel('favorites_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'favorites' },
          () => this.handleDataChange()
        )
        .subscribe();

      // Store subscriptions for cleanup
      this.subscriptions.push(
        entrepreneursSubscription,
        ownersSubscription,
        businessesSubscription,
        listingsSubscription,
        favoritesSubscription
      );

      console.log('Real-time subscriptions established');
    } catch (error) {
      console.error('Error starting real-time updates:', error);
    }
  }

  private async handleDataChange() {
    try {
      console.log('Data change detected, refreshing metrics...');
      const metrics = await this.getDashboardMetrics();
      
      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(metrics);
        } catch (error) {
          console.error('Error in dashboard listener:', error);
        }
      });
    } catch (error) {
      console.error('Error handling data change:', error);
    }
  }

  stopRealTimeUpdates() {
    try {
      console.log('Stopping real-time dashboard updates...');
      
      // Unsubscribe from all channels
      this.subscriptions.forEach(subscription => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      });

      // Clear subscriptions and listeners
      this.subscriptions = [];
      this.listeners = [];

      console.log('Real-time subscriptions stopped');
    } catch (error) {
      console.error('Error stopping real-time updates:', error);
    }
  }

  // Remove a specific listener
  removeListener(callback: (metrics: DashboardMetrics) => void) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}

export const dashboardService = new DashboardService();
