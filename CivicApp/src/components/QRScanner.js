import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QRScanner({ onScan, onClose }) {
  const [flashOn, setFlashOn] = useState(false);

  const onSuccess = (e) => {
    try {
      // Parse QR code data - expected format: civic://report?location=lat,lng&category=type
      const data = e.data;
      if (data.startsWith('civic://report')) {
        const url = new URL(data);
        const location = url.searchParams.get('location');
        const category = url.searchParams.get('category');
        
        if (location) {
          const [lat, lng] = location.split(',').map(Number);
          onScan({
            location: { lat, lng },
            category: category || 'other',
            source: 'qr'
          });
        } else {
          Alert.alert('Invalid QR Code', 'This QR code does not contain valid location data');
        }
      } else {
        Alert.alert('Invalid QR Code', 'This is not a civic reporting QR code');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not parse QR code data');
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={flashOn ? 'torch' : 'off'}
        topContent={
          <Text style={styles.centerText}>
            Scan QR code for quick reporting
          </Text>
        }
        bottomContent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleFlash}>
              <Icon name={flashOn ? 'flashlight-off' : 'flashlight'} size={24} color="white" />
              <Text style={styles.buttonText}>Flash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Icon name="close" size={24} color="white" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});
