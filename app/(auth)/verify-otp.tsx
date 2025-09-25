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
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { verifyOTP, sendOTP } from '@utils/twilioService';

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  
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

  // Verify OTP code
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(phoneNumber as string, otpCode);
      
      if (result.success) {
        // Navigate to reset password screen
        router.push({
          pathname: '/reset-password',
          params: { phoneNumber, verifiedOtp: otpCode }
        });
      } else {
        setError('OTP Not Valid');
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
            <Text style={styles.loadingText}>Verifying code...</Text>
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

export default VerifyOTPScreen;
