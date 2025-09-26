// Analytics Integration Example - How to use analytics in your components
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAnalytics } from '../src/hooks/useAnalytics';

export const AnalyticsExample: React.FC = () => {
  const {
    trackClick,
    trackJourney,
    trackEvent,
    trackDropOff,
    setUserProperties,
  } = useAnalytics();

  const handleButtonClick = () => {
    // Track button click
    trackClick('example_button', {
      button_type: 'primary',
      screen: 'analytics_example',
    });
  };

  const handleUserJourney = () => {
    // Track user journey step
    trackJourney('feature_exploration', {
      feature_name: 'analytics_demo',
      user_action: 'explore',
    });
  };

  const handleCustomEvent = () => {
    // Track custom event
    trackEvent('custom_interaction', {
      interaction_type: 'demo',
      timestamp: Date.now(),
    });
  };

  const handleDropOff = () => {
    // Track drop-off point
    trackDropOff('user_confusion', {
      screen: 'analytics_example',
      reason: 'demo_purpose',
    });
  };

  const handleSetUserProperties = () => {
    // Set user properties
    setUserProperties({
      user_type: 'demo_user',
      language: 'en',
      platform: 'mobile',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Integration Example</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Track Button Click</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUserJourney}>
        <Text style={styles.buttonText}>Track User Journey</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCustomEvent}>
        <Text style={styles.buttonText}>Track Custom Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDropOff}>
        <Text style={styles.buttonText}>Track Drop-off</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSetUserProperties}>
        <Text style={styles.buttonText}>Set User Properties</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AnalyticsExample;

