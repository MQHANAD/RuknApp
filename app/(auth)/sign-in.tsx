import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuth } from '@/src/context/AuthContext';
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';
import { Button, TextInput, Card } from '../../components/design-system';
import { spacing, typography, colors } from '../../constants/design-tokens';
import { sendOTP, formatPhoneNumber, isValidSaudiPhone } from '@utils/twilioService';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@config/env';

const SignInScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();

  // Check if phone number exists in database
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    try {
      // Check in entrepreneurs table
      const entrepreneurResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/entrepreneurs?phone=eq.${encodeURIComponent(phone)}&select=*`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log('Entrepreneur lookup - Status:', entrepreneurResponse.status);
      
      if (entrepreneurResponse.ok) {
        const entrepreneurs = await entrepreneurResponse.json();
        console.log('Entrepreneurs found:', entrepreneurs);
        if (entrepreneurs.length > 0) return true;
      }

      // Check in owners table
      const ownerResponse = await fetch(
        `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/owners?phone=eq.${encodeURIComponent(phone)}&select=*`,
        {
          method: 'GET',
          headers: {
            'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (ownerResponse.ok) {
        const owners = await ownerResponse.json();
        if (owners.length > 0) return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking phone exists:', error);
      return false;
    }
  };

  const validateInputs = () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!isValidSaudiPhone(formattedPhone)) {
      Alert.alert("Error", "Please enter a valid Saudi phone number");
      return false;
    }
    
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);

      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Check if phone exists in database
      const phoneExists = await checkPhoneExists(formattedPhone);
      
      // Temporary: Allow your specific phone number even if lookup fails
      const isTestPhone = formattedPhone === '+966598080090';
      
      if (!phoneExists && !isTestPhone) {
        setError('Phone number not registered. Please sign up first.');
        Alert.alert("Error", "Phone number not registered. Please sign up first.");
        setLoading(false);
        return;
      }
      
      console.log('Phone lookup result:', phoneExists, 'Test phone:', isTestPhone);

      // Send OTP for sign-in
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        // Navigate to OTP verification for login
        router.push({
          pathname: '/verify-login-otp',
          params: { phoneNumber: formattedPhone }
        });
      } else {
        setError(result.message);
        Alert.alert("Error", result.message);
      }
    } catch (e: any) {
      console.error("Sign in error:", e);
      setError(e.message || "An unexpected error occurred");
      Alert.alert("Error", e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create themed styles
  const styles = useThemedStyles((theme, isDark) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.background.primary,
      },
      container: {
        flex: 1,
        paddingHorizontal: spacing[4],
        alignItems: 'center',
      },
      logoContainer: {
        alignItems: "center",
        marginTop: spacing[5],
      },
      logo: {
        height: 200,
        marginBottom: spacing[2],
      },
      title: {
        ...typography.heading.h1,
        color: theme.text.primary,
        marginBottom: spacing[8],
        textAlign: 'center',
      },
      inputContainer: {
        width: '100%',
        marginBottom: spacing[4],
      },
      passwordContainer: {
        marginTop: spacing[2],
      },
      errorText: {
        ...typography.body.small,
        color: colors.error[500],
        marginBottom: spacing[4],
        textAlign: 'center',
      },
      signUpLink: {
        marginTop: spacing[5],
      },
      signUpText: {
        ...typography.body.medium,
        color: theme.interactive.primary,
        textAlign: 'center',
      },
      forgotPasswordLink: {
        marginTop: spacing[4],
      },
      forgotPasswordText: {
        ...typography.body.small,
        color: theme.text.tertiary,
        textAlign: 'center',
      },
      themeToggleContainer: {
        position: 'absolute',
        top: spacing[4],
        right: spacing[4],
        zIndex: 10,
      },
      demoCard: {
        marginTop: spacing[4],
        padding: spacing[3],
        backgroundColor: theme.surface.secondary,
      },
      demoText: {
        ...typography.caption.small,
        color: theme.text.tertiary,
        textAlign: 'center',
      },
      phoneLabel: {
        ...typography.body.medium,
        color: theme.text.primary,
        marginBottom: spacing[2],
        fontWeight: '600',
      },
      phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F5A623',
        backgroundColor: theme.surface.primary,
        borderRadius: 15,
        height: 60,
        paddingHorizontal: 16,
      },
      countryCode: {
        ...typography.body.medium,
        color: theme.text.primary,
        fontWeight: '600',
        marginRight: spacing[2],
      },
      phoneInput: {
        flex: 1,
        fontSize: 16,
        color: theme.text.primary,
        height: 60,
        paddingVertical: 12,
        paddingHorizontal: 8,
      },
    })
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Theme Toggle Button - Design System Demo */}
        <View style={styles.themeToggleContainer}>
          <Button
            variant="ghost"
            size="small"
            onPress={toggleTheme}
          >
            {themeMode === 'dark' ? '☀️' : '🌙'}
          </Button>
        </View>

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>

        {/* Input Fields - Using Design System Components */}
        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={{ width: '100%' }}>
            <Text style={styles.phoneLabel}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+966</Text>
              <RNTextInput
                placeholder="598080090"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.phoneInput}
                maxLength={9}
                autoFocus={false}
              />
            </View>
          </View>
        </View>

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Sign In Button - Using Design System Component */}
        <Button
          variant="primary"
          size="large"
          onPress={handleSignIn}
          loading={loading}
          style={{ width: '100%', marginBottom: spacing[4] }}
        >
          Send Login Code
        </Button>

        {/* Sign Up Link */}
        <Button
          variant="ghost"
          size="medium"
          onPress={() => router.replace("/sign-up")}
          style={styles.signUpLink}
        >
          Don't have an account? Sign Up
        </Button>


        {/* Design System Demo Card */}
        <Card style={styles.demoCard}>
          <Text style={styles.demoText}>
            🎨 This screen now uses the Rukn Design System!{'\n'}
            Try switching themes with the button above.{'\n'}
            All components are responsive and accessible.
          </Text>
        </Card>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignInScreen;

// Styles are now defined using useThemedStyles hook above
