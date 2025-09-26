# Analytics Setup Guide

## Overview
This guide explains how to set up and use the comprehensive analytics system for tracking user behavior in your RuknApp.

## Features Implemented

### 1. **Page Views and Navigation**
- Automatic screen tracking
- Manual page view tracking
- Navigation flow analysis

### 2. **Button Clicks and Interactions**
- Button click tracking
- Custom interaction events
- User engagement metrics

### 3. **User Journey and Drop-off Points**
- Complete user journey tracking
- Drop-off point identification
- Funnel analysis

### 4. **Session Duration and Frequency**
- Session start/end tracking
- Session duration measurement
- User return patterns

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

### 1. **Firebase Console** (Primary)
- **URL**: https://console.firebase.google.com/
- **Real-time data**: Available immediately
- **Historical data**: 24-48 hour processing delay

**Key Sections:**
- **Events**: All custom events
- **Audiences**: User segments
- **Funnels**: User journey analysis
- **Retention**: User return patterns
- **DebugView**: Real-time event testing

### 2. **Google Analytics 4** (Enhanced)
- **URL**: https://analytics.google.com/
- **More detailed reports**: Advanced segmentation
- **Better visualization**: Charts, funnels, cohorts
- **Export capabilities**: Data export to BigQuery

### 3. **Custom Analytics Dashboard**
- **Component**: `AnalyticsDashboard`
- **Real-time data**: Live session tracking
- **In-app viewing**: View analytics within your app
- **Export functionality**: Data export capabilities

### 4. **Development Console**
- **Real-time logging**: All events logged to console
- **Debug mode**: Detailed event information
- **Testing**: Verify events are firing correctly

## Analytics Events

### Automatic Events
- `session_start`: When user starts a session
- `session_end`: When user ends a session
- `page_view`: When user views a screen
- `screen_view`: Firebase automatic screen tracking

### Custom Events
- `button_click`: Button interactions
- `user_journey`: User flow tracking
- `user_drop_off`: Abandonment points
- `performance_metric`: Performance tracking
- `error_occurred`: Error tracking

### Event Parameters
All events include:
- `session_id`: Unique session identifier
- `timestamp`: Event timestamp
- `platform`: Platform (ios/android/web)
- `screen_name`: Current screen
- Custom parameters as needed

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

1. **Set up Firebase project**
2. **Add environment variables**
3. **Integrate analytics hooks**
4. **Test with custom dashboard**
5. **View results in Firebase Console**

The analytics system is now ready to track user behavior and provide valuable insights into your app's usage patterns!

