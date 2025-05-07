import React, {
  FC,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import MarketCard from "../../components/MarketCard";

import IdeaHeader from "../../components/ideaHeader";
import { MarketplaceItem, images } from "../../components/types";
import useFavoritesStore from "../../stores/favoritesStore";

// Supabase constants from backend branch
const SUPABASE_URL = 'https://vnvbjphwulwpdzfieyyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 300; // Height reserved for the image slider
const CARD_TOP_OFFSET = HEADER_HEIGHT; // Card shows a little of the image slider

const Favorite: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Zustand favorites logic
  const { favorites: zustandFavorites } = useFavoritesStore();

  // Fetch favorites from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        if (zustandFavorites.length === 0) {
          setFavorites([]);
          return;
        }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/Businesses?business_id=in.(${zustandFavorites.map((f: MarketplaceItem) => f.id).join(',')})`,
          {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) throw new Error(`Error fetching favorites: ${response.status}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const formattedFavorites = data.map((business: any) => {
            const imageKey = `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`;
            const userRatings = business.user_ratings_total || '0';
            const randomPrice = Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000;
            const formattedPrice = new Intl.NumberFormat('ar-SA').format(randomPrice);
            
            return {
              id: business.business_id.toString(),
              title: business.rating || '0.0',
              price: `${formattedPrice} ريال / سنة`,
              size: `تقييمات المستخدمين: ${userRatings}`,
              location: `منطقة ${business.zone_id || '1'}`,
              image: imageKey as keyof typeof images,
              businessName: business.name || '',
              businessType: business.business_type || '',
              businessStatus: business.business_status || 'OPERATIONAL',
              user_ratings_total: userRatings,
              zone_id: business.zone_id || '1',
              popularity_score: business.popularity_score || '0'
            };
          });
          setFavorites(formattedFavorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [zustandFavorites]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>جاري تحميل المفضلة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar 
          onSearch={handleSearch}
          value={searchQuery}
          onClear={handleClearSearch}
        />
      </View>

      {/* Fixed Background Image Slider */}
      <View style={styles.imageSliderContainer}>
        <Image source={images["../assets/images/dummy1.png"]} style={styles.backgroundImage} />
      </View>
      
      <View style={styles.fixedHeaderOverlayWrapper}>
        <IdeaHeader />
      </View>
      
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          <View style={styles.emptyFavoritesContainer}>
            <Text style={styles.emptyFavoritesText}>لا توجد مفضلات</Text>
            <Text style={styles.emptyFavoritesSubText}>أضف بعض المتاجر إلى المفضلة</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={({ item }) => <MarketCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // The outer ScrollView manages scrolling
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  imageSliderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0, // Rendered in the background.
  },
  backgroundImage: {
    width: "100%", height: "108%", resizeMode: "cover"
  },
  searchBarWrapper: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    zIndex: 20, // Renders above the slider.
  },
  fixedHeaderOverlayWrapper: {
    position: "absolute",
    top: 85, // Adjust this value so the FixedHeaderOverlay appears just below the search bar.
    left: 0,
    right: 0,
    zIndex: 15,
  },
  scrollViewContent: {
    paddingTop:0,
    minHeight: height - CARD_TOP_OFFSET,
    paddingBottom:40,
  },
  card: {
    top: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    elevation: 10,
    paddingVertical: 40,
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyFavoritesSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: 'gray',
  },
});

export default Favorite;