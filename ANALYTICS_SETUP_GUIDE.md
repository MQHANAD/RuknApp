# Analytics Setup Guide

## Overview
This guide explains how to set up and use the comprehensive analytics system for tracking user behavior in your RuknApp. The system provides both internal analytics dashboard and external Firebase/Google Analytics integration.

## Features Implemented

### 1. **Real-time Analytics Dashboard**
- In-app analytics viewing with live data
- Session overview with key metrics
- User journey visualization with step-by-step tracking
- Recent events display with detailed parameters
- Data export functionality
- Auto-refresh every 30 seconds

### 2. **Comprehensive Event Tracking**
- **Session Management**: Automatic session start/end tracking
- **Navigation**: Page views and screen transitions
- **User Interactions**: Button clicks, searches, filters
- **Business Logic**: Place views, favorites, business type selection
- **Authentication**: Signup, signin, signout events
- **Performance**: App performance metrics tracking
- **Errors**: Comprehensive error tracking and context

### 3. **User Journey and Drop-off Analysis**
- Complete user flow tracking with numbered steps
- Drop-off point identification with context
- Session duration and engagement metrics
- Funnel analysis capabilities
- User behavior pattern recognition

### 4. **External Analytics Integration**
- Firebase Analytics for real-time tracking
- Google Analytics 4 for enhanced reporting
- Automatic event synchronization
- Historical data analysis
- Advanced segmentation and audience analysis

## Setup Instructions

### Step 1: Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Analytics

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Add a web app to your project
   - Copy the Firebase configuration

3. **Add Environment Variables**
   Create a `.env` file in your project root:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Step 2: Integration

#### Automatic Page Tracking
```tsx
import { usePageTracking } from '../src/hooks/useAnalytics';

export const MyScreen = () => {
  usePageTracking('my_screen_name'); // Automatically tracks page views
  
  return (
    // Your component content
  );
};
```

#### Button Click Tracking
```tsx
import { useButtonTracking } from '../src/hooks/useAnalytics';

export const MyComponent = () => {
  const { trackClick } = useButtonTracking();
  
  const handlePress = () => {
    trackClick('submit_button', {
      form_type: 'contact',
      screen: 'contact_form'
    });
  };
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Submit</Text>
    </TouchableOpacity>
  );
};
```

#### User Journey Tracking
```tsx
import { useUserJourney } from '../src/hooks/useAnalytics';

export const MyComponent = () => {
  const { trackJourney, trackDropOff } = useUserJourney();
  
  const handleNextStep = () => {
    trackJourney('form_step_completed', {
      step_number: 2,
      form_type: 'registration'
    });
  };
  
  const handleAbandon = () => {
    trackDropOff('form_abandoned', {
      step: 'payment',
      reason: 'user_confusion'
    });
  };
};
```

## Viewing Analytics Results

### 1. **In-App Analytics Dashboard** (Primary)
- **Component**: `AnalyticsDashboard`
- **Access**: Navigate to `/analytics-test` in your app
- **Features**:
  - Real-time session data with live updates
  - User journey visualization with numbered steps
  - Recent events display with detailed parameters
  - Session overview with key metrics
  - Data export functionality
  - Auto-refresh every 30 seconds

### 2. **Firebase Console** (External Analytics)
- **URL**: https://console.firebase.google.com/project/rukn-32c66/analytics
- **Real-time data**: Available immediately
- **Historical data**: 24-48 hour processing delay

**Key Sections:**
- **Events**: All custom events with parameters
- **Audiences**: User segments and demographics
- **Funnels**: User journey analysis and conversion tracking
- **Retention**: User return patterns and engagement
- **DebugView**: Real-time event testing and validation

### 3. **Google Analytics 4** (Enhanced Reporting)
- **URL**: https://analytics.google.com/
- **Features**:
  - Advanced segmentation and audience analysis
  - Enhanced data visualization with charts and funnels
  - Machine learning insights and predictions
  - Custom reports and dashboards
  - Data export capabilities to BigQuery
  - Cohort analysis and user lifetime value

### 4. **Development Console** (Debugging)
- **Real-time logging**: All events logged to console in development
- **Debug mode**: Detailed event information and parameters
- **Testing**: Verify events are firing correctly
- **Error tracking**: Comprehensive error logging and context

## Analytics Events

### Automatic Events (Tracked Automatically)
- `session_start`: User begins a new session with session ID and platform info
- `session_end`: User ends session with duration and engagement metrics
- `page_view`: Screen navigation with journey tracking
- `screen_view`: Firebase automatic screen tracking

### User Interaction Events
- `button_click`: Button interactions with context and screen information
- `search_performed`: Search actions with query and results data
- `filter_applied`: Filter usage with type and value information

### User Journey Events
- `user_journey`: User flow progression with step tracking
- `user_drop_off`: Abandonment points with reason and context
- `business_type_selected`: Business type selection in onboarding

### Business Logic Events
- `place_viewed`: Location detail views with place information
- `place_favorited`: Favorite actions with place context
- `user_signup`: User registration with method tracking
- `user_signin`: User login with authentication method
- `user_signout`: User logout with context

### Performance and Error Events
- `performance_metric`: App performance measurements
- `error_occurred`: Error tracking with context and screen information
- `user_properties_set`: User property updates
- `custom_event`: Application-specific events

### Event Parameters
All events automatically include:
- `session_id`: Unique session identifier
- `timestamp`: Event timestamp (Unix timestamp)
- `platform`: Platform (ios/android/web)
- `screen_name`: Current screen (when available)
- Custom parameters specific to each event type

### Complete Event List
For a comprehensive list of all tracked events with detailed parameters, see [EVENT_TRACKING_LIST.md](./EVENT_TRACKING_LIST.md).

## Best Practices

### 1. **Event Naming**
- Use snake_case for event names
- Be descriptive and consistent
- Group related events with prefixes

### 2. **Parameter Usage**
- Keep parameters under 25 characters
- Use meaningful parameter names
- Avoid sensitive data in parameters

### 3. **Performance**
- Analytics calls are asynchronous
- No impact on app performance
- Automatic error handling

### 4. **Privacy**
- No personal data in events
- User consent for tracking
- GDPR compliance considerations

## Testing

### 1. **Debug Mode**
```tsx
// Enable debug logging
if (__DEV__) {
  console.log('Analytics Event:', eventName, parameters);
}
```

### 2. **Firebase DebugView**
- Enable debug mode in Firebase
- View real-time events
- Test event parameters

### 3. **Custom Dashboard**
- Use `AnalyticsDashboard` component
- View live session data
- Test event tracking

## Troubleshooting

### Common Issues

1. **Events not appearing in Firebase**
   - Check Firebase configuration
   - Verify environment variables
   - Check network connectivity

2. **Analytics not working on mobile**
   - Ensure proper Firebase setup
   - Check platform-specific configuration
   - Verify permissions

3. **Custom dashboard not updating**
   - Check component integration
   - Verify hook usage
   - Check for JavaScript errors

### Debug Steps

1. **Check Console Logs**
   - Look for analytics event logs
   - Check for error messages
   - Verify event parameters

2. **Test Firebase Connection**
   - Use Firebase DebugView
   - Check Firebase Console
   - Verify project configuration

3. **Validate Environment**
   - Check environment variables
   - Verify Firebase config
   - Test in different environments

## Support

For issues or questions:
1. Check Firebase documentation
2. Review console logs
3. Test with debug mode
4. Verify configuration

## Next Steps

1. **Set up Firebase project** and configure Google Analytics
2. **Add environment variables** to your `.env` file
3. **Integrate analytics hooks** into your existing components
4. **Test with analytics dashboard** using `/analytics-test` screen
5. **View results** in Firebase Console and Google Analytics 4
6. **Monitor user behavior** and optimize based on insights

## Documentation References

- **[Dashboard Features](./DASHBOARD_FEATURES.md)**: Detailed documentation of the analytics dashboard
- **[Event Tracking List](./EVENT_TRACKING_LIST.md)**: Comprehensive list of all tracked events
- **[Integration Examples](./ANALYTICS_INTEGRATION_EXAMPLES.md)**: Code examples and integration patterns

## Analytics URLs

- **Firebase Console**: https://console.firebase.google.com/project/rukn-32c66/analytics
- **Google Analytics 4**: https://analytics.google.com/
- **Test Screen**: Navigate to `/analytics-test` in your app

The analytics system is now ready to track user behavior and provide valuable insights into your app's usage patterns! The combination of in-app dashboard and external analytics provides comprehensive coverage for both real-time monitoring and historical analysis.

