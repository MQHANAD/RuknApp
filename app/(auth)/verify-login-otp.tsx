import React, { useState, useRef, useEffect } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { verifyOTP, sendOTP } from '@utils/twilioService';
import { useAuth } from '@/src/context/AuthContext';
import { supabaseApi } from '@lib/supabase';
import { EXPO_PUBLIC_SUPABASE_URL } from '@config/env';

const VerifyLoginOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const { signIn, setUserDirectly } = useAuth();
  
  // Refs for OTP inputs
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Auto-focus first input on mount
  useEffect(() => {
    otpRefs[0].current?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    setError(''); // Clear error when user types
    
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      // Auto-focus next input
      if (numericValue && index < 3) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  // Handle backspace/delete
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Get user data from database
  const getUserByPhone = async (phone: string) => {
    try {
      // Check entrepreneurs table first
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
          return { ...entrepreneurs[0], role: 'entrepreneur' };
        }
      }

      // Check owners table
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
          return { ...owners[0], role: 'owner' };
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  };

  // Verify OTP and log in user
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify OTP with Twilio
      const result = await verifyOTP(phoneNumber as string, otpCode);
      
      if (result.success) {
        console.log('OTP verified successfully!');
        
        // Get user data from database
        const userData = await getUserByPhone(phoneNumber as string);
        
        if (userData) {
          console.log('User found:', userData);
          
          // Create session directly (bypass old email/password auth)
          const userProfile = {
            id: userData.id,
            name: userData.name,
            email: userData.email || `${phoneNumber}@temp.rukn.app`,
            phone: userData.phone,
            city: userData.city,
            country: userData.country,
            avatar_url: userData.avatar_url,
            dob: userData.dob,
            gender: userData.gender,
            address: userData.address,
            role: userData.role,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
          };
          
          // Set session directly in supabaseApi
          const session = {
            access_token: 'phone_auth_' + new Date().getTime(),
            user: userProfile
          };
          
          console.log('Creating direct session for phone auth');
          
          // Use direct login function for phone authentication
          try {
            await setUserDirectly(userProfile);
            console.log('Phone-based sign in successful! Navigating to home...');
            router.replace('/(tabs)/home');
          } catch (authError) {
            console.error('Error setting user directly:', authError);
            setError('Login failed. Please try again.');
          }
        } else {
          setError('User account not found. Please sign up first.');
        }
      } else {
        console.log('OTP verification failed:', result);
        setError('Invalid verification code');
        // Clear OTP inputs
        setOtp(['', '', '', '']);
        otpRefs[0].current?.focus();
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const result = await sendOTP(phoneNumber as string);
      
      if (result.success) {
        Alert.alert('Success', 'New verification code sent');
        // Clear current OTP
        setOtp(['', '', '', '']);
        otpRefs[0].current?.focus();
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  // Auto-verify when all 4 digits are entered
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 4 && !loading) {
      handleVerifyOTP();
    }
  }, [otp]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
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
              <Text style={styles.title}>Enter the code</Text>
              <Text style={styles.subtitle}>We have sent you the code</Text>

              {/* Phone Number Display */}
              <Text style={styles.phoneDisplay}>{phoneNumber}</Text>

              {/* OTP Input Boxes */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={otpRefs[index]}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : null,
                      error ? styles.otpInputError : null,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Error Message */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Loading State */}
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#F5A623" />
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              )}

              {/* Resend Code */}
              <TouchableOpacity
                style={styles.resendContainer}
                onPress={handleResendOTP}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <ActivityIndicator size="small" color="#F5A623" />
                ) : (
                  <Text style={styles.resendText}>Didn't receive code? Resend</Text>
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
          </View>
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
    fontSize: 18,
    color: '#F5A623',
    fontWeight: '600',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    backgroundColor: '#F7FAFC',
  },
  otpInputFilled: {
    borderColor: '#F5A623',
    backgroundColor: '#FFF8E1',
  },
  otpInputError: {
    borderColor: '#E53E3E',
    backgroundColor: '#FED7D7',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#718096',
    fontSize: 16,
    marginTop: 8,
  },
  resendContainer: {
    paddingVertical: 16,
    marginBottom: 20,
  },
  resendText: {
    color: '#F5A623',
    fontSize: 16,
    textAlign: 'center',
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

export default VerifyLoginOTPScreen;
