// firebaseConfig.js
import Constants from 'expo-constants';
import * as Analytics from 'expo-firebase-analytics';

export const logEvent = async (name, params) => {
  try {
    await Analytics.logEvent(name, params);
  } catch (e) {
    console.log('Firebase Analytics error:', e);
  }
};
