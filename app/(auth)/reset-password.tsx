import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { supabaseApi } from '@lib/supabase';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@config/env';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();

  // Hash password (using same method as sign-up)
  const hashPassword = (password: string): string => {
    return `hash_${password}_${new Date().getTime()}`;
  };

  // Update password in database
  const updateUserPassword = async (phone: string, passwordHash: string): Promise<boolean> => {
    try {
      console.log('Attempting to update password for phone:', phone);
      
      // Try entrepreneurs table first (might not have phone column)
      try {
        const entrepreneurResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?phone=eq.${phone}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              password_hash: passwordHash,
              updated_at: new Date().toISOString()
            })
          }
        );

        if (entrepreneurResponse.ok) {
          const result = await entrepreneurResponse.json();
          if (result.length > 0) {
            console.log('Password updated for entrepreneur');
            return true;
          }
        }
      } catch (error) {
        console.log('Entrepreneurs table might not have phone column, trying owners...');
      }

      // Try owners table
      try {
        const ownerResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?phone=eq.${phone}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              password_hash: passwordHash,
              updated_at: new Date().toISOString()
            })
          }
        );

        if (ownerResponse.ok) {
          const result = await ownerResponse.json();
          if (result.length > 0) {
            console.log('Password updated for owner');
            return true;
          }
        }
      } catch (error) {
        console.log('Error updating owners table:', error);
      }

      console.log('No user found with phone number:', phone);
      return false;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const validatePassword = (): boolean => {
    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return false;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    setError('');

    try {
      const passwordHash = hashPassword(newPassword);
      const success = await updateUserPassword(phoneNumber as string, passwordHash);

      if (success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully',
          [
            {
              text: 'Sign In',
              onPress: () => router.replace('/sign-in')
            }
          ]
        );
      } else {
        setError('Failed to update password. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>

        {/* Phone Number Display */}
        <Text style={styles.phoneDisplay}>{phoneNumber}</Text>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm New Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text>{showConfirmPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, loading && styles.resetButtonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.resetButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    height: 120,
    width: 200,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
    textAlign: 'center',
  },
  phoneDisplay: {
    fontSize: 16,
    color: '#F5A623',
    fontWeight: '600',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5A623',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    height: 60,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
    height: '100%',
  },
  eyeIcon: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#F5A623',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#718096',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
