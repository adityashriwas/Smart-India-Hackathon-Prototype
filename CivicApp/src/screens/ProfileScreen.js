import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api';
import BiometricAuth from '../components/BiometricAuth';
import DarkModeToggle from '../components/DarkModeToggle';
import EmergencyContacts from '../components/EmergencyContacts';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const user = JSON.parse(storedData);
        setUserData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          city: user.city || 'Ranchi'
        });
      }
      
      // Load biometric preference
      const biometricPref = await AsyncStorage.getItem('biometricEnabled');
      if (biometricPref) {
        setBiometricEnabled(JSON.parse(biometricPref));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const toggleBiometric = async () => {
    try {
      const availability = await BiometricAuth.isBiometricAvailable();
      
      if (!availability.available) {
        Alert.alert('Not Available', 'Biometric authentication is not available on this device');
        return;
      }

      if (!biometricEnabled) {
        // Enable biometric
        const result = await BiometricAuth.authenticate('Enable biometric login for your account');
        if (result.success) {
          setBiometricEnabled(true);
          await AsyncStorage.setItem('biometricEnabled', JSON.stringify(true));
          Alert.alert('Success', 'Biometric authentication enabled');
        }
      } else {
        // Disable biometric
        setBiometricEnabled(false);
        await AsyncStorage.setItem('biometricEnabled', JSON.stringify(false));
        Alert.alert('Disabled', 'Biometric authentication disabled');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle biometric authentication');
    }
  };

  const handleSave = async () => {
    if (!userData.name.trim() || !userData.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await api.put('/auth/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.log('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userData']);
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userData.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.phone}>{userData.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={userData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            editable={editing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={userData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            editable={editing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
            value={userData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            multiline
            editable={editing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={userData.city}
            onChangeText={(value) => handleInputChange('city', value)}
            editable={editing}
          />
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Dark Mode Toggle */}
        <DarkModeToggle onToggle={setIsDarkMode} />
        
        {/* Biometric Authentication */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="fingerprint" size={24} color="#3498db" />
            <Text style={styles.settingLabel}>Biometric Login</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, biometricEnabled && styles.toggleButtonActive]}
            onPress={toggleBiometric}
          >
            <Text style={[styles.toggleText, biometricEnabled && styles.toggleTextActive]}>
              {biometricEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setShowEmergencyContacts(true)}
        >
          <View style={styles.settingInfo}>
            <Icon name="phone-alert" size={24} color="#e74c3c" />
            <Text style={styles.settingLabel}>Emergency Contacts</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {editing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setEditing(false);
                loadUserData(); // Reset changes
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]} 
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.editButton]} 
            onPress={() => setEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Contacts Modal */}
      <Modal
        visible={showEmergencyContacts}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmergencyContacts(false)}
      >
        <EmergencyContacts onClose={() => setShowEmergencyContacts(false)} />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  phone: { fontSize: 16, color: '#666' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  inputDisabled: { backgroundColor: '#f9f9f9', color: '#666' },
  textArea: { height: 80, textAlignVertical: 'top' },
  buttonContainer: { marginTop: 16 },
  editButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  editButton: { backgroundColor: '#3498db' },
  saveButton: { backgroundColor: '#2ecc71', flex: 1, marginLeft: 8 },
  cancelButton: { backgroundColor: '#95a5a6', flex: 1, marginRight: 8 },
  logoutButton: { backgroundColor: '#e74c3c' },
  buttonDisabled: { backgroundColor: '#bdc3c7' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#333',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    minWidth: 50,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2ecc71',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: 'white',
  },
});
