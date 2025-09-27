import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const { width, height } = Dimensions.get('window');

export default function ReportScreenAdvanced() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { label: 'Pothole', value: 'pothole', icon: '🕳️', color: '#e74c3c' },
    { label: 'Street Light', value: 'streetlight', icon: '💡', color: '#f39c12' },
    { label: 'Garbage', value: 'garbage', icon: '🗑️', color: '#27ae60' },
    { label: 'Water Issue', value: 'water', icon: '💧', color: '#3498db' },
    { label: 'Drainage', value: 'drainage', icon: '🌊', color: '#9b59b6' },
    { label: 'Road Damage', value: 'road', icon: '🛣️', color: '#34495e' },
    { label: 'Other', value: 'other', icon: '📋', color: '#95a5a6' }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    updateProgress();
  }, []);

  useEffect(() => {
    updateProgress();
  }, [title, description, category, image, location]);

  const updateProgress = () => {
    let progress = 0;
    if (title.length > 3) progress += 0.2;
    if (description.length > 10) progress += 0.2;
    if (category !== '') progress += 0.2;
    if (image) progress += 0.2;
    if (location) progress += 0.2;
    
    setFormProgress(progress);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const pickImage = () => {
    Alert.alert(
      'Select Photo',
      'Choose from where you want to select a photo',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      handleImageResponse
    );
  };

  const openGallery = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      handleImageResponse
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel || response.error) return;
    if (response.assets && response.assets[0]) {
      setImage(response.assets[0]);
    }
  };

  const getLocation = () => {
    Geolocation.requestAuthorization('whenInUse').then((result) => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            });
            setShowMap(true);
          },
          (error) => Alert.alert('Location Error', error.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
  };

  const submit = async () => {
    if (formProgress < 1) {
      Alert.alert('Incomplete Form', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const phone = await AsyncStorage.getItem('userPhone');
      const reportData = {
        title,
        description,
        category,
        latitude: location.lat,
        longitude: location.lng,
        address: '',
        reporterPhone: phone,
        images: image ? [image.uri] : []
      };
      
      await api.post('/reports', reportData);
      Alert.alert('Success', 'Report submitted successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('pothole');
      setImage(null);
      setLocation(null);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySelector = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>📋 Issue Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryCard,
              { borderColor: cat.color },
              category === cat.value && { backgroundColor: cat.color + '20', borderWidth: 2 }
            ]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[styles.categoryText, { color: cat.color }]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <View style={styles.header}>
        <Text style={styles.title}>🏛️ Report Issue</Text>
        <Text style={styles.subtitle}>Help improve your city</Text>
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })}
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(formProgress * 100)}% Complete</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.formContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Title Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>📝 Issue Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Brief description of the issue..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>📋 Detailed Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Provide more details about the issue..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Category Selector */}
          {renderCategorySelector()}

          {/* Photo Section */}
          <View style={styles.photoCard}>
            <Text style={styles.sectionTitle}>📷 Add Photo Evidence</Text>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoIcon}>📸</Text>
                  <Text style={styles.photoText}>Tap to capture photo</Text>
                </View>
              )}
            </TouchableOpacity>
            {image && (
              <TouchableOpacity style={styles.retakeButton} onPress={pickImage}>
                <Text style={styles.retakeText}>🔄 Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Location Section */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>📍 Location Details</Text>
            <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
              <Text style={styles.locationButtonText}>
                {location ? '✅ Location Captured' : '🎯 Get Current Location'}
              </Text>
            </TouchableOpacity>
            
            {location && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  📐 Lat: {location.lat.toFixed(6)}
                </Text>
                <Text style={styles.locationText}>
                  📐 Lng: {location.lng.toFixed(6)}
                </Text>
                <Text style={styles.accuracyText}>
                  🎯 Accuracy: ±{location.accuracy?.toFixed(0)}m
                </Text>
                <TouchableOpacity 
                  style={styles.viewMapButton}
                  onPress={() => setShowMap(true)}
                >
                  <Text style={styles.viewMapText}>🗺️ View on Map</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              formProgress < 1 && styles.submitButtonDisabled,
              isSubmitting && styles.submitButtonSubmitting
            ]}
            onPress={submit}
            disabled={formProgress < 1 || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Report'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Map Modal */}
      <Modal visible={showMap} animationType="slide" transparent>
        <View style={styles.mapModal}>
          <View style={styles.mapContainer}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapTitle}>📍 Report Location</Text>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>🗺️</Text>
              <Text style={styles.mapPlaceholderLabel}>Interactive Map</Text>
              <Text style={styles.mapCoordinates}>
                {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'No location'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.confirmLocationButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.confirmLocationText}>✅ Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22d3ee',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#e0e7ff',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  photoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  photoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  photoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  retakeButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  retakeText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationButton: {
    backgroundColor: '#22d3ee',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  viewMapButton: {
    alignSelf: 'flex-start',
  },
  viewMapText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 0,
  },
  submitButtonSubmitting: {
    backgroundColor: '#f59e0b',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  mapPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    margin: 20,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: 8,
  },
  mapPlaceholderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  mapCoordinates: {
    fontSize: 14,
    color: '#6b7280',
  },
  confirmLocationButton: {
    backgroundColor: '#10b981',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmLocationText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
