// Analytics Dashboard - View analytics results in your app
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAnalytics } from '../src/hooks/useAnalytics';
import analyticsService from '../src/services/analyticsService';

interface AnalyticsData {
  sessionData: any;
  recentEvents: any[];
  userJourney: string[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getAnalyticsResults } = useAnalytics();

  const loadAnalyticsData = async () => {
    try {
      const data = getAnalyticsResults();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnalyticsData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const exportData = () => {
    if (!analyticsData) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      sessionData: analyticsData.sessionData,
      recentEvents: analyticsData.recentEvents,
      userJourney: analyticsData.userJourney,
    };
    
    // In a real app, you'd implement proper export functionality
    Alert.alert(
      'Export Data',
      `Session ID: ${analyticsData.sessionData.session_id}\nEvents: ${analyticsData.recentEvents.length}\nJourney Steps: ${analyticsData.userJourney.length}`,
      [{ text: 'OK' }]
    );
    
    console.log('Analytics Export Data:', exportData);
  };

  if (!analyticsData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportData}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Session Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Overview</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Session ID:</Text>
            <Text style={styles.statValue}>{analyticsData.sessionData.session_id}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Page Views:</Text>
            <Text style={styles.statValue}>{analyticsData.sessionData.page_views}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Screen:</Text>
            <Text style={styles.statValue}>{analyticsData.sessionData.current_screen}</Text>
          </View>
          {analyticsData.sessionData.start_time && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Session Start:</Text>
              <Text style={styles.statValue}>
                {formatTimestamp(analyticsData.sessionData.start_time)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* User Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Journey</Text>
        <View style={styles.card}>
          {analyticsData.userJourney.length > 0 ? (
            analyticsData.userJourney.map((step, index) => (
              <View key={index} style={styles.journeyStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No journey data available</Text>
          )}
        </View>
      </View>

      {/* Recent Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Events</Text>
        <View style={styles.card}>
          {analyticsData.recentEvents.length > 0 ? (
            analyticsData.recentEvents.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventTime}>
                    {event.timestamp ? formatTimestamp(event.timestamp) : 'N/A'}
                  </Text>
                </View>
                {event.parameters && Object.keys(event.parameters).length > 0 && (
                  <View style={styles.eventParams}>
                    {Object.entries(event.parameters).map(([key, value]) => (
                      <Text key={key} style={styles.paramText}>
                        {key}: {String(value)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No events recorded</Text>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => analyticsService.trackCustomEvent('dashboard_viewed', { source: 'analytics_dashboard' })}
          >
            <Text style={styles.actionButtonText}>Test Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => analyticsService.trackButtonClick('refresh_analytics', 'analytics_dashboard')}
          >
            <Text style={styles.actionButtonText}>Test Button</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  eventItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
  },
  eventParams: {
    marginTop: 4,
  },
  paramText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AnalyticsDashboard;

