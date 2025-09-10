// MarketCard.tsx
import React, { FC, useState, useRef, memo, useMemo, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MarketplaceItem } from "./types";
import { useRouter } from 'expo-router';
import { useFavorites } from "../src/context/FavoritesContext";
import { PLACEHOLDER_IMAGE_URL } from '@config/env';
import { useRTL } from '../src/hooks/useRTL';

// Import Saudi Riyal Symbol image
const saudiRiyalSymbol = require('../assets/images/Saudi_Riyal_Symbol.svg.png');

const { width } = Dimensions.get("window");

interface MarketCardProps {
  item: MarketplaceItem;
}

// Optimized image component
const OptimizedImage = memo(({ uri }: { uri: string }) => {
  return (
    <Image
      source={{ uri }}
      style={styles.sliderImage}
      resizeMode="cover"
    />
  );
});

// Pagination dot component
const PaginationDot = memo(({ active }: { active: boolean }) => {
  return (
    <View style={[styles.paginationDot, active && styles.paginationDotActive]} />
  );
});

const MarketCard: FC<MarketCardProps> = memo(({ item }) => {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isRTL, textAlign } = useRTL();

  // Check if item is favorite
  const isItemFavorite = useMemo(() => isFavorite(item.id), [isFavorite, item.id]);

  // Process images for the property
  const propertyImages = useMemo(() => {
    let images: string[] = [];
    
    if (item.originalData?.processedImages?.length > 0) {
      images = item.originalData.processedImages;
    } else if (typeof item.image === 'string') {
      if (item.image.includes('|')) {
        images = item.image.split(/\s*\|\s*/).filter(url => url.includes('http'));
      } else if (item.image.includes('http')) {
        images = [item.image];
      }
    }
    
    return images.length > 0 ? images : [PLACEHOLDER_IMAGE_URL];
  }, [item.originalData, item.image]);

  // Handle image scrolling
  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeImageIndex && currentIndex >= 0 && currentIndex < propertyImages.length) {
      setActiveImageIndex(currentIndex);
    }
  }, [activeImageIndex, propertyImages.length]);

  // Toggle favorite status
  const handleFavoritePress = useCallback(() => {
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [isItemFavorite, removeFavorite, addFavorite, item]);

  // Navigate to details page
  const handleCardPress = useCallback(() => {
    router.push({
      pathname: '/placeDetails',
      params: { id: item.id }
    });
  }, [router, item.id]);

  // Format price and size
  const formattedPrice = item.price ? item.price.toString().replace('ريال', '').trim() : '';
  const formattedSize = item.size ? item.size.replace('م²', 'm²') : '';

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={32}
          >
            {propertyImages.map((imgSrc, index) => (
              <OptimizedImage key={`${item.id}-image-${index}`} uri={imgSrc} />
            ))}
          </ScrollView>
          
          {propertyImages.length > 1 && (
            <View style={styles.paginationDots}>
              {propertyImages.map((_, index) => (
                <PaginationDot key={`dot-${index}`} active={index === activeImageIndex} />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Heart button on the left */}
          <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
            <FontAwesome
              name={isItemFavorite ? "heart" : "heart-o"}
              size={24}
              color={isItemFavorite ? "#F5A623" : "#666"}
            />
          </TouchableOpacity>

          {/* Property details on the right */}
          <View style={styles.details}>
            <View style={styles.priceRow}>
              <Image source={saudiRiyalSymbol} style={styles.riyalSymbol} resizeMode="contain" />
              <Text style={styles.priceText}>{formattedPrice}</Text>
            </View>
            
            {formattedSize ? <Text style={styles.sizeText}>{formattedSize}</Text> : null}
            
            {item.title ? (
              <Text style={[styles.titleText, { textAlign: textAlign('right') }]} numberOfLines={1}>
                {item.title}
              </Text>
            ) : null}
            
            {item.location ? (
              <Text style={[styles.locationText, { textAlign: textAlign('right') }]} numberOfLines={1}>
                {item.location}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.17,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  sliderImage: {
    width: width,
    height: 180,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 3,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  details: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'flex-end',
    
  },
  riyalSymbol: {
    width: 16,
    height: 16,
    marginRight: 4,
    textAlign: 'right',
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A3644",
    textAlign: 'right',
  },
  sizeText: { 
    fontSize: 15, 
    color: "#1C64F2", 
    fontWeight: "500",
    marginBottom: 4,
    textAlign: 'right',
  },
  titleText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
    textAlign: 'right',
  },
  locationText: { 
    fontSize: 13, 
    color: "#64748B",
  },
});

export default MarketCard;