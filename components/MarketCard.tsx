// MarketCard.tsx
import React, { FC } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MarketplaceItem, images } from "./types";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import useFavoritesStore from '../stores/favoritesStore';

interface MarketCardProps {
  item: MarketplaceItem;
}

const MarketCard: FC<MarketCardProps> = ({ item }) => {
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: '/placeDetails',
      params: { id: item.id }
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toUpperCase()) {
      case 'OPERATIONAL':
        return '#4CAF50';
      case 'CLOSED':
        return '#F44336';
      case 'TEMPORARILY_CLOSED':
        return '#FFA000';
      default:
        return '#666666';
    }
  };

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={styles.container}>
        {/* Handle both remote URLs and local images */}
        <Image 
          source={typeof item.image === 'string' && !Object.keys(images).includes(item.image) 
            ? { uri: item.image } 
            : images[item.image as keyof typeof images]} 
          style={styles.image} 
        />
        <View style={styles.info}>
          {/* Business Header Section */}
          <View style={styles.title}>
            <Text style={styles.textTitle}>{item.price}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.businessIdContainer}>
                <Text style={styles.businessIdLabel}>ID:</Text>
                <Text style={styles.businessId}>{item.id}</Text>
              </View>
              <Text style={styles.textRating}>⭐ {item.title}</Text>
              <Text style={styles.businessName}>{item.businessName}</Text>
            </View>
          </View>
          
          {/* Business Details Section */}
          <View style={styles.title}>
            <TouchableOpacity
              style={styles.heartContainer}
              onPress={() => {
                isFavorite(item.id)
                  ? removeFavorite(item.id)
                  : addFavorite(item);
              }}
            >
              <Image
                source={isFavorite(item.id) ? icons.heart2 : icons.heart}
                style={{ tintColor: isFavorite(item.id) ? "#F5A623" : "#626262", width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <View style={styles.flexEnd}>
              <Text style={styles.subText}>{item.size}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={[styles.businessType, { color: getStatusColor(item.businessStatus) }]}>
                {item.businessType} - {item.businessStatus}
              </Text>
              {item.zone_id && (
                <Text style={styles.zoneId}>منطقة {item.zone_id}</Text>
              )}
              {item.popularity_score && (
                <Text style={styles.popularityScore}>
                  شعبية: {item.popularity_score}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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
  heartContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#CBD5E1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 15,
    marginTop: 8,
    width: 80,  
    height: 60, 
  },
  image: { 
    width: "100%", 
    height: 150, 
    resizeMode: "stretch",
  },
  info: { 
    flex: 1, 
    padding: 10, 
    justifyContent: "space-between" 
  },
  textTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 5 
  },
  subText: { 
    fontSize: 14, 
    color: "#666" 
  },
  location: { 
    fontSize: 12, 
    color: "#aaa", 
    marginTop: 6 
  },
  title: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  flexEnd: { 
    flexDirection: "column", 
    justifyContent: "flex-end", 
    alignItems: "flex-end" 
  },
  businessType: { 
    fontSize: 13, 
    fontWeight: "bold", 
    marginTop: 4 
  },
  rating: { 
    color: "#F5A623", 
    fontWeight: "600" 
  },
  ratingContainer: { 
    flexDirection: "column", 
    alignItems: "flex-end" 
  },
  textRating: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#F5A623" 
  },
  businessName: { 
    fontSize: 14, 
    color: "#333", 
    marginTop: 2 
  },
  businessIdContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 3,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  businessIdLabel: { 
    fontSize: 12, 
    color: "#666", 
    marginRight: 4,
    fontWeight: "bold" 
  },
  businessId: { 
    fontSize: 12, 
    color: "#333",
    fontWeight: "bold" 
  },
  zoneId: { 
    fontSize: 12, 
    color: "#0077cc", 
    fontWeight: "500", 
    marginTop: 2 
  },
  popularityScore: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontStyle: 'italic'
  }
});

export default MarketCard;