import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../src/context/ThemeContext";
import { useRTL } from "../src/hooks/useRTL";
import { Button, TextInput } from "../components/design-system";
import { spacing, typography } from "../constants/design-tokens";
import { Idea } from "./afkari";

// Business types in Arabic and English
const BUSINESS_TYPES = [
  { id: 'cafe', nameAr: 'مقهى', nameEn: 'Cafe' },
  { id: 'gym', nameAr: 'نادي رياضي', nameEn: 'Gym' },
  { id: 'barber', nameAr: 'حلاق', nameEn: 'Barber' },
  { id: 'pharmacy', nameAr: 'صيدلية', nameEn: 'Pharmacy' },
  { id: 'restaurant', nameAr: 'مطعم', nameEn: 'Restaurant' },
  { id: 'supermarket', nameAr: 'سوبر ماركت', nameEn: 'Supermarket' },
  { id: 'laundry', nameAr: 'مغسلة', nameEn: 'Laundry' },
  { id: 'bakery', nameAr: 'مخبز', nameEn: 'Bakery' },
  { id: 'electronics', nameAr: 'إلكترونيات', nameEn: 'Electronics' },
  { id: 'clothing', nameAr: 'محل ملابس', nameEn: 'Clothing Store' },
];

// Riyadh districts
const RIYADH_DISTRICTS = [
  'الملز', 'العليا', 'الروضة', 'النرجس', 'الياسمين', 'السليمانية', 
  'المروج', 'الحمراء', 'المرسلات', 'الغدير', 'النهضة', 'الربيع',
  'الفلاح', 'الصحافة', 'قرطبة', 'الريان', 'المهدية', 'الوادي',
  'الشفا', 'المنار', 'السويدي', 'الشميسي', 'الدرعية', 'عرقة',
  'الدوحة الجنوبية', 'الندى', 'الورود', 'الفيحاء', 'المنصورة', 'العقيق'
];

interface DropdownProps {
  title: string;
  value: string;
  onSelect: (value: string) => void;
  options: string[] | { id: string; nameAr: string; nameEn: string }[];
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, value, onSelect, options, placeholder }) => {
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const { textAlign } = useRTL();

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (typeof options[0] === 'string') {
      return value;
    } else {
      const option = (options as { id: string; nameAr: string; nameEn: string }[])
        .find(opt => opt.id === value);
      return option ? option.nameAr : value;
    }
  };

  const renderOption = (option: string | { id: string; nameAr: string; nameEn: string }) => {
    const displayText = typeof option === 'string' ? option : option.nameAr;
    const valueToSelect = typeof option === 'string' ? option : option.id;
    
    return (
      <TouchableOpacity
        key={valueToSelect}
        style={[styles.optionItem, { borderBottomColor: theme.border.primary }]}
        onPress={() => {
          onSelect(valueToSelect);
          setShowModal(false);
        }}
      >
        <Text style={[styles.optionText, { color: theme.text.primary, textAlign: textAlign('right') }]}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: theme.text.primary, textAlign: textAlign('right') }]}>
        {title}
      </Text>
      
      <TouchableOpacity
        style={[styles.dropdown, { 
          backgroundColor: theme.surface.primary,
          borderColor: theme.border.primary 
        }]}
        onPress={() => setShowModal(true)}
      >
        <Text style={[
          styles.dropdownText,
          { 
            color: value ? theme.text.primary : theme.text.tertiary,
            textAlign: textAlign('right')
          }
        ]}>
          {getDisplayValue()}
        </Text>
        <Text style={[styles.dropdownArrow, { color: theme.text.tertiary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background.primary }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={[styles.modalCloseButton, { color: theme.brand.primary, textAlign: 'right' }]}>
                إلغاء
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text.primary, textAlign: 'right' }]}>
              {title}
            </Text>
            <View style={{ width: 50 }} />
          </View>
          
          <FlatList
            data={options as any[]}
            keyExtractor={(item) => typeof item === 'string' ? item : item.id}
            renderItem={({ item }) => renderOption(item)}
            style={styles.optionsList}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const AddIdeaScreen: React.FC = () => {
  const [ideaName, setIdeaName] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [ideaType, setIdeaType] = useState('');
  const [ideaArea, setIdeaArea] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { textAlign, isRTL } = useRTL();

  const isEditMode = params.editMode === 'true';
  const editingIdea: Idea | null = params.ideaData ? JSON.parse(params.ideaData as string) : null;

  useEffect(() => {
    if (isEditMode && editingIdea) {
      setIdeaName(editingIdea.name);
      setIdeaDescription(editingIdea.description);
      setIdeaType(editingIdea.type);
      setIdeaArea(editingIdea.area);
    }
  }, [isEditMode, editingIdea]);

  const validateForm = () => {
    if (!ideaName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الفكرة');
      return false;
    }
    if (!ideaDescription.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال وصف الفكرة');
      return false;
    }
    if (!ideaType) {
      Alert.alert('خطأ', 'يرجى اختيار نوع الفكرة');
      return false;
    }
    if (!ideaArea) {
      Alert.alert('خطأ', 'يرجى اختيار المنطقة');
      return false;
    }
    return true;
  };

  const saveIdea = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const storedIdeas = await AsyncStorage.getItem('user_ideas');
      const existingIdeas: Idea[] = storedIdeas ? JSON.parse(storedIdeas) : [];

      const newIdea: Idea = {
        id: isEditMode && editingIdea ? editingIdea.id : Date.now().toString(),
        name: ideaName.trim(),
        description: ideaDescription.trim(),
        type: ideaType,
        area: ideaArea,
        createdAt: isEditMode && editingIdea ? editingIdea.createdAt : new Date().toISOString(),
      };

      let updatedIdeas: Idea[];
      if (isEditMode && editingIdea) {
        updatedIdeas = existingIdeas.map(idea => 
          idea.id === editingIdea.id ? newIdea : idea
        );
      } else {
        updatedIdeas = [...existingIdeas, newIdea];
      }

      await AsyncStorage.setItem('user_ideas', JSON.stringify(updatedIdeas));
      
      Alert.alert(
        'نجح الحفظ',
        isEditMode ? 'تم تحديث الفكرة بنجاح' : 'تم إضافة الفكرة بنجاح',
        [
          { text: 'موافق', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error saving idea:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الفكرة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
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
          {isEditMode ? 'تعديل الفكرة' : 'ادخل معلومات الفكرة'}
        </Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.formTitle, { color: theme.text.primary, textAlign: 'right' }]}>
            الفكرة
          </Text>
          <Text style={[styles.formSubtitle, { color: theme.text.secondary, textAlign: 'right' }]}>
            اكتب تفاصيل المحل اللي تبي تفتحه
          </Text>
        </View>

        {/* Idea Name */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text.primary, textAlign: 'right' }]}>
            اسم المحل
          </Text>
          <TextInput
            value={ideaName}
            onChangeText={setIdeaName}
            placeholder="مثال: مقهى السعادة"
            containerStyle={styles.textInput}
            inputStyle={{ textAlign: 'right' }}
            rtlEnabled
          />
        </View>

        {/* Idea Description */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: theme.text.primary, textAlign: 'right' }]}>
            وصف الفكرة
          </Text>
          <TextInput
            value={ideaDescription}
            onChangeText={setIdeaDescription}
            placeholder="الوصف"
            multiline
            numberOfLines={4}
            containerStyle={styles.textArea}
            inputStyle={{ textAlign: 'right' }}
            rtlEnabled
          />
        </View>

        {/* Idea Type Dropdown */}
        <Dropdown
          title="نوع المحل"
          value={ideaType}
          onSelect={setIdeaType}
          options={BUSINESS_TYPES}
          placeholder="اختر نوع المحل"
        />

        {/* Area Dropdown */}
        <Dropdown
          title="المنطقة"
          value={ideaArea}
          onSelect={setIdeaArea}
          options={RIYADH_DISTRICTS}
          placeholder="اختر منطقة في الرياض"
        />
      </ScrollView>

      {/* Add Idea Button */}
      <View style={styles.bottomSection}>
        <Button
          variant="primary"
          size="large"
          onPress={saveIdea}
          loading={loading}
          style={styles.addButton}
        >
          {isEditMode ? 'تحديث الفكرة' : 'أضف الفكرة'}
        </Button>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    ...typography.heading.h3,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  titleSection: {
    marginBottom: spacing[6],
  },
  formTitle: {
    ...typography.heading.h2,
    fontWeight: 'bold',
    marginBottom: spacing[1],
  },
  formSubtitle: {
    ...typography.body.medium,
  },
  fieldContainer: {
    marginBottom: spacing[5],
  },
  fieldLabel: {
    ...typography.body.medium,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  textInput: {
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 50,
  },
  dropdownText: {
    ...typography.body.medium,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: spacing[2],
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  modalTitle: {
    ...typography.heading.h3,
    fontWeight: 'bold',
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 0.5,
  },
  optionText: {
    ...typography.body.medium,
  },
  bottomSection: {
    padding: spacing[4],
    paddingBottom: spacing[6],
  },
  addButton: {
    borderRadius: 12,
  },
});

export default AddIdeaScreen;
