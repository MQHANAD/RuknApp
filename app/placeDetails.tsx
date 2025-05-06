import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MARKETPLACES, MarketplaceItem, images } from '../components/types';
import ImageSlider from '../components/ImageSlider';
import { icons } from '@/constants';

const { width } = Dimensions.get('window');

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const sliderRef = React.useRef<ScrollView>(null);
  const [showActionsInHeader, setShowActionsInHeader] = React.useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  
  // Find the place details from MARKETPLACES data
  const place = MARKETPLACES.find((item) => item.id === id);

  if (!place) {
    return null;
  }

  // Handler to show/hide heart/share icons in header
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Adjust 180 to the scroll position where you want the icons to appear
    setShowActionsInHeader(y > 180);
  };

  // Animated values for card icons (heart/share) in the card section
  // As the user scrolls from y=250 to y=370:
  // - The icons move up by 100 units (translateY: 0 -> -100)
  // As the user scrolls from y=250 to y=350:
  // - The icons fade out (opacity: 1 -> 0)
  const cardIconsTranslateY = scrollY.interpolate({
    inputRange: [250, 370], // Start moving up at scrollY=250, finish at 370
    outputRange: [0, -100], // Move up by 100 units
    extrapolate: 'clamp',
  });

  const cardIconsOpacity = scrollY.interpolate({
    inputRange: [250, 255], // Start fading out at scrollY=250, finish at 350
    outputRange: [1, 0],    // Opacity goes from fully visible to invisible
    extrapolate: 'clamp',
  });

  // Animated values for header icons (heart/share) in the sticky header
  // As the user scrolls from y=257 to y=260:
  // - The header icons fade in (opacity: 0 -> 1)
  // As the user scrolls from y=120 to y=300:
  // - The header icons move up from below (translateY: 40 -> 0)
  // This creates a smooth handoff between the card and header icons
  const headerIconsOpacity = scrollY.interpolate({
    inputRange: [250, 260], // Start fading in at scrollY=257, finish at 260
    outputRange: [0, 1],   // Opacity goes from invisible to fully visible
    extrapolate: 'clamp',
  });
  
  const headerIconsTranslateY = scrollY.interpolate({
    inputRange: [120, 300], // Start moving up at scrollY=120, finish at 300
    outputRange: [60, 0],  // Move up from 40 units below into place
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }} 
      />
      
      {/* Sticky Header Bar */}
      <View style={styles.stickyHeader}>
        {/* Heart and Share on the left (only when scrolled) */}
        <Animated.View style={{
          opacity: headerIconsOpacity,
          transform: [{ translateY: headerIconsTranslateY }],
        }}>
          <View style={styles.actionButtonsHeader}>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.heart2} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.share} style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* Arrow always on the right */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Image 
            source={icons.arrowLeft} 
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView
        style={styles.scrollView} 
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ImageSlider 
            data={[place]} 
            currentIndex={0}
            onSlideChange={() => {}}
            sliderRef={sliderRef as React.RefObject<ScrollView>}
          />
          <View style={styles.imageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Favorite */}
          <View style={styles.titleRow}>
            <Animated.View style={{
              opacity: cardIconsOpacity,
              transform: [{ translateY: cardIconsTranslateY }],
            }}>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Image source={icons.heart2} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Image source={icons.share} style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Text style={styles.title}>محل رقم {place.id}</Text>
          </View>

          {/* Price and Match */}
          <View style={styles.rightAlign}>
            <Text style={styles.matchText}>{place.title}</Text>
            <Text style={styles.price}>{place.price}</Text>
          </View>

          {/* Location and Size */}
          <Text style={styles.location}>{place.location}</Text>
          <Text style={styles.size}>المساحة {place.size}</Text>

          {/* Contact Number */}
          <Text style={styles.phone}>050 123 4567</Text>

          {/* Similar Properties Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>عقارات اخرى مشابهة</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScrollView}
            >
              {MARKETPLACES.map((item) => (
                <View key={item.id} style={styles.similarItem}>
                  <Image source={images[item.image]} style={styles.similarImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 95,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    zIndex: 200,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 50,
    marginRight: 5,
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: '#000',
    transform: [{ scaleX: -1 }],
  },
  actionButtonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 13,
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 330,
    width: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    minWidth: 80,
    justifyContent: 'flex-start',
    marginLeft: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // borderWidth: 1,
    // borderColor: '#CBD5E1',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#626262',
  },
  matchText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
    textAlign: 'right',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'right',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  size: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 600,
    textAlign: 'right',
  },
  similarSection: {
    marginTop: 20,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'right',
  },
  similarScrollView: {
    marginBottom: 20,
  },
  similarItem: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightAlign: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
}); 