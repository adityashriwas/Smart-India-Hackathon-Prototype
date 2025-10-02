import React from 'react';
import { Alert } from 'react-native';
import TouchID from 'react-native-touch-id';

class BiometricAuth {
  constructor() {
    this.optionalConfigObject = {
      title: 'Authentication Required',
      imageColor: '#e00606',
      imageErrorColor: '#ff0000',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: 'Cancel',
      fallbackLabel: 'Show Passcode',
      unifiedErrors: false,
      passcodeFallback: false,
    };
  }

  // Check if biometric authentication is available
  isBiometricAvailable = async () => {
    try {
      const biometryType = await TouchID.isSupported();
      return { available: true, type: biometryType };
    } catch (error) {
      return { available: false, error: error.message };
    }
  };

  // Authenticate with biometrics
  authenticate = async (reason = 'Authenticate to access your account') => {
    try {
      const isSupported = await TouchID.isSupported();
      if (!isSupported) {
        throw new Error('Biometric authentication not available');
      }

      await TouchID.authenticate(reason, this.optionalConfigObject);
      return { success: true };
    } catch (error) {
      console.log('Biometric authentication error:', error);
      
      if (error.name === 'UserCancel') {
        return { success: false, cancelled: true };
      } else if (error.name === 'UserFallback') {
        return { success: false, fallback: true };
      } else {
        return { success: false, error: error.message };
      }
    }
  };

  // Show biometric prompt for login
  promptBiometricLogin = async () => {
    const availability = await this.isBiometricAvailable();
    
    if (!availability.available) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      return { success: false };
    }

    return await this.authenticate('Use your fingerprint or face to login');
  };
}

export default new BiometricAuth();
