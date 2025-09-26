# Analytics Integration Examples

## Quick Start - Test Your Analytics

### 1. **Test the Analytics System**
Navigate to: `/analytics-test` in your app to test all analytics functionality.

### 2. **View Results**
- **Firebase Console**: https://console.firebase.google.com/project/rukn-32c66/analytics
- **Google Analytics 4**: https://analytics.google.com/
- **In-app Dashboard**: Use the Analytics Dashboard component

## Integration Examples

### 1. **Automatic Page Tracking**
```tsx
// In any screen component
import { usePageTracking } from '../src/hooks/useAnalytics';

export const MyScreen = () => {
  usePageTracking('my_screen_name'); // Automatically tracks page views
  
  return (
    // Your component content
  );
};
```

### 2. **Button Click Tracking**
```tsx
// In any component with buttons
import { useButtonTracking } from '../src/hooks/useAnalytics';

export const MyComponent = () => {
  const { trackClick } = useButtonTracking();
  
  const handleSubmit = () => {
    trackClick('submit_button', {
      form_type: 'contact',
      screen: 'contact_form'
    });
    // Your existing button logic
  };
  
  return (
    <TouchableOpacity onPress={handleSubmit}>
      <Text>Submit</Text>
    </TouchableOpacity>
  );
};
```

### 3. **User Journey Tracking**
```tsx
// Track user flow through your app
import { useUserJourney } from '../src/hooks/useAnalytics';

export const OnboardingFlow = () => {
  const { trackJourney, trackDropOff } = useUserJourney();
  
  const handleNextStep = () => {
    trackJourney('onboarding_step_completed', {
      step_number: 2,
      step_name: 'profile_setup'
    });
    // Your existing logic
  };
  
  const handleSkip = () => {
    trackDropOff('onboarding_skipped', {
      step: 'profile_setup',
      reason: 'user_choice'
    });
    // Your existing logic
  };
};
```

### 4. **Custom Event Tracking**
```tsx
// Track specific business events
import { useCustomTracking } from '../src/hooks/useAnalytics';

export const ProductCard = ({ product }) => {
  const { trackEvent } = useCustomTracking();
  
  const handleProductView = () => {
    trackEvent('product_viewed', {
      product_id: product.id,
      product_category: product.category,
      product_price: product.price
    });
  };
  
  const handleAddToFavorites = () => {
    trackEvent('product_favorited', {
      product_id: product.id,
      product_category: product.category
    });
  };
};
```

### 5. **Complete Integration Example**
```tsx
// Complete example with all analytics features
import { useAnalytics } from '../src/hooks/useAnalytics';

export const HomeScreen = () => {
  const {
    trackClick,
    trackJourney,
    trackEvent,
    setUserProperties
  } = useAnalytics();
  
  // Automatic page tracking happens with usePageTracking
  usePageTracking('home_screen');
  
  const handleSearch = (query) => {
    trackClick('search_button', {
      search_query: query,
      screen: 'home'
    });
  };
  
  const handleCategorySelect = (category) => {
    trackJourney('category_selected', {
      category_name: category,
      user_action: 'browse'
    });
  };
  
  const handleProductClick = (product) => {
    trackEvent('product_clicked', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price
    });
  };
  
  return (
    // Your component JSX
  );
};
```

## Where to Find Your Analytics Results

### 1. **Firebase Console** (Primary)
- **URL**: https://console.firebase.google.com/project/rukn-32c66/analytics
- **Real-time data**: Available immediately
- **Historical data**: 24-48 hour processing delay

**Key Sections:**
- **Events**: All your custom events
- **Audiences**: User segments
- **Funnels**: User journey analysis
- **Retention**: User return patterns
- **DebugView**: Real-time event testing

### 2. **Google Analytics 4** (Enhanced)
- **URL**: https://analytics.google.com/
- **More detailed reports**: Advanced segmentation
- **Better visualization**: Charts, funnels, cohorts
- **Export capabilities**: Data export to BigQuery

### 3. **In-App Dashboard**
- **Component**: `AnalyticsDashboard`
- **Real-time data**: Live session tracking
- **In-app viewing**: View analytics within your app

### 4. **Development Console**
- **Real-time logging**: All events logged to console
- **Debug mode**: Detailed event information

## Testing Your Implementation

### 1. **Use the Test Screen**
Navigate to `/analytics-test` to test all functionality.

### 2. **Check Console Logs**
Look for analytics event logs in your development console.

### 3. **Firebase DebugView**
- Enable debug mode in Firebase Console
- View real-time events
- Test event parameters

### 4. **Verify in Firebase Console**
- Check Events section for your custom events
- Verify event parameters are correct
- Test real-time data flow

## Next Steps

1. **Test the analytics** using the test screen
2. **Integrate into your existing components** using the examples above
3. **View results** in Firebase Console
4. **Set up custom dashboards** in Google Analytics 4
5. **Monitor user behavior** and optimize based on insights

Your analytics system is now ready to track user behavior across your entire app!

