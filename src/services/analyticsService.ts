// Analytics Service - Comprehensive user behavior tracking
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics (web only for now)
let analytics: any = null;
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Analytics Event Types
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp?: number;
}

export interface UserProperties {
  user_id?: string;
  user_type?: 'guest' | 'registered' | 'premium';
  language?: string;
  platform?: string;
  app_version?: string;
}

export interface SessionData {
  session_id: string;
  start_time: number;
  end_time?: number;
  duration?: number;
  page_views: number;
  events: AnalyticsEvent[];
  user_journey: string[];
}

// Analytics Service Class
class AnalyticsService {
  private sessionId: string;
  private sessionStartTime: number;
  private currentScreen: string = '';
  private userJourney: string[] = [];
  private sessionEvents: AnalyticsEvent[] = [];
  private pageViewCount: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    this.logEvent('session_start', {
      session_id: this.sessionId,
      platform: Platform.OS,
      timestamp: this.sessionStartTime,
    });
  }

  // Core Analytics Methods
  public logEvent(eventName: string, parameters?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      parameters: {
        ...parameters,
        session_id: this.sessionId,
        timestamp: Date.now(),
        platform: Platform.OS,
      },
      timestamp: Date.now(),
    };

    this.sessionEvents.push(event);

    // Log to Firebase Analytics
    if (analytics) {
      logEvent(analytics, eventName, event.parameters);
    }

    // Log to console for development
    if (__DEV__) {
      console.log('📊 Analytics Event:', eventName, event.parameters);
    }
  }

  // Page View Tracking
  public trackPageView(screenName: string, parameters?: Record<string, any>): void {
    this.currentScreen = screenName;
    this.userJourney.push(screenName);
    this.pageViewCount++;

    this.logEvent('page_view', {
      screen_name: screenName,
      page_view_count: this.pageViewCount,
      user_journey: this.userJourney,
      ...parameters,
    });

    // Track screen view in Firebase
    if (analytics) {
      logEvent(analytics, 'screen_view', {
        screen_name: screenName,
        screen_class: screenName,
      });
    }
  }

  // Button Click Tracking
  public trackButtonClick(
    buttonName: string,
    screenName?: string,
    parameters?: Record<string, any>
  ): void {
    this.logEvent('button_click', {
      button_name: buttonName,
      screen_name: screenName || this.currentScreen,
      ...parameters,
    });
  }

  // User Journey Tracking
  public trackUserJourney(action: string, parameters?: Record<string, any>): void {
    this.logEvent('user_journey', {
      action,
      current_screen: this.currentScreen,
      journey_step: this.userJourney.length,
      ...parameters,
    });
  }

  // Drop-off Point Tracking
  public trackDropOff(reason: string, screenName?: string, parameters?: Record<string, any>): void {
    this.logEvent('user_drop_off', {
      drop_off_reason: reason,
      screen_name: screenName || this.currentScreen,
      journey_length: this.userJourney.length,
      session_duration: Date.now() - this.sessionStartTime,
      ...parameters,
    });
  }

  // Session Management
  public endSession(): SessionData {
    const endTime = Date.now();
    const duration = endTime - this.sessionStartTime;

    const sessionData: SessionData = {
      session_id: this.sessionId,
      start_time: this.sessionStartTime,
      end_time: endTime,
      duration,
      page_views: this.pageViewCount,
      events: this.sessionEvents,
      user_journey: this.userJourney,
    };

    this.logEvent('session_end', {
      session_duration: duration,
      page_views: this.pageViewCount,
      total_events: this.sessionEvents.length,
      journey_length: this.userJourney.length,
    });

    return sessionData;
  }

  // User Properties
  public setUserProperties(properties: UserProperties): void {
    if (analytics) {
      setUserProperties(analytics, properties);
    }

    this.logEvent('user_properties_set', properties);
  }

  public setUserId(userId: string): void {
    if (analytics) {
      setUserId(analytics, userId);
    }

    this.logEvent('user_id_set', { user_id: userId });
  }

  // Custom Event Tracking
  public trackCustomEvent(eventName: string, parameters?: Record<string, any>): void {
    this.logEvent(eventName, parameters);
  }

  // Performance Tracking
  public trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.logEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
    });
  }

  // Error Tracking
  public trackError(error: string, context?: Record<string, any>): void {
    this.logEvent('error_occurred', {
      error_message: error,
      current_screen: this.currentScreen,
      ...context,
    });
  }

  // Get Current Session Data
  public getCurrentSessionData(): Partial<SessionData> {
    return {
      session_id: this.sessionId,
      start_time: this.sessionStartTime,
      page_views: this.pageViewCount,
      user_journey: this.userJourney,
      current_screen: this.currentScreen,
    };
  }

  // Get Analytics Results (for custom dashboard)
  public getAnalyticsResults(): {
    sessionData: Partial<SessionData>;
    recentEvents: AnalyticsEvent[];
    userJourney: string[];
  } {
    return {
      sessionData: this.getCurrentSessionData(),
      recentEvents: this.sessionEvents.slice(-10), // Last 10 events
      userJourney: this.userJourney,
    };
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export types and service
export default analyticsService;
export { AnalyticsService };
