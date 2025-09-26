// MarketScreen.tsx
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring, 
  interpolate, 
  Extrapolation 
} from "react-native-reanimated";

import SearchBar from "@components/SearchBar";
import MarketCard from "@components/MarketCard";
import FilterHeader from "@components/FilterHeader";
import { supabaseApi } from "@lib/supabase";
import { useFilters } from "@context/FilterContext";
import { useTheme } from "@context/ThemeContext";
import { useRTL } from "@hooks/useRTL";
import { useAnalytics } from "@hooks/useAnalytics";
import { MarketplaceItem } from "@components/types";
import { Button } from "@components/design-system/Button";
import { spacing, typography } from "../../constants/design-tokens";
import { PLACEHOLDER_IMAGE_URL } from "@config/env";

const { height } = Dimensions.get("window");

const normalizeItem = (raw: any): MarketplaceItem => ({
  id: String(raw?.id ?? raw?.uuid ?? raw?.listing_id ?? Math.random()),
  title: raw?.title ?? raw?.name ?? "",
  businessName: raw?.businessName ?? raw?.company ?? "",
  location: raw?.location ?? [raw?.city, raw?.district].filter(Boolean).join(" - "),
  price: String(raw?.price ?? raw?.amount ?? ""),
  size: raw?.size ? String(raw.size) : null,
  zone_id: raw?.zone_id ?? undefined,
  image: raw?.image?.startsWith("http") ? raw.image : PLACEHOLDER_IMAGE_URL,
  businessType: raw?.businessType ?? "",
  originalData: raw,
});

const SkeletonCard = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.skeleton, { backgroundColor: theme.surface.primary }]}>
      <View style={[styles.skeletonImage, { backgroundColor: theme.surface.secondary }]} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { backgroundColor: theme.surface.secondary }]} />
        <View style={[styles.skeletonLine, { backgroundColor: theme.surface.secondary, width: "60%" }]} />
      </View>
    </View>
  );
};

const EmptyState: FC<{ title: string; description: string; onRetry: () => void }> = ({ title, description, onRetry }) => {
  const { theme } = useTheme();
  const { textAlign } = useRTL();
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: theme.text.primary, textAlign: textAlign("center") }]}>{title}</Text>
      <Text style={[styles.emptyDesc, { color: theme.text.secondary, textAlign: textAlign("center") }]}>{description}</Text>
      <Button onPress={onRetry}>{title}</Button>
    </View>
  );
};

const MarketScreen: FC = () => {
  const [data, setData] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { t } = useTranslation();
  const { applyFilters } = useFilters();
  const { theme } = useTheme();
  const { trackClick, trackJourney, trackEvent } = useAnalytics();

  const scrollY = useSharedValue(0);

  const fetchData = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const raw = await supabaseApi.fetchListings(pageNum, 20);
      const normalized = raw.map(normalizeItem);
      setData(prev => (append ? [...prev, ...normalized] : normalized));
      setPage(pageNum);
      setError(null);
      
      // Track data fetch
      trackEvent('home_data_fetched', {
        page: pageNum,
        items_count: normalized.length,
        append_mode: append
      });
    } catch (e) {
      setError("Failed to fetch data");
      trackEvent('home_data_fetch_error', {
        page: pageNum,
        error: String(e)
      });
    } finally {
      setLoading(false);
      setMoreLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    const filteredData = applyFilters(
      data.filter(d =>
        d.title.toLowerCase().includes(s) ||
        d.businessName.toLowerCase().includes(s) ||
        d.location.toLowerCase().includes(s)
      )
    );
    
    // Track search activity
    if (search) {
      trackEvent('home_search_performed', {
        search_query: search,
        results_count: filteredData.length,
        total_items: data.length
      });
    }
    
    return filteredData;
  }, [data, search, applyFilters, trackEvent]);

  const handleScroll = (e: any) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
    if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height >= e.nativeEvent.contentSize.height - 100) {
      if (!moreLoading) {
        setMoreLoading(true);
        trackEvent('home_pagination_triggered', {
          current_page: page,
          next_page: page + 1
        });
        fetchData(page + 1, true);
      }
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(interpolate(scrollY.value, [0, 70], [0, -20], Extrapolation.CLAMP)) },
    ],
    opacity: withTiming(scrollY.value > 50 ? 0 : 1, { duration: 300 }),
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <SearchBar value={search} onSearch={setSearch} onClear={() => setSearch("")} />
        <FilterHeader />
      </Animated.View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MarketCard item={item} />}
        ListEmptyComponent={() =>
          loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <EmptyState title={t("common.errors.errorOccurred")} description={error} onRetry={() => fetchData(1)} />
          ) : (
            <EmptyState
              title={t("home.empty.noData.title")}
              description={t("home.empty.noData.description")}
              onRetry={() => fetchData(1)}
            />
          )
        }
        ListFooterComponent={
          moreLoading ? (
            <ActivityIndicator style={{ margin: 20 }} color={theme.brand.primary} />
          ) : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(1); }} />}
        contentContainerStyle={{ paddingTop: height * 0.2, paddingHorizontal: spacing[3], paddingBottom: spacing[6] }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 0,
    zIndex: 10,
    elevation: 3,
  },
  skeleton: { borderRadius: 16, marginBottom: spacing[3], overflow: "hidden" },
  skeletonImage: { width: "100%", height: 180 },
  skeletonContent: { padding: 16 },
  skeletonLine: { height: 16, borderRadius: 4, marginBottom: 8 },
  empty: { alignItems: "center", justifyContent: "center", padding: 20 },
  emptyTitle: { fontSize: typography.heading.h3.fontSize, fontWeight: "600", marginBottom: 8 },
  emptyDesc: { fontSize: typography.body.medium.fontSize, textAlign: "center", marginBottom: 16 },
});

export default MarketScreen;
