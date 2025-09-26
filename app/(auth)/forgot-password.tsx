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

const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Debug function to see what's in the database
  const debugDatabase = async () => {
    try {
      console.log('=== DEBUGGING DATABASE ===');
      
      // Get all entrepreneurs
      const entResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?select=*`,
        {
          method: 'GET',
          headers: supabaseApi.getDefaultHeaders(),
        }
      );
      
      if (entResponse.ok) {
        const ents = await entResponse.json();
        console.log('All entrepreneurs:', ents);
        console.log('Entrepreneur phone numbers:', ents.map((e: any) => e.phone || 'NO_PHONE'));
      }
      
      // Get all owners
      const ownResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?select=*`,
        {
          method: 'GET',
          headers: supabaseApi.getDefaultHeaders(),
        }
      );
      
      if (ownResponse.ok) {
        const owners = await ownResponse.json();
        console.log('All owners:', owners);
        console.log('Owner phone numbers:', owners.map((o: any) => o.phone || 'NO_PHONE'));
      }
      
      console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  // Check if phone number exists in database
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    try {
      console.log('Checking if phone exists:', phone);
      
      // Check in entrepreneurs table
      try {
        console.log('Checking entrepreneurs table for phone:', phone);
        const entrepreneurResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?phone=eq.${encodeURIComponent(phone)}&select=*`,
          {
            method: 'GET',
            headers: supabaseApi.getDefaultHeaders(),
          }
        );
        
        console.log('Entrepreneurs response status:', entrepreneurResponse.status);
        
        if (entrepreneurResponse.ok) {
          const entrepreneurs = await entrepreneurResponse.json();
          console.log('Entrepreneurs query result:', entrepreneurs);
          
          // Also check if any entrepreneur has this phone (manual filter as backup)
          const foundByPhone = entrepreneurs.find((ent: any) => ent.phone === phone);
          console.log('Manual phone search result:', foundByPhone);
          
          if (entrepreneurs.length > 0 || foundByPhone) {
            console.log('Phone found in entrepreneurs table');
            return true;
          }
        } else {
          const errorText = await entrepreneurResponse.text();
          console.log('Entrepreneurs table error:', errorText);
        }
      } catch (error) {
        console.log('Error checking entrepreneurs table:', error);
      }

      // Check in owners table
      try {
        console.log('Checking owners table for phone:', phone);
        const ownerResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?phone=eq.${encodeURIComponent(phone)}`,
          {
            method: 'GET',
            headers: supabaseApi.getDefaultHeaders(),
          }
        );
        
        console.log('Owners response status:', ownerResponse.status);
        
        if (ownerResponse.ok) {
          const owners = await ownerResponse.json();
          console.log('Owners found:', owners.length, owners);
          if (owners.length > 0) {
            console.log('Phone found in owners table');
            return true;
          }
        } else {
          const errorText = await ownerResponse.text();
          console.log('Owners table error:', errorText);
        }
      } catch (error) {
        console.log('Error checking owners table:', error);
      }

      console.log('Phone not found in any table');
      return false;
    } catch (error) {
      console.error('Error checking phone exists:', error);
      return false;
    }
  };

  const handleSendVerification = async () => {
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
        setError('Phone Not Found');
        setLoading(false);
        return;
      }

      // Send OTP via Twilio
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/verify-otp',
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

      {/* Title */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter Phone Number</Text>
        <Text style={styles.subtitle}>We will send you a verification code</Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+966</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="598080090"
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

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSendVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send verification code</Text>
          )}
        </TouchableOpacity>

                {/* Debug Button (temporary) */}
                <TouchableOpacity
                  style={styles.debugButton}
                  onPress={debugDatabase}
                >
                  <Text style={styles.debugButtonText}>Debug Database</Text>
                </TouchableOpacity>

                {/* Back to Sign In */}
                <TouchableOpacity
                  style={styles.backLink}
                  onPress={() => router.back()}
                >
                  <Text style={styles.backLinkText}>Back to Sign In</Text>
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
    fontSize: 24,
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
  sendButton: {
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
  sendButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    paddingVertical: 12,
  },
  backLinkText: {
    color: '#F5A623',
    fontSize: 16,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugButtonText: {
    color: '#4A5568',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
