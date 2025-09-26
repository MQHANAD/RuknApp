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
} from "react-native";
import { useAuth } from '@/src/context/AuthContext';
import { useTheme, useThemedStyles } from '../../src/context/ThemeContext';
import { Button, TextInput, Card } from '../../components/design-system';
import { spacing, typography, colors } from '../../constants/design-tokens';
import { useAnalytics } from '../../src/hooks/useAnalytics';

const SignInScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();
  const { trackClick, trackEvent } = useAnalytics();

  const validateInputs = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);

      // Track sign in attempt
      trackEvent('sign_in_attempted', {
        email_domain: email.split('@')[1] || 'unknown',
        has_password: !!password
      });

      const result = await signIn(email, password);

      if (result.success) {
        console.log("Sign in successful!");

        // Track successful sign in
        trackEvent('sign_in_success', {
          email_domain: email.split('@')[1] || 'unknown',
          is_legacy_user: result.isLegacyUser || false
        });

        // Check if this is a legacy user (without password verification)
        if (result.isLegacyUser) {
          // Show a security notification
          Alert.alert(
            "Security Notice",
            "For your security, we recommend you update your password in the next version of the app.",
            [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
          );
        } else {
          // Standard successful login
          router.replace("/(tabs)/home"); // Redirect to home screen
        }
      } else {
        // Handle error
        setError(result.error || "Invalid email or password. Please try again.");
        Alert.alert("Error", result.error || "Invalid email or password");
        
        // Track sign in failure
        trackEvent('sign_in_failed', {
          email_domain: email.split('@')[1] || 'unknown',
          error: result.error || 'unknown'
        });
      }
    } catch (e: any) {
      console.error("Sign in error:", e);
      setError(e.message || "An unexpected error occurred");
      Alert.alert("Error", e.message || "An unexpected error occurred");
      
      // Track sign in error
      trackEvent('sign_in_error', {
        email_domain: email.split('@')[1] || 'unknown',
        error: e.message || String(e)
      });
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
    })
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <View style={styles.inputContainer}>
          <TextInput
            label="Email Address"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            containerStyle={{ marginBottom: spacing[3] }}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.passwordContainer}
          />
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
          Sign In
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

        {/* Forgot Password */}
        <Button
          variant="ghost"
          size="small"
          onPress={() => Alert.alert('Info', 'Forgot password functionality coming soon!')}
          style={styles.forgotPasswordLink}
        >
          Forgot Password?
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
    </SafeAreaView>
  );
};

export default SignInScreen;

// Styles are now defined using useThemedStyles hook above
