// Analytics Test Screen - Test your analytics implementation
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAnalytics } from '../src/hooks/useAnalytics';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AnalyticsTestScreen() {
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    trackClick,
    trackJourney,
    trackEvent,
    trackDropOff,
    setUserProperties,
    getAnalyticsResults,
  } = useAnalytics();

  const handleTestButtonClick = () => {
    trackClick('test_button', {
      button_type: 'primary',
      screen: 'analytics_test',
      test_mode: true,
    });
    Alert.alert('Success', 'Button click tracked!');
  };

  const handleTestUserJourney = () => {
    trackJourney('test_journey_step', {
      step: 'analytics_testing',
      user_action: 'explore_features',
    });
    Alert.alert('Success', 'User journey tracked!');
  };

  const handleTestCustomEvent = () => {
    trackEvent('test_custom_event', {
      event_type: 'demo',
      timestamp: Date.now(),
      test_data: 'analytics_working',
    });
    Alert.alert('Success', 'Custom event tracked!');
  };

  const handleTestDropOff = () => {
    trackDropOff('test_drop_off', {
      reason: 'user_testing',
      screen: 'analytics_test',
    });
    Alert.alert('Success', 'Drop-off point tracked!');
  };

  const handleSetUserProperties = () => {
    setUserProperties({
      user_type: 'test_user',
      language: 'en',
      platform: 'mobile',
      test_mode: true,
    });
    Alert.alert('Success', 'User properties set!');
  };

  const handleViewResults = () => {
    const results = getAnalyticsResults();
    Alert.alert(
      'Analytics Results',
      `Session ID: ${results.sessionData.session_id}\nPage Views: ${results.sessionData.page_views}\nEvents: ${results.recentEvents.length}\nJourney Steps: ${results.userJourney.length}`
    );
  };

  if (showDashboard) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowDashboard(false)}
        >
          <Text style={styles.backButtonText}>← Back to Tests</Text>
        </TouchableOpacity>
        <AnalyticsDashboard />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Test Screen</Text>
        <Text style={styles.subtitle}>
          Test your Firebase Analytics implementation
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Analytics Events</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleTestButtonClick}>
          <Text style={styles.buttonText}>Test Button Click</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTestUserJourney}>
          <Text style={styles.buttonText}>Test User Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTestCustomEvent}>
          <Text style={styles.buttonText}>Test Custom Event</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTestDropOff}>
          <Text style={styles.buttonText}>Test Drop-off Point</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSetUserProperties}>
          <Text style={styles.buttonText}>Set User Properties</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>View Results</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleViewResults}>
          <Text style={styles.buttonText}>View Current Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dashboardButton]}
          onPress={() => setShowDashboard(true)}
        >
          <Text style={styles.buttonText}>Open Analytics Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firebase Console</Text>
        <Text style={styles.infoText}>
          View detailed analytics in Firebase Console:
        </Text>
        <Text style={styles.linkText}>
          https://console.firebase.google.com/project/rukn-32c66/analytics
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Google Analytics 4</Text>
        <Text style={styles.infoText}>
          View enhanced reports in Google Analytics:
        </Text>
        <Text style={styles.linkText}>
          https://analytics.google.com/
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dashboardButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
});

