import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=60' }}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Jharkhand Civic Services</Text>
        <Text style={styles.subtitle}>Report • Track • Resolve</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 32, borderRadius: 8, alignItems: 'center' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: 'white', fontSize: 16, marginBottom: 24 },
  button: { backgroundColor: '#2ecc71', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
