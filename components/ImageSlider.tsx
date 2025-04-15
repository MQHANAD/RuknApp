// ImageSlider.tsx
import React, { FC } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { MarketplaceItem, images } from "./types";

const { width } = Dimensions.get("window");

interface ImageSliderProps {
  data: MarketplaceItem[];
  currentIndex: number;
  onSlideChange: (evt: NativeSyntheticEvent<NativeScrollEvent>) => void;
  sliderRef: React.RefObject<ScrollView>;
}

const ImageSlider: FC<ImageSliderProps> = ({
  data,
  currentIndex,
  onSlideChange,
  sliderRef,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onSlideChange}
        ref={sliderRef}
      >
        {data.map((item) => (
          <View key={item.id} style={{ width }}>
            <Image
              source={images[item.image]}
              style={styles.image}
              resizeMode="stretch"
            />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: { width: "100%", height: 300, resizeMode: "center" },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  title: { color: "#fff", fontSize: 16 },
  indicatorContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 40,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeIndicator: { backgroundColor: "#333" },
});

export default ImageSlider;
