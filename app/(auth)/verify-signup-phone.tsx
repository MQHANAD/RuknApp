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

const VerifySignupPhoneScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const router = useRouter();
  const { 
    fullName, 
    phone, 
    dob, 
    gender, 
    city, 
    country, 
    role 
  } = useLocalSearchParams();
  const { signUp, setUserDirectly } = useAuth();
  
  // Refs for OTP inputs
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Send OTP on screen load
  useEffect(() => {
    const sendInitialOTP = async () => {
      try {
        setLoading(true);
        console.log('Sending OTP to new user:', phone);
        
        const result = await sendOTP(phone as string);
        
        if (result.success) {
          setOtpSent(true);
          setTimeout(() => {
            otpRefs[0].current?.focus();
          }, 500);
        } else {
          // Handle Twilio trial limitations
          if (result.message.includes('unverified')) {
            setError('Trial account limitation: Please verify this phone number in Twilio console first, or use a verified number for testing.');
          } else {
            setError(result.message);
          }
        }
      } catch (error: any) {
        setError(error.message || 'Failed to send verification code');
      } finally {
        setLoading(false);
      }
    };

    sendInitialOTP();
  }, [phone]);

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

  // Verify OTP and create account
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Development bypass for testing
      const isTestCode = otpCode === '1234';
      
      let result = { success: false, message: '' };
      
      if (isTestCode) {
        console.log('Using test code bypass for development');
        result = { success: true, message: 'Test code accepted' };
      } else {
        // Verify OTP with Twilio
        result = await verifyOTP(phone as string, otpCode);
      }
      
      if (result.success) {
        console.log('Phone verified! Creating account...');
        
        // Convert display format back to database format for storage
        const dobForDB = dob ? (() => {
          const [day, month, year] = (dob as string).split('/');
          return `${year}-${month}-${day}`;
        })() : '';

        // Generate a temporary email for database compatibility
        const tempEmail = `${(phone as string).replace('+', '')}@temp.rukn.app`;

        // Create the account
        const signUpResult = await signUp(tempEmail, 'temp_password', {
          name: fullName,
          email: tempEmail,
          phone: phone,
          dob: dobForDB,
          gender,
          city,
          country,
          role: role,
          address: (city as string) + ", " + (country as string),
        });

        if (signUpResult.success) {
          console.log("Signup successful after phone verification!");
          
          // Log the user in directly
          const userProfile = {
            id: signUpResult.user?.id || Date.now(),
            name: fullName as string,
            email: tempEmail,
            phone: phone as string,
            city: city as string,
            country: country as string,
            dob: dobForDB,
            gender: gender as string,
            address: (city as string) + ", " + (country as string),
            role: role as any,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          await setUserDirectly(userProfile);
          
          Alert.alert(
            'Success!',
            'Account created and phone verified successfully!',
            [
              { text: 'Continue', onPress: () => router.replace("/(tabs)/home") }
            ]
          );
        } else {
          setError(signUpResult.error || "Failed to create account");
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
      const result = await sendOTP(phone as string);
      
      if (result.success) {
        Alert.alert('Success', 'New verification code sent');
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
    if (otpCode.length === 4 && !loading && otpSent) {
      handleVerifyOTP();
    }
  }, [otp, otpSent]);

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
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.subtitle}>We have sent you a verification code</Text>

          {/* Phone Number Display */}
          <Text style={styles.phoneDisplay}>{phone}</Text>

          {/* Trial Account Warning */}
          {error && error.includes('unverified') && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningTitle}>⚠️ Trial Account Limitation</Text>
              <Text style={styles.warningText}>
                To test with new numbers, verify them in Twilio Console first, or use your verified number: +966598080090
              </Text>
              <Text style={styles.warningText}>
                💡 Development tip: You can use test code "1234" to bypass SMS verification for testing.
              </Text>
            </View>
          )}

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
                editable={otpSent}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && !error.includes('unverified') ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F5A623" />
              <Text style={styles.loadingText}>
                {otpSent ? 'Verifying and creating account...' : 'Sending verification code...'}
              </Text>
            </View>
          )}

          {/* Resend Code */}
          {otpSent && (
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
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
              <Text style={styles.backButtonText}>Back to Sign Up</Text>
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
    marginBottom: 32,
  },
  warningContainer: {
    backgroundColor: '#FEF5E7',
    borderWidth: 1,
    borderColor: '#F6AD55',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C05621',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#C05621',
    textAlign: 'center',
    lineHeight: 20,
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
    textAlign: 'center',
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

export default VerifySignupPhoneScreen;
