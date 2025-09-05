import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFilters, BusinessType as CtxBusinessType } from '../../src/context/FilterContext';

const buttonWidth = 110;

const toContextType = (id: string): CtxBusinessType => {
  switch (id) {
    case 'all':
      return 'none';
    case 'barber':
      return 'Barber';
    case 'gym':
      return 'Gym';
    case 'gas_station':
      return 'Gas Station';
    case 'laundry':
      return 'Laundry';
    case 'pharmacy':
      return 'Pharmacy';
    case 'supermarket':
      return 'Supermarket';
    default:
      return 'none';
  }
};

export default function FilterBar() {
  const { selectedBusinessType, setSelectedBusinessType } = useFilters();
  const scrollViewRef = useRef<ScrollView | null>(null);

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'barber', name: 'Barber' },
    { id: 'gym', name: 'Gym' },
    { id: 'gas_station', name: 'Gas Station' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'pharmacy', name: 'Pharmacy' },
    { id: 'supermarket', name: 'Supermarket' },
  ];

  const activeId = (() => {
    switch (selectedBusinessType) {
      case 'Barber': return 'barber';
      case 'Gym': return 'gym';
      case 'Gas Station': return 'gas_station';
      case 'Laundry': return 'laundry';
      case 'Pharmacy': return 'pharmacy';
      case 'Supermarket': return 'supermarket';
      default: return 'all';
    }
  })();

  const scrollToFilter = (index: number) => {
    if (scrollViewRef.current) {
      const scrollPosition = Math.max(0, index * buttonWidth - 30);
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  return (
    <View style={styles.filtersContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterButton, activeId === filter.id && styles.activeFilterButton]}
            onPress={() => {
              setSelectedBusinessType(toContextType(filter.id));
              scrollToFilter(index);
            }}
          >
            <Text style={[styles.filterButtonText, activeId === filter.id && styles.activeFilterButtonText]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffb224',
    paddingHorizontal: 16,
  },
  filtersScrollContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 1,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 90,
  },
  activeFilterButton: {
    backgroundColor: '#F5A623',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
