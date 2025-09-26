import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@context/ThemeContext";
import { useFilters } from "@context/FilterContext";
import { Button, Card } from "@components/design-system";
import { spacing, typography, colors } from "@/constants/design-tokens";
import { fetchZoneRecommendations, ZoneRecommendation } from "@utils/zoneRecommendations";
import BusinessTypeModal from "@components/BusinessTypeModal";
import { useRTL } from "@hooks/useRTL";

const { width } = Dimensions.get("window");

interface RecommendationCardProps {
  recommendation: ZoneRecommendation;
  index: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, index }) => {
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
              {recommendation.district_name || `Zone ${recommendation.zone_id}`}
            </Text>
            <Text style={[styles.scoreText, { color: getScoreColor(scorePercentage), textAlign: textAlign("left") }]}>
              {scorePercentage.toFixed(0)}% Match
            </Text>
          </View>
        </View>

        {/* Score breakdown */}
        <View style={styles.scoreSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary, textAlign: textAlign("left") }]}>
            {t("recommendations.scoreBreakdown")}
          </Text>
          
          {/* Popularity Score */}
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              📍 {t("recommendations.popularity")}
            </Text>
            <View style={styles.metricValue}>
              <View style={[styles.progressBar, { backgroundColor: theme.surface.secondary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: colors.primary[500],
                      width: `${popularityPercentage}%`
                    }
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
              ⭐ {t("recommendations.ratings")}
            </Text>
            <View style={styles.metricValue}>
              <Text style={[styles.metricNumber, { color: theme.text.primary }]}>
                {recommendation.total_user_ratings.toFixed(1)}/5.0
              </Text>
            </View>
          </View>

          {/* Competition */}
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.text.primary, textAlign: textAlign("left") }]}>
              🏪 {t("recommendations.competition")}
            </Text>
            <View style={styles.metricValue}>
              <Text style={[
                styles.competitionText, 
                { color: getCompetitionColor(competitionLevel) }
              ]}>
                {competitionLevel === 0 ? t("recommendations.noCompetition") : 
                 competitionLevel <= 2 ? t("recommendations.lowCompetition") :
                 competitionLevel <= 5 ? t("recommendations.moderateCompetition") :
                 t("recommendations.highCompetition")}
              </Text>
              <Text style={[styles.metricNumber, { color: theme.text.secondary }]}>
                ({competitionLevel} {t("recommendations.competitors")})
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <Button
          variant="secondary"
          size="medium"
          onPress={() => {
            Alert.alert(
              t("recommendations.viewLocation"),
              t("recommendations.viewLocationDescription"),
              [
                { text: t("common.cancel"), style: "cancel" },
                { text: t("recommendations.openMaps"), onPress: () => {
                  // TODO: Open maps with coordinates
                  console.log("Opening maps for zone:", recommendation.zone_id);
                }}
              ]
            );
          }}
          style={{ marginTop: spacing[3] }}
        >
          {`🗺️ ${t("recommendations.viewOnMap")}`}
        </Button>
      </Card>
    </Animated.View>
  );
};

const RecommendationScreen: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ZoneRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { selectedBusinessType, setBusinessTypeModalVisible } = useFilters();
  const { textAlign } = useRTL();

  const hasValidBusinessType = selectedBusinessType && selectedBusinessType !== "none";

  const fetchRecommendations = async (isRefresh = false) => {
    if (!hasValidBusinessType) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const results = await fetchZoneRecommendations(selectedBusinessType);
      setRecommendations(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      Alert.alert(
        t("common.error"),
        t("recommendations.errorFetching")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hasValidBusinessType) {
      fetchRecommendations();
    }
  }, [selectedBusinessType]);

  const EmptyState = () => (
    <ScrollView
      contentContainerStyle={styles.emptyContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchRecommendations(true)}
          tintColor={theme.brand.primary}
        />
      }
    >
      <Text style={[styles.emptyIcon, { textAlign: textAlign("center") }]}>🎯</Text>
      <Text style={[styles.emptyTitle, { color: theme.text.primary, textAlign: textAlign("center") }]}>
        {hasValidBusinessType ? t("recommendations.noResults") : t("recommendations.selectBusinessType")}
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.text.secondary, textAlign: textAlign("center") }]}>
        {hasValidBusinessType 
          ? t("recommendations.noResultsDescription") 
          : t("recommendations.selectBusinessTypeDescription")}
      </Text>
      
      <Button
        variant="primary"
        size="large"
        onPress={() => setBusinessTypeModalVisible(true)}
        style={{ marginTop: spacing[4] }}
      >
        {`🏪 ${t("recommendations.chooseBusinessType")}`}
      </Button>
    </ScrollView>
  );

  if (!hasValidBusinessType || (hasValidBusinessType && recommendations.length === 0 && !loading)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text.primary, textAlign: textAlign("left") }]}>
            {t("recommendations.title")}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary, textAlign: textAlign("left") }]}>
            {t("recommendations.subtitle")}
          </Text>
        </View>
        
        <EmptyState />
        
        <BusinessTypeModal />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.primary, textAlign: textAlign("left") }]}>
          {t("recommendations.title")}
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.text.secondary, textAlign: textAlign("left") }]}>
          {t("recommendations.recommendationsFor")} <Text style={{ color: theme.brand.primary }}>{selectedBusinessType}</Text>
        </Text>
        
        <Button
          variant="ghost"
          size="small"
          onPress={() => setBusinessTypeModalVisible(true)}
          style={{ alignSelf: "flex-start", marginTop: spacing[2] }}
        >
          {`🔄 ${t("recommendations.changeBusiness")}`}
        </Button>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.brand.primary} />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
            {t("recommendations.analyzing")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.zone_id.toString()}
          renderItem={({ item, index }) => (
            <RecommendationCard recommendation={item} index={index} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchRecommendations(true)}
              tintColor={theme.brand.primary}
            />
          }
        />
      )}

      <BusinessTypeModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  headerTitle: {
    ...typography.heading.h2,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    ...typography.body.medium,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[4],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    ...typography.heading.h3,
    marginBottom: spacing[2],
  },
  emptyDescription: {
    ...typography.body.medium,
    lineHeight: 24,
    marginBottom: spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.body.medium,
    marginTop: spacing[3],
  },
});

export default RecommendationScreen;
