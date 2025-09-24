import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent, StatusBar, ActivityIndicator, Share, Linking, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MarketplaceItem, images } from '../components/types';
import { useFavorites } from '../src/context/FavoritesContext';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, PLACEHOLDER_IMAGE_URL } from '@config/env';

const { width } = Dimensions.get('window');

// Define a type for image keys to avoid TypeScript errors
type ImageKeyType = keyof typeof images;
import ImageSlider from '../components/ImageSlider';
import { icons } from '@/constants';

// Import Saudi Riyal Symbol image
const saudiRiyalSymbol = require('../assets/images/Saudi_Riyal_Symbol.svg.png');

// Create an optimized image component for the detail slider
const OptimizedDetailImage = memo(({ uri, index }: { uri: string; index: number }) => {
  return (
    <Image
      key={`detail-image-${index}`}
      source={{ uri }}
      style={{ width, height: '100%' }}
      resizeMode="cover"
      onLoad={() => console.log(`Image ${index} loaded successfully in details view`)}
      onError={() => console.log(`Error loading image ${index} in details view`)}
      defaultSource={require('../assets/images/dummy1.png')}
    />
  );
});

// Create an optimized dot indicator component
const DetailPaginationDot = memo(({ active }: { active: boolean }) => (
  <View
    style={[
      styles.indicator,
      active && styles.activeIndicator
    ]}
  />
));

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const sliderRef = React.useRef<ScrollView>(null);
  const [showActionsInHeader, setShowActionsInHeader] = React.useState(false);
  const [place, setPlace] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Derived values
  const matchPercent = useMemo(() => {
    const val = (place as any)?.originalData?.match_percent;
    if (typeof val === 'number') return Math.max(0, Math.min(100, Math.round(val)));
    return 97;
  }, [place]);

  // Helpers for Arabic numerals and values
  const toArabicNumber = useCallback((value: number | string): string => {
    const num = typeof value === 'number' ? value : parseFloat((value as string).toString().replace(/[^\d.-]/g, ''));
    if (Number.isFinite(num)) {
      try { return new Intl.NumberFormat('ar-SA').format(num as number); } catch { return String(num); }
    }
    return String(value ?? '');
  }, []);
  
  // Fetch the specific listing details and similar listings
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching real-time listing details for ID:', id);
        const response = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?Listing_ID=eq.${id}`,
          {
            method: 'GET',
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store' // Ensure we get fresh data every time
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error fetching listing: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched listing data:', data);
        
        if (data && data.length > 0) {
          // Format the listing data to match MarketplaceItem structure
          const listing = data[0];
          
          // Enhanced image handling for details page
          let imageSource: string = 'PLACEHOLDER_IMAGE_URL';
          
          console.log('Property details images field:', listing.Images);
          
          try {
            // Check if Images exists and parse it appropriately
            if (listing.Images) {
              // Handle array format
              if (Array.isArray(listing.Images) && listing.Images.length > 0) {
                imageSource = listing.Images[0];
                console.log('Using image from array in details view:', imageSource);
              }
              // Handle string format
              else if (typeof listing.Images === 'string') {
                const imagesString = listing.Images as string;
                
                // Try to parse as JSON if it looks like JSON
                if (imagesString.startsWith('[')) {
                  try {
                    const parsedImages = JSON.parse(imagesString);
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                      imageSource = parsedImages[0];
                      console.log('Using image from parsed JSON in details view:', imageSource);
                    } else if (imagesString.includes('http')) {
                      // Use the string directly if it's a URL
                      imageSource = imagesString;
                      console.log('Using image string directly in details view:', imageSource);
                    }
                  } catch (e) {
                    // If it fails to parse but looks like a URL, use it directly
                    if (imagesString.includes('http')) {
                      imageSource = imagesString;
                      console.log('Using string as URL in details view after parse fail:', imageSource);
                    }
                  }
                } else if (imagesString.includes('http')) {
                  // Use the string directly if it's a URL and not JSON
                  imageSource = imagesString;
                  console.log('Using string URL directly in details view:', imageSource);
                }
              }
              // Handle object format
              else if (typeof listing.Images === 'object' && listing.Images !== null) {
                try {
                  const imagesObject = listing.Images as Record<string, any>;
                  // Find any URL in the object
                  const possibleUrl = Object.values(imagesObject).find(val => 
                    typeof val === 'string' && val.includes('http'));
                  
                  if (possibleUrl && typeof possibleUrl === 'string') {
                    imageSource = possibleUrl;
                    console.log('Found URL in object for details view:', imageSource);
                  }
                } catch (error) {
                  console.error('Error extracting image URL from object in details view:', error);
                }
              }
            }
            
            // Final check to ensure the URL is valid
            if (!imageSource || !imageSource.includes('http')) {
              imageSource = 'PLACEHOLDER_IMAGE_URL';
              console.log('Using placeholder in details view - no valid URL found');
            }
          } catch (error) {
            console.error('Error processing image in details view:', error);
            imageSource = 'PLACEHOLDER_IMAGE_URL';
          }
          
          // Format price with thousand separators if it's a number
          const price = typeof listing.Price === 'number' 
            ? `${new Intl.NumberFormat('ar-SA').format(listing.Price)} ريال` 
            : listing.Price || '0 ريال';
          
          // Extract all available images for this property
          let allImages: string[] = [];
          
          // First check for processedImages from our API processing
          if (listing.processedImages && Array.isArray(listing.processedImages)) {
            allImages = listing.processedImages;
          }
          // If we don't have processedImages, check if the image is a pipe-separated string
          else if (typeof imageSource === 'string' && imageSource.includes('|')) {
            allImages = imageSource.split(/\s*\|\s*/).filter(url => url.includes('http'));
          }
          // Single image
          else if (typeof imageSource === 'string' && imageSource.includes('http')) {
            allImages = [imageSource];
          }
          
          // If we still don't have any images, use a placeholder
          if (allImages.length === 0) {
            allImages = ['PLACEHOLDER_IMAGE_URL'];
          }
          
          console.log(`Found ${allImages.length} images for property details`);
          setPropertyImages(allImages);
          
          const formattedListing: MarketplaceItem = {
            id: listing.Listing_ID.toString(),
            title: listing.Title || '',
            price: price,
            size: listing.Area ? `${listing.Area} م²` : '',
            location: `منطقة ${listing.zone_id || '1'}`,
            image: imageSource,
            businessName: listing.Title || '',
            businessType: 'property',
            latitude: listing.Latitude,
            longitude: listing.Longitude,
            zone_id: listing.zone_id,
            originalData: listing
          };
          
          setPlace(formattedListing);
        } else {
          console.error('No business found with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // No similar properties feature as requested
    
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  // Handler to show/hide heart/share icons in header (optimized with useCallback)
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Adjust 180 to the scroll position where you want the icons to appear
    setShowActionsInHeader(y > 180);
  }, []);
  
  // Handler for image slider scrolling (optimized with useCallback and throttling)
  const handleImageScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeImageIndex && currentIndex >= 0 && currentIndex < propertyImages.length) {
      setActiveImageIndex(currentIndex);
    }
  }, [activeImageIndex, propertyImages.length]);
  
  // Handler for toggling favorite status (optimized with useCallback)
  const handleToggleFavorite = useCallback(() => {
    if (!place) return;
    
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  }, [place, isFavorite, addFavorite, removeFavorite]);

  // Open maps for coordinates
  const openInMaps = useCallback(() => {
    if (!place || !place.latitude || !place.longitude) return;
    const lat = place.latitude; const lng = place.longitude;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  }, [place]);

  // Share handler
  const handleShare = useCallback(() => {
    if (!place) return;
    const title = place.title || `عقار رقم ${place.id}`;
    const message = `${title}\n${place.location || ''}\nالسعر: ${place.price || ''}`;
    Share.share({ message }).catch(() => {});
  }, [place]);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F5A623" />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  // Handle case where place is not found
  if (!place) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>لم يتم العثور على بيانات المتجر</Text>
        <TouchableOpacity 
          style={styles.backButtonError} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
        }}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Image Slider */}
        <View style={styles.heroContainer}>
          {/* Header overlay with back and action buttons */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.overlayBackButton}
              activeOpacity={0.8}
            >
              <Image 
                source={icons.arrowLeft} 
                style={styles.overlayBackIcon}
              />
            </TouchableOpacity>
            
            <View style={styles.overlayActions}>
              <TouchableOpacity 
                style={styles.overlayActionBtn}
                onPress={handleToggleFavorite}
              >
                <FontAwesome
                  name={isFavorite(place.id) ? "heart" : "heart-o"}
                  size={20}
                  color={isFavorite(place.id) ? "#F5A623" : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.overlayActionBtn}
                onPress={handleShare}
              >
                <Image source={icons.share} style={styles.overlayActionIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={32}
            removeClippedSubviews={true}
            decelerationRate="fast"
            style={styles.imageSlider}
          >
            {propertyImages.map((imgUrl, index) => {
              // Only render images that are near the active image position
              const shouldRender = Math.abs(index - activeImageIndex) < 2;
              return (
                <View key={`detail-image-container-${index}`} style={styles.imageSlide}>
                  {shouldRender && (
                    <OptimizedDetailImage uri={imgUrl} index={index} />
                  )}
                </View>
              );
            })}
          </ScrollView>
          
          {/* Image pagination dots */}
          {propertyImages.length > 1 && (
            <View style={styles.paginationDots}>
              {propertyImages.map((_, index) => (
                <DetailPaginationDot
                  key={`detail-dot-${index}`}
                  active={index === activeImageIndex}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Main content layout */}
          <View style={styles.mainContent}>
            {/* Left side - Action buttons (location and chat) */}
            <View style={styles.actionButtonsColumn}>
              <TouchableOpacity style={styles.roundActionBtn} onPress={openInMaps}>
                <Image source={icons.mapPin} style={styles.actionBtnIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundActionBtn}>
                <Image source={icons.chat} style={styles.actionBtnIcon} />
              </TouchableOpacity>
            </View>

            {/* Right side - Property details */}
            <View style={styles.propertyDetails}>
              {/* Title */}
              <Text style={styles.propertyTitle}>{place.title || `محل رقم ${place.id}`}</Text>
              
              {/* Match percentage */}
              <Text style={styles.matchPercentage}>مناسب لفكرتك بنسبة {toArabicNumber(matchPercent)}%</Text>
              
              {/* Price */}
              <Text style={styles.propertyPrice}>
                {place.price ? place.price.toString().replace('ريال', '').trim() : '30,000'} ريال/سنة
              </Text>
              
              {/* Location */}
              <Text style={styles.propertyLocation}>{place.location || 'الخبر، الثقبة'}</Text>
              
              {/* Area */}
              <Text style={styles.propertyArea}>المساحة {place.size ? place.size.replace('م²', '') : '٤٠٠'} متر مربع</Text>
              
              {/* Phone */}
              <Text style={styles.propertyPhone}>050 123 4567</Text>
            </View>
          </View>

          {/* Similar Properties Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>عقارات اخرى مشابهة</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScrollView}
            >
              {/* Mock similar properties */}
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.similarItem}>
                  <Image 
                    source={{ uri: propertyImages[0] || PLACEHOLDER_IMAGE_URL }} 
                    style={styles.similarImage} 
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Loading and error styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayBackButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  overlayActions: {
    flexDirection: 'row',
    gap: 12,
  },
  overlayActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayActionIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  imageSlider: {
    flex: 1,
  },
  imageSlide: {
    width,
    height: '100%',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    flex: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButtonsColumn: {
    width: 60,
    alignItems: 'center',
    gap: 16,
    marginRight: 20,
  },
  roundActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionBtnIcon: {
    width: 22,
    height: 22,
    tintColor: '#626262',
  },
  propertyDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  propertyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'right',
    marginBottom: 8,
  },
  matchPercentage: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'right',
    marginBottom: 12,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'right',
    marginBottom: 16,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'right',
    marginBottom: 8,
  },
  propertyArea: {
    fontSize: 16,
    color: '#1C64F2',
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 8,
  },
  propertyPhone: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'right',
    marginBottom: 16,
  },
  similarSection: {
    marginTop: 16,
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'right',
    marginBottom: 16,
  },
  similarScrollView: {
    marginBottom: 20,
  },
  similarItem: {
    width: 200,
    height: 150,
    marginLeft: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F7FAFC',
  },
  similarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});