import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { DashboardHeader, MetricCard, ChartCard } from '../components/dashboard';
import { dashboardService, DashboardMetrics } from '../src/services/dashboardService';
import { adminService } from '../src/services/adminService';
import { useAuth } from '../src/context/AuthContext';
import { useAnalytics } from '../src/hooks/useAnalytics';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { trackClick, trackEvent } = useAnalytics();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Check admin access
  const isAdmin = adminService.isAdmin(user);

  const loadDashboardData = async (isRefresh = false) => {
    try {
      console.log('🔄 Starting dashboard data load...', { isRefresh, isAuthenticated });
      
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Track dashboard data load
      trackEvent('dashboard_data_load_attempted', {
        is_refresh: isRefresh,
        user_role: user?.role || 'unknown'
      });

      console.log('📊 Calling dashboardService.getDashboardMetrics()...');
      const dashboardMetrics = await dashboardService.getDashboardMetrics();
      console.log('✅ Dashboard metrics loaded successfully:', dashboardMetrics);
      setMetrics(dashboardMetrics);
      setLastUpdated(new Date());
      
      // Track successful dashboard data load
      trackEvent('dashboard_data_load_success', {
        is_refresh: isRefresh,
        user_role: user?.role || 'unknown',
        metrics_count: Object.keys(dashboardMetrics).length
      });
    } catch (err) {
      console.error('❌ Error loading dashboard data:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('فشل في تحميل بيانات لوحة التحكم');
      Alert.alert('خطأ', 'فشل في تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.');
      
      // Track dashboard data load error
      trackEvent('dashboard_data_load_error', {
        is_refresh: isRefresh,
        user_role: user?.role || 'unknown',
        error: String(err)
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('🎯 Dashboard useEffect triggered:', { isAuthenticated, user: user?.id });
    
    // Load dashboard data for all authenticated users
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, skipping dashboard load');
      return;
    }
    
    console.log('✅ User authenticated, loading dashboard data...');
    loadDashboardData();

    // Start real-time updates
    const handleRealTimeUpdate = (newMetrics: DashboardMetrics) => {
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    };

    dashboardService.startRealTimeUpdates(handleRealTimeUpdate);

    // Cleanup function
    return () => {
      dashboardService.removeListener(handleRealTimeUpdate);
      dashboardService.stopRealTimeUpdates();
    };
  }, []);

  const handleRefresh = () => {
    // Track refresh action
    trackClick('dashboard_refresh_button', {
      user_role: user?.role || 'unknown',
      screen: 'dashboard'
    });
    loadDashboardData(true);
  };

  // Dashboard access is now controlled by the profile screen button visibility
  // Only admin users can see the dashboard button, so this check is redundant
  // but we'll keep it as a safety measure
  // if (!isAuthenticated || !isAdmin) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <DashboardHeader title="لوحة التحكم" />
  //       <View style={styles.accessDeniedContainer}>
  //         <Ionicons name="shield-outline" size={64} color="#EF4444" />
  //         <Text style={styles.accessDeniedTitle}>غير مصرح بالوصول</Text>
  //         <Text style={styles.accessDeniedText}>
  //           هذا القسم مخصص للمديرين فقط
  //         </Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader title="لوحة التحكم الإدارية" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader title="لوحة التحكم" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>
            {error || 'فشل في تحميل البيانات'}
          </Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            اضغط للمحاولة مرة أخرى
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader
        title="لوحة التحكم الإدارية"
        subtitle="مرحباً بك في لوحة التحكم"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* User Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إحصائيات المستخدمين</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="إجمالي المستخدمين"
              value={metrics.users.totalUsers.toLocaleString('ar-SA')}
              subtitle="جميع المستخدمين"
              color="#3B82F6"
              icon={<Ionicons name="people" size={20} color="#3B82F6" />}
            />
            <MetricCard
              title="رواد الأعمال"
              value={metrics.users.totalEntrepreneurs.toLocaleString('ar-SA')}
              subtitle="مستخدمين نشطين"
              color="#10B981"
              icon={<Ionicons name="business" size={20} color="#10B981" />}
            />
            <MetricCard
              title="أصحاب العقارات"
              value={metrics.users.totalOwners.toLocaleString('ar-SA')}
              subtitle="ملاك العقارات"
              color="#F59E0B"
              icon={<Ionicons name="home" size={20} color="#F59E0B" />}
            />
            <MetricCard
              title="مشتركين جدد اليوم"
              value={metrics.users.newSignupsToday.toLocaleString('ar-SA')}
              subtitle="آخر 24 ساعة"
              color="#EF4444"
              icon={<Ionicons name="person-add" size={20} color="#EF4444" />}
            />
          </View>
        </View>

        {/* Business Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إحصائيات الأعمال - تحليل المواقع</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="إجمالي الأعمال"
              value={metrics.businesses.totalBusinesses.toLocaleString('ar-SA')}
              subtitle="للتنبؤ بأفضل المواقع"
              color="#8B5CF6"
              icon={<Ionicons name="storefront" size={20} color="#8B5CF6" />}
            />
            <MetricCard
              title="إجمالي العقارات"
              value={metrics.businesses.totalListings.toLocaleString('ar-SA')}
              subtitle="متاحة للاستثمار"
              color="#06B6D4"
              icon={<Ionicons name="location" size={20} color="#06B6D4" />}
            />
            <MetricCard
              title="المفضلة"
              value={metrics.businesses.totalFavorites.toLocaleString('ar-SA')}
              subtitle="المواقع المفضلة"
              color="#EC4899"
              icon={<Ionicons name="heart" size={20} color="#EC4899" />}
            />
            <MetricCard
              title="متوسط التقييم"
              value={metrics.businesses.averageRating.toFixed(1)}
              subtitle="جودة المواقع المختارة"
              color="#F97316"
              icon={<Ionicons name="star" size={20} color="#F97316" />}
            />
          </View>
        </View>

        {/* Location Intelligence Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="analytics" size={24} color="#3B82F6" />
              <Text style={styles.infoCardTitle}>نظام التوصيات الذكية</Text>
            </View>
            <Text style={styles.infoCardDescription}>
              تحليل {metrics.businesses.totalBusinesses.toLocaleString('ar-SA')}+ موقع تجاري لتحديد أفضل الأماكن لفتح مشروعك بناءً على البيانات والمواقع المحيطة
            </Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أداء النظام (بيانات تجريبية)</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="متوسط وقت الاستجابة"
              value={`${metrics.performance.averageResponseTime.toFixed(0)}ms`}
              subtitle="وقت استجابة الخادم للطلبات"
              color="#059669"
              icon={<Ionicons name="speedometer" size={20} color="#059669" />}
            />
            <MetricCard
              title="إجمالي الطلبات"
              value={metrics.performance.totalRequests.toLocaleString('ar-SA')}
              subtitle="عدد طلبات API اليوم"
              color="#7C3AED"
              icon={<Ionicons name="analytics" size={20} color="#7C3AED" />}
            />
            <MetricCard
              title="معدل الأخطاء"
              value={`${metrics.performance.errorRate.toFixed(2)}%`}
              subtitle="نسبة الطلبات الفاشلة"
              color="#DC2626"
              icon={<Ionicons name="warning" size={20} color="#DC2626" />}
            />
            <MetricCard
              title="وقت التشغيل"
              value={`${metrics.performance.uptime.toFixed(1)}%`}
              subtitle="نسبة توفر الخادم"
              color="#16A34A"
              icon={<Ionicons name="checkmark-circle" size={20} color="#16A34A" />}
            />
          </View>
        </View>

        {/* Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الرسوم البيانية</Text>
          
          <ChartCard
            title="المشتركين الجدد اليومي"
            subtitle="آخر 7 أيام"
            type="line"
            data={dashboardService.generateSignupsChart(metrics.activity)}
            height={200}
          />

          <ChartCard
            title="توزيع أنواع الأعمال - تحليل المواقع"
            subtitle="للتنبؤ بأفضل المواقع"
            type="pie"
            data={dashboardService.generateBusinessTypesChart(metrics.businesses.businessesByType)}
            height={250}
          />

          <ChartCard
            title="النمو الشهري"
            subtitle="آخر 6 أشهر"
            type="bar"
            data={dashboardService.generateGrowthChart(metrics.activity)}
            height={200}
          />
        </View>

        {/* Additional Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            آخر تحديث: {lastUpdated.toLocaleString('ar-SA')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  metricsGrid: {
    gap: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
