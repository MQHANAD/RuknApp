import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../src/context/ThemeContext";
import { useRTL } from "../src/hooks/useRTL";
import { Button, Card } from "../components/design-system";
import { spacing, typography, colors } from "../constants/design-tokens";
import { fetchZoneRecommendations, ZoneRecommendation } from "@utils/zoneRecommendations";
import { BusinessType } from "../src/context/FilterContext";

// Idea interface
export interface Idea {
  id: string;
  name: string;
  description: string;
  type: string;
  area: string;
  createdAt: string;
}

const AfkariScreen: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const [recommendations, setRecommendations] = useState<ZoneRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { textAlign, isRTL } = useRTL();

  // Load ideas from AsyncStorage
  const loadIdeas = async () => {
    try {
      const storedIdeas = await AsyncStorage.getItem('user_ideas');
      if (storedIdeas) {
        const parsedIdeas = JSON.parse(storedIdeas);
        setIdeas(parsedIdeas);
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  // Refresh ideas when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadIdeas();
    }, [])
  );

  const handleAddIdea = () => {
    router.push('/add-idea');
  };

  const handleEditIdea = (idea: Idea) => {
    router.push({
      pathname: '/add-idea',
      params: { 
        editMode: 'true',
        ideaData: JSON.stringify(idea)
      }
    });
  };

  const handleFindPlaces = async () => {
    if (showRecommendations) {
      // Toggle back to ideas list
      setShowRecommendations(false);
      setRecommendations([]);
      return;
    }

    if (!selectedIdeaId) {
      Alert.alert(
        "تنبيه",
        "يرجى اختيار فكرة أولاً للبحث عن أماكن مناسبة لها"
      );
      return;
    }
    
    const selectedIdea = ideas.find(idea => idea.id === selectedIdeaId);
    if (selectedIdea) {
      setSearchingPlaces(true);
      try {
        // Map the idea type to BusinessType
        const businessTypeMapping: { [key: string]: BusinessType } = {
          'حلاق': 'Barber',
          'barber': 'Barber',
          'صالة رياضية': 'Gym',
          'gym': 'Gym',
          'محطة وقود': 'Gas Station',
          'gasStation': 'Gas Station',
          'مغسلة': 'Laundry',
          'laundry': 'Laundry',
          'صيدلية': 'Pharmacy',
          'pharmacy': 'Pharmacy',
          'سوبر ماركت': 'Supermarket',
          'supermarket': 'Supermarket'
        };

        const mappedBusinessType = businessTypeMapping[selectedIdea.type] || 'none';
        
        console.log('Selected idea type:', selectedIdea.type);
        console.log('Mapped business type:', mappedBusinessType);
        
        if (mappedBusinessType !== 'none') {
          console.log('Fetching recommendations for:', mappedBusinessType);
          const zoneRecommendations = await fetchZoneRecommendations(mappedBusinessType);
          setRecommendations(zoneRecommendations);
          setShowRecommendations(true);
        } else {
          Alert.alert('خطأ', 'نوع العمل غير مدعوم للبحث');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        Alert.alert('خطأ', 'حدث خطأ أثناء البحث عن المواقع');
      } finally {
        setSearchingPlaces(false);
      }
    }
  };

  const renderIdeaItem = ({ item }: { item: Idea }) => (
    <TouchableOpacity
      style={[
        styles.ideaItem,
        {
          backgroundColor: theme.surface.primary,
          borderColor: selectedIdeaId === item.id ? theme.brand.primary : theme.border.primary,
          borderWidth: selectedIdeaId === item.id ? 2 : 1,
        }
      ]}
      onPress={() => setSelectedIdeaId(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.ideaContent}>
        {/* Radio Button */}
        <View style={[
          styles.radioButton,
          {
            borderColor: selectedIdeaId === item.id ? theme.brand.primary : theme.border.secondary,
            backgroundColor: selectedIdeaId === item.id ? theme.brand.primary : 'transparent',
          }
        ]}>
          {selectedIdeaId === item.id && (
            <View style={[styles.radioInner, { backgroundColor: theme.text.inverse }]} />
          )}
        </View>

        {/* Idea Info */}
        <View style={styles.ideaInfo}>
          <Text style={[
            styles.ideaName,
            { color: theme.text.primary, textAlign: textAlign('start') }
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.ideaDetails,
            { color: theme.text.secondary, textAlign: textAlign('start') }
          ]}>
            {item.type} • {item.area}
          </Text>
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditIdea(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.editIcon, { color: theme.text.tertiary }]}>✏️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[
        styles.emptyMessage,
        { color: theme.text.secondary, textAlign: textAlign('center') }
      ]}>
        أضف أفكارًا جديدة من علامة "+" للبحث عن\nأماكن مناسبة
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: theme.text.primary }]}>
              {isRTL ? '→' : '←'}
            </Text>
          </TouchableOpacity>
          
          <Text style={[
            styles.headerTitle,
            { color: theme.text.primary, textAlign: textAlign('center') }
          ]}>
            أفكاري
          </Text>

          <TouchableOpacity
            onPress={handleAddIdea}
            style={[styles.addButton, { borderColor: theme.border.primary }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.addIcon, { color: theme.brand.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {showRecommendations ? (
          // Show recommendations
          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.zone_id.toString()}
            renderItem={({ item, index }) => (
              <RecommendationCard recommendation={item} index={index} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : loading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyMessage, { color: theme.text.secondary }]}>
              جاري التحميل...
            </Text>
          </View>
        ) : ideas.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={ideas}
            keyExtractor={(item) => item.id}
            renderItem={renderIdeaItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Find Places Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.findButton,
            {
              backgroundColor: ideas.length > 0 && selectedIdeaId 
                ? theme.brand.primary || '#F5A623'
                : '#CCCCCC'
            }
          ]}
          onPress={handleFindPlaces}
          disabled={ideas.length === 0 || !selectedIdeaId || searchingPlaces}
          activeOpacity={ideas.length > 0 && selectedIdeaId ? 0.8 : 1}
        >
          {searchingPlaces ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[
              styles.findButtonText,
              {
                color: ideas.length > 0 && selectedIdeaId 
                  ? theme.text.inverse || '#FFFFFF'
                  : theme.text.tertiary || '#6B7280'
              }
            ]}>
              {showRecommendations ? 'العودة للأفكار' : 'ابحث عن أماكن'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...typography.heading.h2,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  emptyMessage: {
    ...typography.body.medium,
    lineHeight: 24,
  },
  listContent: {
    paddingVertical: spacing[4],
  },
  ideaItem: {
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ideaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ideaInfo: {
    flex: 1,
  },
  ideaName: {
    ...typography.body.large,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  ideaDetails: {
    ...typography.body.small,
  },
  editButton: {
    padding: spacing[2],
  },
  editIcon: {
    fontSize: 18,
  },
  bottomSection: {
    padding: spacing[4],
    paddingBottom: spacing[6],
  },
  findButton: {
    borderRadius: 12,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  findButtonText: {
    ...typography.body.large,
    fontWeight: '600',
  },
  // Recommendation card styles
  recommendationCard: {
    padding: spacing[4],
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  rankText: {
    ...typography.body.medium,
    fontWeight: "bold",
  },
  cardTitle: {
    flex: 1,
  },
  zoneTitle: {
    ...typography.heading.h4,
    marginBottom: spacing[1],
  },
  scoreText: {
    ...typography.body.medium,
    fontWeight: "600",
  },
  scoreSection: {
    marginBottom: spacing[2],
  },
  sectionTitle: {
    ...typography.body.small,
    fontWeight: "600",
    marginBottom: spacing[2],
    textTransform: "uppercase",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  metricLabel: {
    ...typography.body.medium,
    flex: 1,
  },
  metricValue: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  metricNumber: {
    ...typography.body.small,
    fontWeight: "600",
    marginLeft: spacing[2],
  },
  competitionText: {
    ...typography.body.small,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    width: 60,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: spacing[2],
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  mapButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing[3],
    alignItems: 'center',
    marginTop: spacing[2],
  },
  mapButtonText: {
    ...typography.body.medium,
    fontWeight: '600',
  },
});

export default AfkariScreen;

// Add RecommendationCard component
const RecommendationCard: React.FC<{ recommendation: ZoneRecommendation; index: number }> = ({ recommendation, index }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { textAlign } = useRTL();
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const delay = index * 150;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    }, delay);
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Calculate percentage scores
  const maxScore = 100;
  const scorePercentage = Math.min((recommendation.zone_score / maxScore) * 100, 100);
  const popularityPercentage = Math.min((recommendation.total_popularity_score / 50) * 100, 100);
  const competitionLevel = recommendation.number_of_same_type_businesses;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success[500];
    if (score >= 60) return colors.warning[500];
    return colors.error[500];
  };

  const getCompetitionColor = (competition: number) => {
    if (competition <= 2) return colors.success[500];
    if (competition <= 5) return colors.warning[500];
    return colors.error[500];
  };

  return (
    <Animated.View style={[animatedStyle, { marginBottom: spacing[4] }]}>
      <Card style={styles.recommendationCard}>
        {/* Header with rank */}
        <View style={styles.cardHeader}>
          <View style={[styles.rankBadge, { backgroundColor: theme.brand.primary }]}>
            <Text style={[styles.rankText, { color: theme.text.inverse }]}>
              #{index + 1}
            </Text>
          </View>
          <View style={styles.cardTitle}>
            <Text style={[styles.zoneTitle, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              {recommendation.district_name || `منطقة ${recommendation.zone_id}`}
            </Text>
            <Text style={[styles.scoreText, { color: getScoreColor(scorePercentage), textAlign: textAlign("left") }]}>
              {scorePercentage.toFixed(0)}% Match
            </Text>
          </View>
        </View>

        {/* Score breakdown */}
        <View style={styles.scoreSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary, textAlign: textAlign("left") }]}>
            تحليل الموقع
          </Text>

          {/* Popularity */}
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              شعبية المنطقة 📍
            </Text>
            <View style={styles.metricValue}>
              <View style={[styles.progressBar, { backgroundColor: theme.border.primary }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${popularityPercentage}%`,
                      backgroundColor: colors.primary[500],
                    },
                  ]}
                />
              </View>
              <Text style={[styles.metricNumber, { color: theme.text.primary }]}>
                {recommendation.total_popularity_score.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Ratings */}
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              متوسط التقييم ⭐
            </Text>
            <View style={styles.metricValue}>
              <Text style={[styles.metricNumber, { color: theme.text.primary }]}>
                {(recommendation.total_user_ratings / 1000).toFixed(1)}/5.0
              </Text>
            </View>
          </View>

          {/* Competition */}
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              مستوى المنافسة 🏪
            </Text>
            <View style={styles.metricValue}>
              <Text style={[styles.competitionText, { color: getCompetitionColor(competitionLevel) }]}>
                {competitionLevel <= 2 ? 'منخفضة' : competitionLevel <= 5 ? 'متوسطة' : 'عالية'}
              </Text>
              <Text style={[styles.metricNumber, { color: theme.text.secondary }]}>
                ({competitionLevel} منافسين)
              </Text>
            </View>
          </View>
        </View>

        {/* View on Map Button */}
        <TouchableOpacity
          style={[styles.mapButton, { borderColor: theme.brand.primary }]}
          onPress={() => {
            // Handle map view
            Alert.alert('عرض على الخريطة', `سيتم عرض منطقة ${recommendation.district_name || recommendation.zone_id} على الخريطة`);
          }}
        >
          <Text style={[styles.mapButtonText, { color: theme.brand.primary }]}>
            عرض على الخريطة 🗺️
          </Text>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
};
