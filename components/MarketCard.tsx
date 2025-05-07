// MarketCard.tsx
import React, { FC } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MarketplaceItem, images } from "./placeInfo";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import useFavoritesStore from '../stores/favoritesStore'; // adjust path as needed

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

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={styles.container}>
        <Image source={images[item.image]} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.title}>
            <Text style={styles.textTitle}>{item.price}</Text>
            <Text style={styles.textTitle}>{item.title}</Text>
          </View>
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
    paddingVertical:8,
    marginLeft: 15,
    marginTop:8,
  },
  image: { width: "100%", height: 150, resizeMode: "stretch", },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  textTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666" },
  location: { fontSize: 12, color: "#aaa", marginTop: 6 },
  title: { flexDirection: "row", justifyContent: "space-between" },
  flexEnd: { flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }
});

export default MarketCard;
