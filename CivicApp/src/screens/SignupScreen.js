import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Ranchi'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter valid phone number');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter valid email address');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Home') }
      ]);
    } catch (error) {
      console.log('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Jharkhand Civic Services</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
      />

      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
      />

      <TextInput
        placeholder="Address"
        multiline
        style={[styles.input, styles.textArea]}
        value={formData.address}
        onChangeText={(value) => handleInputChange('address', value)}
      />

      <TextInput
        placeholder="City"
        style={styles.input}
        value={formData.city}
        onChangeText={(value) => handleInputChange('city', value)}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: { 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    fontSize: 16
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { 
    backgroundColor: '#2ecc71', 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonDisabled: { backgroundColor: '#95a5a6' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  linkButton: { alignItems: 'center' },
  linkText: { color: '#3498db', fontSize: 14 }
});
