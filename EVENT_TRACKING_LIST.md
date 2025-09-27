# Event Tracking List - Comprehensive User Behavior Analytics

## Overview
This document provides a complete list of all tracked events in the RuknApp analytics system. Events are categorized by type and include detailed parameter information for comprehensive user behavior analysis.

## Event Categories

### 1. Session Management Events

#### `session_start`
**Purpose**: Track when a user begins a new session
**Trigger**: App launch or session initialization
**Parameters**:
```typescript
{
  session_id: string,        // Unique session identifier
  platform: string,         // ios/android/web
  timestamp: number,         // Session start time
  app_version?: string,      // App version (if available)
  device_info?: object       // Device information (if available)
}
```
**Example**:
```json
{
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios",
  "timestamp": 1703123456789,
  "app_version": "1.0.0"
}
```

#### `session_end`
**Purpose**: Track when a user ends their session
**Trigger**: App background/close or explicit session end
**Parameters**:
```typescript
{
  session_id: string,        // Session identifier
  session_duration: number,  // Total session duration in ms
  page_views: number,        // Total page views in session
  total_events: number,      // Total events tracked
  journey_length: number,    // Number of journey steps
  platform: string,         // Platform
  timestamp: number          // Session end time
}
```
**Example**:
```json
{
  "session_id": "session_1703123456789_abc123def",
  "session_duration": 300000,
  "page_views": 5,
  "total_events": 12,
  "journey_length": 4,
  "platform": "ios",
  "timestamp": 1703123756789
}
```

### 2. Navigation Events

#### `page_view`
**Purpose**: Track screen/page views
**Trigger**: Screen navigation or component mount
**Parameters**:
```typescript
{
  screen_name: string,       // Name of the screen
  page_view_count: number,   // Total page views in session
  user_journey: string[],    // Complete user journey
  route?: string,           // Route path (for web)
  timestamp: number,         // View timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```
**Example**:
```json
{
  "screen_name": "home_screen",
  "page_view_count": 3,
  "user_journey": ["splash", "onboarding", "home_screen"],
  "route": "/home",
  "timestamp": 1703123456789,
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios"
}
```

#### `screen_view` (Firebase Automatic)
**Purpose**: Firebase automatic screen tracking
**Trigger**: Automatic Firebase screen detection
**Parameters**:
```typescript
{
  screen_name: string,       // Screen name
  screen_class: string,      // Screen class
  firebase_screen_id?: string // Firebase screen ID
}
```

### 3. User Interaction Events

#### `button_click`
**Purpose**: Track button interactions
**Trigger**: Button press/tap
**Parameters**:
```typescript
{
  button_name: string,       // Button identifier
  screen_name: string,       // Current screen
  button_type?: string,      // Primary/secondary/etc
  button_context?: string,   // Additional context
  timestamp: number,         // Click timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```
**Example**:
```json
{
  "button_name": "submit_button",
  "screen_name": "contact_form",
  "button_type": "primary",
  "button_context": "form_submission",
  "timestamp": 1703123456789,
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios"
}
```

#### `search_performed`
**Purpose**: Track search actions
**Trigger**: Search button press or search submission
**Parameters**:
```typescript
{
  search_query: string,      // Search term
  search_type?: string,      // Type of search
  results_count?: number,    // Number of results
  screen_name: string,       // Current screen
  timestamp: number,         // Search timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

#### `filter_applied`
**Purpose**: Track filter usage
**Trigger**: Filter selection or application
**Parameters**:
```typescript
{
  filter_type: string,       // Type of filter
  filter_value: any,         // Filter value
  screen_name: string,       // Current screen
  timestamp: number,         // Filter timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

### 4. User Journey Events

#### `user_journey`
**Purpose**: Track user flow progression
**Trigger**: Significant user actions or milestones
**Parameters**:
```typescript
{
  action: string,            // Journey action
  current_screen: string,    // Current screen
  journey_step: number,      // Step number in journey
  journey_context?: object,  // Additional journey context
  timestamp: number,         // Action timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```
**Example**:
```json
{
  "action": "onboarding_completed",
  "current_screen": "home_screen",
  "journey_step": 5,
  "journey_context": {
    "onboarding_type": "first_time_user",
    "completion_time": 120000
  },
  "timestamp": 1703123456789,
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios"
}
```

#### `user_drop_off`
**Purpose**: Track abandonment points
**Trigger**: User exits or abandons a flow
**Parameters**:
```typescript
{
  drop_off_reason: string,   // Reason for drop-off
  screen_name: string,       // Screen where drop-off occurred
  journey_length: number,    // Journey length at drop-off
  session_duration: number,  // Session duration at drop-off
  drop_off_context?: object, // Additional context
  timestamp: number,         // Drop-off timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```
**Example**:
```json
{
  "drop_off_reason": "form_abandoned",
  "screen_name": "registration_form",
  "journey_length": 3,
  "session_duration": 45000,
  "drop_off_context": {
    "form_step": "payment_info",
    "form_completion": 0.7
  },
  "timestamp": 1703123456789,
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios"
}
```

### 5. Business Logic Events

#### `place_viewed`
**Purpose**: Track when users view location details
**Trigger**: Place detail screen view
**Parameters**:
```typescript
{
  place_id: string,          // Place identifier
  place_name: string,        // Place name
  place_category: string,    // Place category
  place_rating?: number,     // Place rating
  place_price_range?: string, // Price range
  screen_name: string,       // Current screen
  timestamp: number,         // View timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

#### `place_favorited`
**Purpose**: Track place favorites
**Trigger**: Add/remove from favorites
**Parameters**:
```typescript
{
  place_id: string,          // Place identifier
  action: string,            // "add" or "remove"
  place_category: string,    // Place category
  screen_name: string,       // Current screen
  timestamp: number,         // Action timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

#### `business_type_selected`
**Purpose**: Track business type selection
**Trigger**: Business type selection in onboarding
**Parameters**:
```typescript
{
  business_type: string,     // Selected business type
  selection_method: string,  // How it was selected
  screen_name: string,       // Current screen
  timestamp: number,         // Selection timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

### 6. Authentication Events

#### `user_signup`
**Purpose**: Track user registration
**Trigger**: Successful user registration
**Parameters**:
```typescript
{
  signup_method: string,     // Registration method
  user_type?: string,        // Type of user
  screen_name: string,       // Registration screen
  timestamp: number,         // Signup timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

#### `user_signin`
**Purpose**: Track user login
**Trigger**: Successful user login
**Parameters**:
```typescript
{
  signin_method: string,     // Login method
  user_type?: string,        // Type of user
  screen_name: string,       // Login screen
  timestamp: number,         // Signin timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

#### `user_signout`
**Purpose**: Track user logout
**Trigger**: User logout action
**Parameters**:
```typescript
{
  logout_reason?: string,    // Reason for logout
  screen_name: string,       // Current screen
  timestamp: number,         // Logout timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

### 7. Performance Events

#### `performance_metric`
**Purpose**: Track app performance metrics
**Trigger**: Performance measurements
**Parameters**:
```typescript
{
  metric_name: string,       // Performance metric name
  metric_value: number,      // Metric value
  metric_unit: string,       // Unit (ms, bytes, etc.)
  screen_name?: string,      // Associated screen
  timestamp: number,         // Measurement timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```
**Example**:
```json
{
  "metric_name": "screen_load_time",
  "metric_value": 1250,
  "metric_unit": "ms",
  "screen_name": "home_screen",
  "timestamp": 1703123456789,
  "session_id": "session_1703123456789_abc123def",
  "platform": "ios"
}
```

### 8. Error Events

#### `error_occurred`
**Purpose**: Track application errors
**Trigger**: Error occurrence
**Parameters**:
```typescript
{
  error_message: string,     // Error message
  error_type?: string,       // Error type/category
  current_screen: string,    // Screen where error occurred
  error_context?: object,    // Additional error context
  timestamp: number,         // Error timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

### 9. User Properties Events

#### `user_properties_set`
**Purpose**: Track user property updates
**Trigger**: User property changes
**Parameters**:
```typescript
{
  user_id?: string,          // User identifier
  user_type?: string,        // User type
  language?: string,         // User language
  platform?: string,        // Platform
  app_version?: string,      // App version
  custom_properties?: object // Custom user properties
}
```

#### `user_id_set`
**Purpose**: Track user ID assignment
**Trigger**: User ID assignment
**Parameters**:
```typescript
{
  user_id: string,           // Assigned user ID
  timestamp: number,         // Assignment timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

### 10. Custom Events

#### `custom_event`
**Purpose**: Track application-specific events
**Trigger**: Custom application logic
**Parameters**:
```typescript
{
  event_name: string,        // Custom event name
  event_category?: string,   // Event category
  custom_parameters?: object, // Custom parameters
  screen_name?: string,      // Associated screen
  timestamp: number,         // Event timestamp
  session_id: string,        // Session identifier
  platform: string          // Platform
}
```

## Event Parameter Standards

### Standard Parameters (Included in All Events)
Every event automatically includes these standard parameters:

```typescript
{
  session_id: string,        // Unique session identifier
  timestamp: number,         // Event timestamp (Unix timestamp)
  platform: string          // Platform: "ios", "android", or "web"
}
```

### Optional Standard Parameters
These parameters are included when available:

```typescript
{
  screen_name?: string,      // Current screen name
  user_id?: string,          // User identifier (if authenticated)
  app_version?: string,      // App version
  device_info?: object       // Device information
}
```

## Event Naming Conventions

### Naming Rules
1. **Use snake_case**: All event names use lowercase with underscores
2. **Be descriptive**: Event names should clearly indicate the action
3. **Use consistent prefixes**: Group related events with prefixes
4. **Avoid abbreviations**: Use full words for clarity

### Naming Examples
- ✅ `button_click`
- ✅ `user_signup`
- ✅ `place_viewed`
- ✅ `performance_metric`
- ❌ `btnClick`
- ❌ `userSignup`
- ❌ `placeView`
- ❌ `perfMetric`

## Event Categories and Prefixes

### Category Prefixes
- **Session**: `session_*`
- **Navigation**: `page_*`, `screen_*`
- **Interaction**: `button_*`, `search_*`, `filter_*`
- **Journey**: `user_journey`, `user_drop_off`
- **Business**: `place_*`, `business_*`
- **Auth**: `user_signup`, `user_signin`, `user_signout`
- **Performance**: `performance_*`
- **Error**: `error_*`
- **User**: `user_properties_*`, `user_id_*`
- **Custom**: `custom_*`

## Event Tracking Implementation

### Automatic Events
These events are tracked automatically without developer intervention:
- `session_start`
- `session_end`
- `page_view`
- `screen_view` (Firebase)

### Manual Events
These events require explicit tracking in code:
- All button clicks
- Custom business logic events
- Performance metrics
- Error tracking

### Integration Examples

#### Button Click Tracking
```typescript
import { useButtonTracking } from '../src/hooks/useAnalytics';

const { trackClick } = useButtonTracking();

const handleSubmit = () => {
  trackClick('submit_button', {
    form_type: 'contact',
    screen: 'contact_form'
  });
  // Your existing logic
};
```

#### Custom Event Tracking
```typescript
import { useCustomTracking } from '../src/hooks/useAnalytics';

const { trackEvent } = useCustomTracking();

const handlePlaceView = (place) => {
  trackEvent('place_viewed', {
    place_id: place.id,
    place_name: place.name,
    place_category: place.category,
    place_rating: place.rating
  });
};
```

#### User Journey Tracking
```typescript
import { useUserJourney } from '../src/hooks/useAnalytics';

const { trackJourney, trackDropOff } = useUserJourney();

const handleStepComplete = () => {
  trackJourney('onboarding_step_completed', {
    step_number: 2,
    step_name: 'profile_setup'
  });
};

const handleFormAbandon = () => {
  trackDropOff('form_abandoned', {
    step: 'payment_info',
    reason: 'user_confusion'
  });
};
```

## Privacy and Compliance

### Data Collection Principles
1. **No Personal Data**: Events don't contain personally identifiable information
2. **Anonymous Tracking**: Session IDs are anonymous and temporary
3. **User Consent**: Analytics tracking respects user privacy preferences
4. **Data Minimization**: Only necessary data is collected

### GDPR Compliance
- Anonymous session tracking
- No personal data in events
- User consent for tracking
- Data retention policies
- Right to data deletion

### Data Retention
- **Session Data**: Temporary, deleted after session end
- **Analytics Data**: Retained according to Firebase/Google Analytics policies
- **User Properties**: Retained until user deletion or consent withdrawal

## Analytics Platforms Integration

### Firebase Analytics
All events are automatically sent to Firebase Analytics for:
- Real-time event tracking
- Historical data analysis
- User segmentation
- Funnel analysis
- Retention analysis

### Google Analytics 4
Enhanced analytics features available through GA4:
- Advanced segmentation
- Machine learning insights
- Custom reports
- Data export to BigQuery
- Enhanced measurement

### Custom Dashboard
Real-time analytics viewing through the in-app dashboard:
- Live session data
- Recent events display
- User journey visualization
- Performance metrics
- Data export functionality

This comprehensive event tracking system provides detailed insights into user behavior, app performance, and business metrics while maintaining user privacy and compliance with data protection regulations.
