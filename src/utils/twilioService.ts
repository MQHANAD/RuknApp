/**
 * Twilio SMS Service for OTP Verification
 * Handles sending and verifying SMS OTP codes for authentication
 */

import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID, IS_TWILIO_CONFIGURED } from '@config/env';
import { Buffer } from 'buffer';

// Base64 encode credentials for Twilio API
const getAuthHeader = (): string => {
  const credentials = `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

/**
 * Send OTP verification code to phone number
 * @param phoneNumber Phone number in E.164 format (e.g., +966598080090)
 * @returns Promise with success status and message
 */
export const sendOTP = async (phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  sid?: string;
}> => {
  try {
    console.log('Sending OTP to:', phoneNumber);
    
    // Validate phone number format
    if (!phoneNumber.startsWith('+966')) {
      throw new Error('Phone number must include +966 country code');
    }

    // Check if Twilio is properly configured
    if (!IS_TWILIO_CONFIGURED) {
      console.error('❌ Twilio not properly configured');
      return {
        success: false,
        message: 'SMS service is not configured. Please contact support.',
      };
    }

    const formData = new FormData();
    formData.append('To', phoneNumber);
    formData.append('Channel', 'sms');

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('Twilio send OTP response:', data);

    if (response.ok) {
      return {
        success: true,
        message: 'OTP sent successfully',
        sid: data.sid,
      };
    } else {
      // Handle specific Twilio errors
      if (data.code === 60200) {
        // Trial account limitation
        return {
          success: false,
          message: 'This phone number needs to be verified in Twilio console first. Please contact support to verify your number.',
        };
      } else if (data.code === 60203) {
        // Rate limit exceeded
        return {
          success: false,
          message: 'Too many SMS attempts. Please wait 15 minutes before trying again.',
        };
      } else if (data.message && data.message.includes('unverified')) {
        return {
          success: false,
          message: 'This phone number needs to be verified. Please contact support.',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to send verification code. Please try again.',
        };
      }
    }
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
};

/**
 * Verify OTP code for phone number
 * @param phoneNumber Phone number in E.164 format
 * @param otpCode 4 or 6 digit OTP code
 * @returns Promise with verification result
 */
export const verifyOTP = async (phoneNumber: string, otpCode: string): Promise<{
  success: boolean;
  message: string;
  status?: string;
}> => {
  try {
    console.log('Verifying OTP for:', phoneNumber, 'Code:', otpCode);

    // Check if Twilio is properly configured
    if (!IS_TWILIO_CONFIGURED) {
      console.error('❌ Twilio not properly configured');
      return {
        success: false,
        message: 'SMS service is not configured. Please contact support.',
      };
    }

    const formData = new FormData();
    formData.append('To', phoneNumber);
    formData.append('Code', otpCode);

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('Twilio verify OTP response:', data);

    if (response.ok && data.status === 'approved') {
      return {
        success: true,
        message: 'OTP verified successfully',
        status: data.status,
      };
    } else {
      // Handle specific verification errors
      if (data.status === 'pending') {
        return {
          success: false,
          message: 'Invalid verification code. Please try again.',
          status: data.status,
        };
      } else if (data.code === 60202) {
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.',
          status: data.status,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Verification failed. Please try again.',
          status: data.status,
        };
      }
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
};

/**
 * Format phone number to E.164 format (+966XXXXXXXXX)
 * @param phone Raw phone number input
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 966, add +
  if (cleaned.startsWith('966')) {
    return `+${cleaned}`;
  }
  
  // If it starts with 0, replace with +966
  if (cleaned.startsWith('0')) {
    return `+966${cleaned.substring(1)}`;
  }
  
  // If it's just the local number, add +966
  if (cleaned.length === 9) {
    return `+966${cleaned}`;
  }
  
  // If it already has +966
  if (phone.startsWith('+966')) {
    return phone;
  }
  
  // Default: add +966
  return `+966${cleaned}`;
};

/**
 * Validate if phone number is in correct Saudi format
 * @param phone Phone number to validate
 * @returns boolean indicating if valid
 */
export const isValidSaudiPhone = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone);
  // Saudi mobile numbers: +966 5X XXX XXXX (9 digits after 966)
  const saudiMobileRegex = /^\+966[5][0-9]{8}$/;
  return saudiMobileRegex.test(formatted);
};
