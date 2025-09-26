// Analytics Hooks - Easy integration with React components
import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import analyticsService, { AnalyticsEvent, UserProperties } from '../services/analyticsService';

// Hook for automatic page view tracking
export const usePageTracking = (screenName?: string) => {
  const pathname = usePathname();
  const router = useRouter();
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    const currentScreen = screenName || pathname;
    
    // Only track if it's a new screen
    if (trackedRef.current !== currentScreen) {
      analyticsService.trackPageView(currentScreen, {
        route: pathname,
        timestamp: Date.now(),
      });
      trackedRef.current = currentScreen;
    }
  }, [pathname, screenName]);
};

// Hook for button click tracking
export const useButtonTracking = () => {
  const trackClick = useCallback((
    buttonName: string,
    parameters?: Record<string, any>
  ) => {
    analyticsService.trackButtonClick(buttonName, undefined, parameters);
  }, []);

  return { trackClick };
};

// Hook for user journey tracking
export const useUserJourney = () => {
  const trackJourney = useCallback((
    action: string,
    parameters?: Record<string, any>
  ) => {
    analyticsService.trackUserJourney(action, parameters);
  }, []);

  const trackDropOff = useCallback((
    reason: string,
    parameters?: Record<string, any>
  ) => {
    analyticsService.trackDropOff(reason, undefined, parameters);
  }, []);

  return { trackJourney, trackDropOff };
};

// Hook for custom event tracking
export const useCustomTracking = () => {
  const trackEvent = useCallback((
    eventName: string,
    parameters?: Record<string, any>
  ) => {
    analyticsService.trackCustomEvent(eventName, parameters);
  }, []);

  const trackPerformance = useCallback((
    metric: string,
    value: number,
    unit: string = 'ms'
  ) => {
    analyticsService.trackPerformance(metric, value, unit);
  }, []);

  const trackError = useCallback((
    error: string,
    context?: Record<string, any>
  ) => {
    analyticsService.trackError(error, context);
  }, []);

  return { trackEvent, trackPerformance, trackError };
};

// Hook for user properties management
export const useUserProperties = () => {
  const setUserProperties = useCallback((properties: UserProperties) => {
    analyticsService.setUserProperties(properties);
  }, []);

  const setUserId = useCallback((userId: string) => {
    analyticsService.setUserId(userId);
  }, []);

  return { setUserProperties, setUserId };
};

// Hook for session management
export const useSessionTracking = () => {
  const getSessionData = useCallback(() => {
    return analyticsService.getCurrentSessionData();
  }, []);

  const getAnalyticsResults = useCallback(() => {
    return analyticsService.getAnalyticsResults();
  }, []);

  const endSession = useCallback(() => {
    return analyticsService.endSession();
  }, []);

  return { getSessionData, getAnalyticsResults, endSession };
};

// Combined hook for all analytics functionality
export const useAnalytics = () => {
  const pageTracking = usePageTracking();
  const buttonTracking = useButtonTracking();
  const userJourney = useUserJourney();
  const customTracking = useCustomTracking();
  const userProperties = useUserProperties();
  const sessionTracking = useSessionTracking();

  return {
    // Page tracking
    ...pageTracking,
    
    // Button tracking
    ...buttonTracking,
    
    // User journey
    ...userJourney,
    
    // Custom tracking
    ...customTracking,
    
    // User properties
    ...userProperties,
    
    // Session tracking
    ...sessionTracking,
  };
};

export default useAnalytics;

