// FilterHeader.tsx
import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { icons } from "../constants";
import { useFilters } from "../src/context/FilterContext";
import FilterModal from "./FilterModal";
import BusinessTypeModal from "./BusinessTypeModal";

const FilterHeader: FC = () => {
   const { t } = useTranslation();
   const {
     sortOption,
     cycleSortOption,
     setFilterModalVisible,
     setBusinessTypeModalVisible,
     selectedBusinessType,
     getActiveFilterCount,
   } = useFilters();

  // Get sort text based on current option
  const getSortText = () => {
    switch (sortOption) {
      case 'price':
        return t('filters.sortedByPrice');
      case 'area':
        return t('filters.sortedByArea');
      default:
        return t('filters.notSorted');
    }
  };

  // Get business type text
  const getBusinessTypeText = () => {
    if (selectedBusinessType === 'none') {
      return t('filters.noTypeSelected');
    }
    return selectedBusinessType;
  };

  // Get filter count text
  const getFilterCountText = () => {
    const count = getActiveFilterCount();
    if (count === 0) {
      return t('filters.noFilters');
    }
    return `${count} ${count === 1 ? t('filters.filterApplied') : t('filters.filtersApplied')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {/* Sort Button - cycles through sort options */}
        <TouchableOpacity
          style={[styles.button, sortOption !== 'none' && styles.activeButton]}
          onPress={cycleSortOption}
        >
          <Image
            style={[styles.icon, { tintColor: sortOption !== 'none' ? "#fbb507" : "#626262" }]}
            source={icons.sort}
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>{t('filters.sort')}</Text>
            <Text style={[styles.subText, sortOption !== 'none' && styles.activeSubText]}>
              {getSortText()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Filter Button - opens filter modal */}
        <TouchableOpacity
          style={[styles.button, getActiveFilterCount() > 0 && styles.activeButton]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Image
            style={[styles.icon, { tintColor: getActiveFilterCount() > 0 ? "#fbb507" : "#626262" }]}
            source={icons.filters}
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>{"فرز"}</Text>
            <Text style={[styles.subText, getActiveFilterCount() > 0 && styles.activeSubText]}>
              {getFilterCountText()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Business Type Button - opens business type modal */}
        <TouchableOpacity
          style={[styles.button, selectedBusinessType !== 'none' && styles.activeButton]}
          onPress={() => setBusinessTypeModalVisible(true)}
        >
          <Image
            style={[styles.icon, { tintColor: selectedBusinessType !== 'none' ? "#fbb507" : "#626262" }]}
            source={icons.idea}
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>{t('filters.selectedIdea')}</Text>
            <Text style={[styles.subText, selectedBusinessType !== 'none' && styles.activeSubText]}>
              {getBusinessTypeText()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Render modals */}
      <FilterModal />
      <BusinessTypeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingTop: 0,
    paddingEnd:15,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  activeButton: {
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginEnd: 4,
    tintColor: "#626262",
  },
  activeIcon: {
    tintColor: "#fbb507",
  },
  textColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "grey",
  },
  activeSubText: {
    color: "#fbb507",
    fontWeight: "500",
  },
});

export default FilterHeader;

