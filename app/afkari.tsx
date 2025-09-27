import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../src/context/ThemeContext";
import { useRTL } from "../src/hooks/useRTL";
import { Button } from "../components/design-system";
import { spacing, typography } from "../constants/design-tokens";

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

  const handleFindPlaces = () => {
    if (!selectedIdeaId) {
      Alert.alert(
        "تنبيه",
        "يرجى اختيار فكرة أولاً للبحث عن أماكن مناسبة لها"
      );
      return;
    }
    
    const selectedIdea = ideas.find(idea => idea.id === selectedIdeaId);
    if (selectedIdea) {
      // TODO: Navigate to recommendations with selected idea
      Alert.alert(
        "البحث عن أماكن",
        `سيتم البحث عن أماكن مناسبة لفكرة: ${selectedIdea.name}`
      );
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
        {loading ? (
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
          disabled={ideas.length === 0 || !selectedIdeaId}
          activeOpacity={ideas.length > 0 && selectedIdeaId ? 0.8 : 1}
        >
          <Text style={[
            styles.findButtonText,
            {
              color: ideas.length > 0 && selectedIdeaId 
                ? theme.text.inverse || '#FFFFFF'
                : theme.text.tertiary || '#6B7280'
            }
          ]}>
            ابحث عن أماكن
          </Text>
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
});

export default AfkariScreen;
