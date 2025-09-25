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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { sendOTP, formatPhoneNumber, isValidSaudiPhone } from '@utils/twilioService';
import { supabaseApi } from '@lib/supabase';
import { EXPO_PUBLIC_SUPABASE_URL } from '@config/env';

const PhoneSignInScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if phone number exists in database
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    try {
      console.log('Checking if phone exists for sign-in:', phone);
      
      // Check in entrepreneurs table
      const entrepreneurResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?phone=eq.${encodeURIComponent(phone)}&select=*`,
        {
          method: 'GET',
          headers: supabaseApi.getDefaultHeaders(),
        }
      );
      
      if (entrepreneurResponse.ok) {
        const entrepreneurs = await entrepreneurResponse.json();
        if (entrepreneurs.length > 0) {
          console.log('Phone found in entrepreneurs table for sign-in');
          return true;
        }
      }

      // Check in owners table
      const ownerResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?phone=eq.${encodeURIComponent(phone)}&select=*`,
        {
          method: 'GET',
          headers: supabaseApi.getDefaultHeaders(),
        }
      );
      
      if (ownerResponse.ok) {
        const owners = await ownerResponse.json();
        if (owners.length > 0) {
          console.log('Phone found in owners table for sign-in');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking phone exists for sign-in:', error);
      return false;
    }
  };

  const handleSendLoginOTP = async () => {
    setError('');
    
    // Validate phone number
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!isValidSaudiPhone(formattedPhone)) {
      setError('Please enter a valid Saudi phone number');
      return;
    }

    setLoading(true);

    try {
      // Check if phone exists in database
      const phoneExists = await checkPhoneExists(formattedPhone);
      
      if (!phoneExists) {
        setError('Phone number not registered. Please sign up first.');
        setLoading(false);
        return;
      }

      // Send OTP via Twilio
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        // Navigate to OTP verification screen for login
        router.push({
          pathname: '/verify-login-otp',
          params: { phoneNumber: formattedPhone }
        });
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
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
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Enter your phone number to sign in</Text>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+966</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Phone Number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={9}
                    />
                  </View>
                  
                  {/* Error Message */}
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                  onPress={handleSendLoginOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.signInButtonText}>Send Login Code</Text>
                  )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                  style={styles.signUpLink}
                  onPress={() => router.push('/sign-up')}
                >
                  <Text style={styles.signUpLinkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5A623',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    height: 60,
    paddingHorizontal: 16,
  },
  countryCode: {
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '600',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A202C',
    height: '100%',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  signInButton: {
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
  signInButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpLink: {
    paddingVertical: 12,
  },
  signUpLinkText: {
    color: '#F5A623',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PhoneSignInScreen;
