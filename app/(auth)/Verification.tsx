import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from '../../lib/supabaseClient';

const VerificationScreen: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);

  // Create refs for each TextInput with explicit type annotations
  const inputRefs = [
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
  ];

  const handleChange = async (value: string, index: number): Promise<void> => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically focus the next field if a value is entered.
    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }

    // Once all four digits are entered, verify the code.
    if (newCode.every((digit) => digit !== "")) {
      const verificationCode = newCode.join("");
      await verifyCode(verificationCode);
    }
  };

  const verifyCode = async (verificationCode: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would verify against Supabase Auth
      // For now, we'll simulate successful verification
      console.log("Verifying code:", verificationCode);
      
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, assume any 4-digit code starting with 1-9 is valid
      if (/^[1-9]\d{3}$/.test(verificationCode)) {
        Alert.alert("Success", "Verification successful!");
        router.replace("/(tabs)/profile");
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again.");
        // Reset the code fields
        setCode(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header/Logo */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>Please enter the 4-digit code sent to your phone</Text>

      {/* Four numeric input fields */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            value={digit}
            onChangeText={(val: string) => handleChange(val, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.codeBox}
            editable={!loading}
          />
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeBox: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#F5A623",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    fontSize: 24,
    borderRadius: 15,
  },
  logo: {
    height: 200,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
});
