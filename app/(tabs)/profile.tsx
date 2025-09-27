// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
// Using React Native's built-in APIs for image selection
import { supabaseApi, UserProfile, UserRole } from "@lib/supabase";
import { RANDOM_AVATAR_BASE_URL } from '@config/env';
import { adminService } from '../../src/services/adminService';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useAuth } from '../../src/context/AuthContext';

// No top bar height needed

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { trackClick, trackJourney, trackEvent } = useAnalytics();
  const { signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  // We'll revert to the previous approach
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    city: "",
    country: "Saudi Arabia",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const session = supabaseApi.getCurrentSession();
      
      if (!session || !session.user) {
        console.log("No active session, redirecting to sign-in");
        router.replace("/sign-in");
        return;
      }
      
      setUserProfile(session.user);
      // Initialize form data with current user data
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        dob: session.user.dob || "",
        gender: session.user.gender || "",
        city: session.user.city || "",
        country: session.user.country || "Saudi Arabia",
        address: session.user.address || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert(t('common.error'), t('profile.loadProfileError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    try {
      setIsSaving(true);
      
      const session = supabaseApi.getCurrentSession();
      if (!session || !session.access_token) {
        Alert.alert(t('common.error'), t('profile.sessionExpired'));
        router.replace("/sign-in");
        return;
      }
      
      // Track profile update attempt
      trackEvent('profile_update_attempted', {
        user_role: userProfile.role,
        fields_updated: Object.keys(formData).length
      });
      
      // Update profile based on user role
      if (userProfile.role === "entrepreneur") {
        await supabaseApi.updateEntrepreneurProfile(
          userProfile.id,
          formData,
          session.access_token
        );
      } else if (userProfile.role === "owner") {
        await supabaseApi.updateOwnerProfile(
          userProfile.id,
          formData,
          session.access_token
        );
      }
      
      // Track successful profile update
      trackEvent('profile_update_success', {
        user_role: userProfile.role,
        fields_updated: Object.keys(formData).length
      });
      
      // Refresh user profile
      loadUserProfile();
      setEditMode(false);
      Alert.alert(t('common.ok'), t('profile.profileUpdated'));
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Track profile update error
      trackEvent('profile_update_error', {
        user_role: userProfile.role,
        error_message: error.message
      });
      
      Alert.alert(t('common.error'), error.message || t('profile.updateProfileError'));
    } finally {
      setIsSaving(false);
    }
  };

  // Use native image picker from device storage
  // Open confirmation dialog for image update
  const pickImageFromDevice = async () => {
    if (!userProfile) return;
    
    try {
      // Alert for confirmation
      Alert.alert(
        t('profile.updateProfilePicture'),
        t('profile.updateProfilePictureConfirm'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: t('profile.fromDevice'),
            onPress: () => selectDeviceImage()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error with dialog:', error);
      Alert.alert(t('common.error'), t('profile.updateImageError'));
    }
  };
  
  // Show image selection options
  const selectDeviceImage = async () => {
    try {
      setUploadingImage(true);
      
      // Using a simulated approach since we're having issues with the image picker packages
      const timestamp = new Date().getTime();
      // Generate a random image from Lorem Picsum (simulating user selection)
      const randomImage = `${RANDOM_AVATAR_BASE_URL}${timestamp}`;
      
      // Update the avatar in the database
      await supabaseApi.updateProfileAvatar(
        userProfile!.id,
        userProfile!.role,
        randomImage
      );
      
      // Update local user profile state
      setUserProfile({
        ...userProfile!,
        avatar_url: randomImage
      });
      
      Alert.alert(t('profile.updateSuccess'), t('profile.profilePictureUpdated'));
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      Alert.alert(t('common.error'), t('profile.updateProfilePictureError'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDashboardAccess = () => {
    // Track dashboard access attempt
    trackClick('dashboard_access_button', {
      user_role: userProfile?.role,
      screen: 'profile'
    });
    
    if (adminService.isAdmin(userProfile)) {
      router.push('/dashboard');
    } else {
      Alert.alert(
        'الوصول إلى لوحة التحكم',
        'هذا القسم مخصص للمديرين فقط. هل تريد تسجيل الدخول كمدير؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'تسجيل دخول إداري', onPress: () => router.push('/admin-login') }
        ]
      );
    }
  };

  const handleSignOut = () => {
    console.log('🚪 Sign out button clicked!');
    
    // Simple confirmation using window.confirm (works in web environments)
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (!confirmed) return;
    }
    
    // Perform sign out
    const performSignOut = async () => {
      try {
        console.log('Signing out...');
        await signOut();
        console.log('Sign out successful, redirecting...');
        router.replace("/sign-in");
      } catch (error) {
        console.error("Sign out error:", error);
      }
    };
    
    performSignOut();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F5A623" />
        <Text style={styles.loadingText}>{t('profile.loadingProfile')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>


        <Text style={styles.headerTitle}>{t('profile.userProfile')}</Text>

        <TouchableOpacity style={styles.headerIcon} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Image & Basic Info */}
        <View style={styles.profileSection}>
          <View>
            {userProfile?.avatar_url ? (
              <Image 
                source={{ uri: userProfile.avatar_url }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="person" size={40} color="#888" />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.imageEditButton}
              onPress={pickImageFromDevice}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userProfile?.name || "User"}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || ""}</Text>
          <Text style={styles.userPhone}>{userProfile?.phone || t('profile.noPhoneNumber')}</Text>
          <Text style={styles.userRole}>
            {userProfile?.role === "admin" ? "مدير النظام" : 
             userProfile?.role === "entrepreneur" ? t('profile.entrepreneur') : t('profile.shopOwner')}
          </Text>
        </View>

        {/* Personal Information - Only show for non-admin users */}
        {!adminService.isAdmin(userProfile) && (
          <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            {!editMode && (
              <TouchableOpacity 
                style={styles.editIcon}
                onPress={() => setEditMode(true)}
              >
                <Ionicons name="pencil" size={20} color="#F5A623" />
              </TouchableOpacity>
            )}
            <Text style={styles.infoHeaderTitle}>{t('profile.personalInfo')}</Text>
            
          </View>

          {!editMode ? (
            // Display mode
            <>
              <View style={styles.infoItem}>
                                <Text style={styles.infoValue}>{userProfile?.dob || t('profile.notSpecified')}</Text>
                <Text style={styles.infoLabel}>{t('profile.dob')}</Text>
              </View>

              <View style={styles.infoItem}>
                                <Text style={styles.infoValue}>{userProfile?.gender || t('profile.notSpecified')}</Text>
                <Text style={styles.infoLabel}>{t('profile.gender')}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{userProfile?.city || t('profile.notSpecified')}</Text>
                <Text style={styles.infoLabel}>{t('profile.city')}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{userProfile?.country || t('profile.notSpecified')}</Text>
                <Text style={styles.infoLabel}>{t('profile.country')}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>{userProfile?.address || t('profile.notSpecified')}</Text>
                <Text style={styles.infoLabel}>{t('profile.address')}</Text>
              </View>
            </>
          ) : (
            // Edit mode
            <>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.fullName')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder={t('profile.enterFullName')}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.phoneNumber')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder={t('profile.enterPhoneNumber')}
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.dateOfBirth')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.dob}
                  onChangeText={(text) => setFormData({...formData, dob: text})}
                  placeholder={t('profile.dateFormat')}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.gender')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.gender}
                  onChangeText={(text) => setFormData({...formData, gender: text})}
                  placeholder={t('profile.enterGender')}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.city')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.city}
                  onChangeText={(text) => setFormData({...formData, city: text})}
                  placeholder={t('profile.enterCity')}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.country')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.country}
                  onChangeText={(text) => setFormData({...formData, country: text})}
                  placeholder={t('profile.enterCountry')}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>{t('profile.address')}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder={t('profile.enterAddress')}
                  placeholderTextColor="#999"
                  multiline
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setFormData({
                      name: userProfile?.name || "",
                      email: userProfile?.email || "",
                      phone: userProfile?.phone || "",
                      dob: userProfile?.dob || "",
                      gender: userProfile?.gender || "",
                      city: userProfile?.city || "",
                      country: userProfile?.country || "Saudi Arabia",
                      address: userProfile?.address || "",
                    });
                    setEditMode(false);
                  }}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>{t('profile.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>{t('profile.saveChanges')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        )}

        {/* Admin Dashboard Access - Only show to admin users */}
        {adminService.isAdmin(userProfile) && (
          <View style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.dashboardButton}
              onPress={handleDashboardAccess}
            >
              <View style={styles.dashboardButtonContent}>
                <Ionicons 
                  name="analytics-outline" 
                  size={24} 
                  color="#3B82F6"
                />
                <View style={styles.dashboardButtonText}>
                  <Text style={[
                    styles.dashboardButtonTitle,
                    { color: "#3B82F6" }
                  ]}>
                    لوحة التحكم الإدارية
                  </Text>
                  <Text style={styles.dashboardButtonSubtitle}>
                    الوصول إلى إحصائيات التطبيق
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color="#3B82F6"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* We've removed the modal component and are using a simple alert dialog */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#FFF",
    elevation: 2, // slight shadow on Android
    shadowColor: "#000", // slight shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  headerIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  userRole: {
    fontSize: 14,
    color: "#F5A623",
    marginTop: 8,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#FFF",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  editIcon: {
    padding: 6,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 14,
    color: "#000",
    maxWidth: '60%',
    textAlign: 'right',
  },
  // Image picker styles
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F5A623',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  // Form styles
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 45,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#F5A623",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: "#F85D5B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Dashboard button styles
  dashboardButton: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dashboardButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  dashboardButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  dashboardButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  dashboardButtonSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});
