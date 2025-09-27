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
  Vibration,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import {launchCamera, launchImageLibrary, MediaType} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import NetInfo from '@react-native-community/netinfo';
import api from '../api';
import OfflineMapDisplay from '../components/OfflineMapDisplay';
import AIPhotoAnalyzer from '../services/AIPhotoAnalyzer';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// Professional imports for government-grade interface
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function ReportScreen({ navigation }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [voiceResults, setVoiceResults] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const cameraButtonScale = useRef(new Animated.Value(1)).current;
  const voiceButtonScale = useRef(new Animated.Value(1)).current;

  const categories = [
    { 
      label: 'सड़क में गड्ढा / Pothole', 
      value: 'pothole', 
      icon: 'road-variant', 
      color: '#dc2626',
      priority: 'high',
      department: 'PWD'
    },
    { 
      label: 'स्ट्रीट लाइट / Street Light', 
      value: 'streetlight', 
      icon: 'lightbulb-on', 
      color: '#f59e0b',
      priority: 'medium',
      department: 'Electricity'
    },
    { 
      label: 'कचरा / Garbage', 
      value: 'garbage', 
      icon: 'delete', 
      color: '#10b981',
      priority: 'medium',
      department: 'Sanitation'
    },
    { 
      label: 'जल समस्या / Water Issue', 
      value: 'water', 
      icon: 'water', 
      color: '#3b82f6',
      priority: 'high',
      department: 'Water Supply'
    },
    { 
      label: 'यातायात / Traffic', 
      value: 'traffic', 
      icon: 'traffic-light', 
      color: '#ef4444',
      priority: 'medium',
      department: 'Traffic Police'
    },
    { 
      label: 'शोर / Noise Pollution', 
      value: 'noise', 
      icon: 'volume-high', 
      color: '#8b5cf6',
      priority: 'low',
      department: 'Environment'
    },
    { 
      label: 'अन्य / Others', 
      value: 'others', 
      icon: 'dots-horizontal', 
      color: '#6b7280',
      priority: 'medium',
      department: 'General'
    }
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
    checkNetworkStatus();
    setupVoiceListeners();
    loadAutoSavedData(); // Restore any previously saved data
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, []);

  useEffect(() => {
    updateProgress();
  }, [title, description, category, image, location]);

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (title || description) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer to auto-save after 3 seconds of inactivity
      const timer = setTimeout(() => {
        autoSaveFormData();
      }, 3000);
      
      setAutoSaveTimer(timer);
    }
  }, [title, description, category]);

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
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };
    
    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };
    
    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = async (response) => {
    if (response.didCancel || response.error) return;
    if (response.assets && response.assets[0]) {
      const selectedImage = response.assets[0];
      setImage(selectedImage);
      
      // Start AI photo analysis
      await analyzePhotoWithAI(selectedImage.uri);
    }
  };

  // AI Photo Analysis Function
  const analyzePhotoWithAI = async (imageUri) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setAiSuggestions([]);
    
    try {
      console.log('🤖 Starting AI analysis for captured photo...');
      
      const analysis = await AIPhotoAnalyzer.analyzePhoto(imageUri);
      
      if (analysis) {
        setAiAnalysis(analysis);
        setAiSuggestions(analysis.suggestions || []);
        
        // Auto-suggest category if confidence is high
        if (analysis.suggestedCategory && analysis.confidence > 0.7) {
          setCategory(analysis.suggestedCategory);
          
          // Show success alert with AI suggestion
          Alert.alert(
            '🤖 AI Analysis Complete',
            `Detected: ${analysis.suggestedCategory} (${(analysis.confidence * 100).toFixed(1)}% confident)\n\nCategory has been automatically selected!`,
            [
              { text: 'Change Category', style: 'cancel' },
              { text: 'Keep Suggestion', style: 'default' }
            ]
          );
        } else if (analysis.suggestedCategory) {
          // Show suggestion alert for lower confidence
          Alert.alert(
            '🤖 AI Suggestion',
            `AI suggests: ${analysis.suggestedCategory} (${(analysis.confidence * 100).toFixed(1)}% confident)\n\nWould you like to use this category?`,
            [
              { text: 'No, Keep Current', style: 'cancel' },
              { 
                text: 'Yes, Use Suggestion', 
                style: 'default',
                onPress: () => setCategory(analysis.suggestedCategory)
              }
            ]
          );
        } else {
          // Show completion alert with detected objects
          Alert.alert(
            '🤖 AI Analysis Complete',
            analysis.detectedObjects.length > 0 
              ? `Detected: ${analysis.detectedObjects.map(obj => obj.name).join(', ')}\n\nPlease select the most appropriate category.`
              : 'Analysis complete. Please select the appropriate category for your report.',
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.log('AI Analysis Error:', error);
      setAiSuggestions(['⚠️ AI analysis failed - please select category manually']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Network connectivity check with auto-sync
  const checkNetworkStatus = async () => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected);
    });
    
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      setIsOnline(state.isConnected);
      
      // Auto-sync when coming back online
      if (wasOffline && state.isConnected) {
        setTimeout(() => syncOfflineReports(), 2000); // Wait 2 seconds for stable connection
      }
    });
    
    return unsubscribe;
  };

  // Enhanced Voice functionality with better error handling
  const setupVoiceListeners = () => {
    Voice.onSpeechStart = () => {
      console.log('🎤 Voice recording started');
      setIsRecording(true);
    };
    Voice.onSpeechEnd = () => {
      console.log('🎤 Voice recording ended');
      setIsRecording(false);
    };
    Voice.onSpeechResults = (e) => {
      console.log('🎤 Voice results:', e);
      if (e.value && e.value.length > 0) {
        const spokenText = e.value[0];
        setDescription(prev => prev + (prev ? ' ' : '') + spokenText);
        setVoiceResults(e.value);
      }
    };
    Voice.onSpeechError = (e) => {
      console.log('🎤 Speech Error:', e);
      setIsRecording(false);
      // More user-friendly error handling - just show a simple message
      Alert.alert('Voice Recognition', 'Voice feature temporarily unavailable. You can still type your description.');
    };
  };

  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      setVoiceResults([]);
      // Start pulse animation for voice button while recording
      animatePulse(voiceButtonScale);
      await Voice.start('en-US');
    } catch (error) {
      console.log('Voice start error:', error);
      setIsRecording(false);
      Alert.alert('Voice Error', 'Could not start voice recording');
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.log('Voice stop error:', error);
      setIsRecording(false);
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
        id: Date.now().toString(),
        title,
        description,
        category,
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy,
        address: '',
        reporterPhone: phone,
        images: image ? [image.uri] : [],
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      if (isOnline) {
        // Submit online
        await api.post('/reports', reportData);
        Alert.alert('Success', '✅ Report submitted successfully!');
      } else {
        // Save offline
        await saveReportOffline(reportData);
        Alert.alert('Saved Offline', '📱 Report saved locally. Will sync when connected.');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('pothole');
      setImage(null);
      setLocation(null);
      setVoiceResults([]);

    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Offline storage functionality
  const saveReportOffline = async (reportData) => {
    try {
      const existingReports = await AsyncStorage.getItem('offlineReports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(reportData);
      await AsyncStorage.setItem('offlineReports', JSON.stringify(reports));
      console.log('Report saved offline:', reportData.id);
    } catch (error) {
      console.log('Offline save error:', error);
      throw error;
    }
  };

  // Sync offline reports when online
  const syncOfflineReports = async () => {
    if (!isOnline) return;
    
    try {
      const offlineReports = await AsyncStorage.getItem('offlineReports');
      if (!offlineReports) return;
      
      const reports = JSON.parse(offlineReports);
      if (reports.length === 0) return;
      
      console.log(`Syncing ${reports.length} offline reports...`);
      const syncPromises = reports.map(report => 
        api.post('/reports', report).catch(err => console.log('Sync error:', err))
      );
      
      await Promise.allSettled(syncPromises);
      await AsyncStorage.removeItem('offlineReports');
      
      Alert.alert('Sync Complete', `📡 ${reports.length} offline reports synced successfully!`);
    } catch (error) {
      console.log('Sync error:', error);
    }
  };

  // Auto-save functionality to prevent data loss
  const loadAutoSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('autoSavedReportData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.category) setCategory(data.category);
        console.log('📱 Auto-saved data restored successfully!');
      }
    } catch (error) {
      console.log('Auto-save load error:', error);
    }
  };

  const autoSaveFormData = async () => {
    try {
      const formData = {
        title,
        description,
        category,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('autoSavedReportData', JSON.stringify(formData));
      console.log('📱 Form data auto-saved successfully!');
    } catch (error) {
      console.log('Auto-save error:', error);
    }
  };

  // Enhanced button animation functions
  const animateButtonPress = (animValue, callback) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const animatePulse = (animValue) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const renderCategorySelector = () => (
    <View style={styles.professionalCategoryContainer}>
      <View style={styles.categoryHeader}>
        <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#1e40af" />
        <View style={styles.categoryTitleSection}>
          <Text style={styles.categoryLabelPrimary}>समस्या की श्रेणी</Text>
          <Text style={styles.categoryLabelSecondary}>Issue Category</Text>
        </View>
        <View style={styles.requiredIndicator}>
          <Text style={styles.requiredText}>*</Text>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.professionalCategoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.professionalCategoryCard,
              { borderColor: cat.color },
              category === cat.value && { 
                backgroundColor: cat.color + '15', 
                borderWidth: 2,
                transform: [{ scale: 1.05 }]
              }
            ]}
            onPress={() => {
              Vibration.vibrate(30);
              setCategory(cat.value);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.categoryIconContainer, { backgroundColor: cat.color + '20' }]}>
              <MaterialCommunityIcons name={cat.icon} size={28} color={cat.color} />
            </View>
            <Text style={styles.categoryLabelMain} numberOfLines={2}>
              {cat.label.split(' / ')[0]}
            </Text>
            <Text style={styles.categoryLabelSub} numberOfLines={1}>
              {cat.label.split(' / ')[1]}
            </Text>
            <View style={styles.categoryMetadata}>
              <View style={[styles.priorityBadge, { backgroundColor: cat.color }]}>
                <Text style={styles.priorityText}>{cat.priority.toUpperCase()}</Text>
              </View>
              <Text style={styles.departmentText}>{cat.department}</Text>
            </View>
            {category === cat.value && (
              <View style={styles.selectedIndicator}>
                <MaterialCommunityIcons name="check-circle" size={20} color={cat.color} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Compressed Professional Government Header */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      <View style={styles.compactHeader}>
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6']}
          style={styles.headerGradient}
        >
          <View style={styles.compactHeaderContent}>
            <View style={styles.compactLogoSection}>
              <View style={styles.compactGovLogo}>
                <MaterialCommunityIcons name="shield-account" size={20} color="#fbbf24" />
              </View>
              <View style={styles.compactTitleSection}>
                <Text style={styles.compactMainTitle}>झारखंड सिविक</Text>
                <Text style={styles.compactSubTitle}>Jharkhand Civic</Text>
              </View>
            </View>
            
            <View style={styles.compactHeaderActions}>
              <TouchableOpacity style={styles.compactNotificationButton}>
                <MaterialCommunityIcons name="bell" size={18} color="#ffffff" />
                <View style={styles.compactNotificationBadge}>
                  <Text style={styles.compactNotificationText}>3</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactReportsButton}
                onPress={() => {
                  Vibration.vibrate(30);
                  navigation?.navigate('NearbyReports');
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="view-list" size={16} color="#ffffff" />
                <Text style={styles.compactReportsText}>रिपोर्ट्स</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Compact Progress Bar */}
          <View style={styles.compactProgressSection}>
            <View style={styles.compactProgressContainer}>
              <Animated.View
                style={[
                  styles.compactProgressBar,
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })}
                ]}
              />
            </View>
            <Text style={styles.compactProgressText}>{Math.round(formProgress * 100)}% पूर्ण</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Offline Status Indicator */}
        {!isOnline && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineIcon}>📶</Text>
            <Text style={styles.offlineText}>Offline - Reports will be saved locally</Text>
          </View>
        )}
        
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
          <View style={styles.professionalInputCard}>
            <View style={styles.inputHeader}>
              <MaterialCommunityIcons name="clipboard-text" size={24} color="#1e40af" />
              <View style={styles.inputTitleSection}>
                <Text style={styles.inputLabelPrimary}>समस्या का शीर्षक</Text>
                <Text style={styles.inputLabelSecondary}>Issue Title</Text>
              </View>
              <View style={styles.requiredIndicator}>
                <Text style={styles.requiredText}>*</Text>
              </View>
            </View>
            <TextInput
              style={styles.professionalTextInput}
              placeholder="समस्या का संक्षिप्त विवरण... / Brief description of the issue..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#6b7280"
              multiline={false}
              maxLength={100}
            />
            <View style={styles.inputFooter}>
              <Text style={styles.characterCount}>{title.length}/100</Text>
              <View style={styles.inputValidation}>
                {title.length >= 10 ? (
                  <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                ) : (
                  <MaterialCommunityIcons name="alert-circle" size={16} color="#f59e0b" />
                )}
              </View>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.professionalInputCard}>
            <View style={styles.inputHeader}>
              <MaterialCommunityIcons name="text-box" size={24} color="#1e40af" />
              <View style={styles.inputTitleSection}>
                <Text style={styles.inputLabelPrimary}>विस्तृत विवरण</Text>
                <Text style={styles.inputLabelSecondary}>Detailed Description</Text>
              </View>
              <View style={styles.requiredIndicator}>
                <Text style={styles.requiredText}>*</Text>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={[styles.professionalTextInput, styles.professionalTextArea]}
                placeholder="समस्या के बारे में विस्तार से बताएं... / Provide detailed information about the issue..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9ca3af"
              />
              
              {/* Voice Recording Button */}
              <Animated.View style={{ transform: [{ scale: voiceButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    isRecording && styles.voiceButtonActive
                  ]}
                  onPress={() => animateButtonPress(voiceButtonScale, isRecording ? stopVoiceRecording : startVoiceRecording)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.voiceButtonText,
                    isRecording && styles.voiceButtonTextActive
                  ]}>
                    {isRecording ? '🔴' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            {/* Voice Recording Status */}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>🔊 Listening... Speak now!</Text>
              </View>
            )}
            
            {/* Voice Results Preview */}
            {voiceResults.length > 0 && !isRecording && (
              <View style={styles.voiceResultsContainer}>
                <Text style={styles.voiceResultsTitle}>💭 Voice recognized:</Text>
                <Text style={styles.voiceResultsText}>"{voiceResults[0]}"</Text>
              </View>
            )}
          </View>

          {/* Category Selector */}
          {renderCategorySelector()}

          {/* Professional Photo Evidence Section */}
          <View style={styles.professionalPhotoCard}>
            <View style={styles.photoHeader}>
              <MaterialCommunityIcons name="camera" size={24} color="#1e40af" />
              <View style={styles.photoTitleSection}>
                <Text style={styles.photoLabelPrimary}>फोटो साक्ष्य जोड़ें</Text>
                <Text style={styles.photoLabelSecondary}>Add Photo Evidence</Text>
              </View>
              <View style={styles.optionalIndicator}>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
            </View>
            
            {/* Government Guidelines */}
            <View style={styles.photoGuidelines}>
              <MaterialCommunityIcons name="information" size={16} color="#3b82f6" />
              <Text style={styles.guidelinesText}>
                स्पष्ट फोटो लें जो समस्या को दिखाता हो / Take clear photos showing the issue
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: cameraButtonScale }] }}>
              <TouchableOpacity 
                style={styles.professionalPhotoButton} 
                onPress={() => {
                  Vibration.vibrate(40);
                  animateButtonPress(cameraButtonScale, pickImage);
                }}
                activeOpacity={0.8}
              >
                {image ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: image.uri }} style={styles.professionalPhotoPreview} />
                    <View style={styles.photoOverlay}>
                      <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
                      <Text style={styles.photoSuccessText}>फोटो जोड़ा गया / Photo Added</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.professionalPhotoPlaceholder}>
                    <View style={styles.cameraIconContainer}>
                      <MaterialCommunityIcons name="camera-plus" size={48} color="#6b7280" />
                    </View>
                    <Text style={styles.photoPlaceholderTitle}>फोटो कैप्चर करें</Text>
                    <Text style={styles.photoPlaceholderSubtitle}>Tap to capture photo</Text>
                    <View style={styles.photoActions}>
                      <View style={styles.photoActionItem}>
                        <MaterialCommunityIcons name="camera" size={16} color="#3b82f6" />
                        <Text style={styles.photoActionText}>Camera</Text>
                      </View>
                      <View style={styles.photoActionDivider} />
                      <View style={styles.photoActionItem}>
                        <MaterialCommunityIcons name="image" size={16} color="#3b82f6" />
                        <Text style={styles.photoActionText}>Gallery</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            {image && (
              <View style={styles.photoActionButtons}>
                <TouchableOpacity 
                  style={styles.retakeButton} 
                  onPress={() => {
                    Vibration.vibrate(30);
                    pickImage();
                  }}
                >
                  <MaterialCommunityIcons name="camera-retake" size={18} color="#f59e0b" />
                  <Text style={styles.retakeText}>बदलें / Change</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* AI Analysis Section */}
            {image && (
              <View style={styles.aiAnalysisSection}>
                {isAnalyzing ? (
                  <View style={styles.aiAnalyzingContainer}>
                    <View style={styles.aiLoadingHeader}>
                      <Text style={styles.aiLoadingIcon}>🤖</Text>
                      <Text style={styles.aiLoadingText}>AI Analyzing Photo...</Text>
                    </View>
                    <View style={styles.aiProgressBar}>
                      <Animated.View style={styles.aiProgressFill} />
                    </View>
                    <Text style={styles.aiLoadingSubtext}>
                      Detecting objects and suggesting category
                    </Text>
                  </View>
                ) : aiAnalysis && (
                  <View style={styles.aiResultsContainer}>
                    <View style={styles.aiResultsHeader}>
                      <Text style={styles.aiResultsIcon}>🎯</Text>
                      <Text style={styles.aiResultsTitle}>AI Analysis Complete</Text>
                    </View>
                    
                    {aiAnalysis.suggestedCategory && (
                      <View style={styles.aiSuggestionCard}>
                        <Text style={styles.aiSuggestionLabel}>Suggested Category:</Text>
                        <Text style={styles.aiSuggestionCategory}>
                          {categories.find(c => c.value === aiAnalysis.suggestedCategory)?.icon || '📋'} 
                          {' '}{categories.find(c => c.value === aiAnalysis.suggestedCategory)?.label || aiAnalysis.suggestedCategory}
                        </Text>
                        <Text style={styles.aiConfidence}>
                          Confidence: {(aiAnalysis.confidence * 100).toFixed(1)}%
                        </Text>
                        <TouchableOpacity 
                          style={styles.useSuggestionButton}
                          onPress={() => setCategory(aiAnalysis.suggestedCategory)}
                        >
                          <Text style={styles.useSuggestionText}>✅ Use This Category</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {aiSuggestions.length > 0 && (
                      <View style={styles.aiSuggestionsContainer}>
                        <Text style={styles.aiSuggestionsTitle}>💡 Smart Suggestions:</Text>
                        {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                          <View key={index} style={styles.aiSuggestionItem}>
                            <Text style={styles.aiSuggestionBullet}>•</Text>
                            <Text style={styles.aiSuggestionText}>{suggestion}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {aiAnalysis.detectedObjects.length > 0 && (
                      <View style={styles.aiObjectsContainer}>
                        <Text style={styles.aiObjectsTitle}>🔍 Detected Objects:</Text>
                        <View style={styles.aiObjectsList}>
                          {aiAnalysis.detectedObjects.slice(0, 4).map((object, index) => (
                            <View key={index} style={styles.aiObjectTag}>
                              <Text style={styles.aiObjectName}>{object.name}</Text>
                              <Text style={styles.aiObjectConfidence}>
                                {(object.confidence * 100).toFixed(0)}%
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Location Section */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>📍 Location Details</Text>
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={() => animateButtonPress(buttonScaleAnim, getLocation)}
                activeOpacity={0.8}
              >
                <Text style={styles.locationButtonText}>
                  {location ? '✅ Location Captured' : '🎯 Get Current Location'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

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
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.viewMapButton}
                    onPress={() => {
                      animateButtonPress(buttonScaleAnim, () => {
                        console.log('🗺️ Opening map modal...');
                        setShowMap(true);
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      style={styles.viewMapButtonGradient}
                    >
                      <Text style={styles.viewMapIcon}>🗺️</Text>
                      <Text style={styles.viewMapText}>View on Map</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* Additional Map Controls */}
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.selectLocationButton}
                    onPress={() => {
                      animateButtonPress(buttonScaleAnim, () => {
                        console.log('📍 Opening location selector...');
                        setShowMap(true);
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.selectLocationButtonGradient}
                    >
                      <Text style={styles.selectLocationIcon}>📍</Text>
                      <Text style={styles.selectLocationText}>Select Different Location</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                formProgress < 1 && styles.submitButtonDisabled,
                isSubmitting && styles.submitButtonSubmitting
              ]}
              onPress={() => animateButtonPress(buttonScaleAnim, submit)}
              disabled={formProgress < 1 || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Report'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Enhanced Map Modal with Real MapView */}
      <Modal visible={showMap} animationType="slide" transparent={false}>
        <View style={styles.mapModal}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>📍 Select Report Location</Text>
            <Text style={styles.mapSubtitle}>Tap on map to select location</Text>
            <TouchableOpacity 
              onPress={() => setShowMap(false)}
              style={styles.closeButtonContainer}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
            initialRegion={{
              latitude: location?.latitude || 23.6345,
              longitude: location?.longitude || 85.3803,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(event) => {
              const coordinate = event.nativeEvent.coordinate;
              setLocation({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                accuracy: 10,
              });
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Report Location"
                description="Selected location for your complaint"
                pinColor="red"
              />
            )}
          </MapView>
            
            {/* Location Info Panel */}
            {location && (
              <View style={styles.locationInfoPanel}>
                <Text style={styles.locationInfoTitle}>📍 Current Location</Text>
                <Text style={styles.locationCoordinates}>
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </Text>
                {location.accuracy && (
                  <Text style={styles.locationAccuracy}>
                    🎯 Accuracy: ±{location.accuracy.toFixed(0)}m
                  </Text>
                )}
                <Text style={styles.locationHint}>💡 Drag the marker to adjust location</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmLocationButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.confirmLocationText}>✅ Confirm Location</Text>
            </TouchableOpacity>
          </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Compact Professional Header Styles
  compactHeader: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 44 : 25,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  compactHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  compactLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactGovLogo: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  compactTitleSection: {
    flex: 1,
  },
  compactMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 1,
  },
  compactSubTitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  compactHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactNotificationButton: {
    position: 'relative',
    padding: 6,
    marginRight: 8,
  },
  compactNotificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactNotificationText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  compactReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  compactReportsText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  compactProgressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactProgressContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },
  compactProgressBar: {
    height: 3,
    backgroundColor: '#fbbf24',
    borderRadius: 2,
  },
  compactProgressText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  professionalHeader: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  govLogo: {
    width: 45,
    height: 45,
    backgroundColor: '#1e40af',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  govIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 10,
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
    alignSelf: 'stretch',
    borderRadius: 12,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewMapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  viewMapIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  viewMapText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  selectLocationButton: {
    alignSelf: 'stretch',
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectLocationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectLocationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  selectLocationText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
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
  mapView: {
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
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
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  locationInfoPanel: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    marginHorizontal: 20,
  },
  locationInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  locationCoordinates: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 6,
  },
  locationHint: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
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
  
  // Offline Status Styles
  offlineIndicator: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  offlineText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  
  // Voice Input Styles
  descriptionContainer: {
    position: 'relative',
  },
  voiceButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  voiceButtonText: {
    fontSize: 18,
  },
  voiceButtonTextActive: {
    fontSize: 16,
  },
  recordingIndicator: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  recordingText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  voiceResultsContainer: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  voiceResultsTitle: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  voiceResultsText: {
    color: '#0c4a6e',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Smart Location Display Styles
  smartLocationDisplay: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  locationHeaderIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  accuracyBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#059669',
  },
  coordinateDisplay: {
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    width: 80,
  },
  coordinateValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  adjustButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coordinateValue: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#111827',
    marginHorizontal: 12,
    minWidth: 100,
    textAlign: 'center',
  },
  locationActions: {
    marginBottom: 16,
  },
  refreshLocationButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  refreshLocationText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  visualMapContainer: {
    alignItems: 'center',
  },
  visualMap: {
    width: 120,
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#d1d5db',
    opacity: 0.3,
  },
  locationMarker: {
    position: 'absolute',
    zIndex: 10,
  },
  markerIcon: {
    fontSize: 24,
  },
  visualMapLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },

  // AI Analysis Component Styles
  aiAnalysisSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiAnalyzingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aiLoadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiLoadingIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  aiLoadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  aiProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  aiProgressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
  aiResultsContainer: {
    width: '100%',
  },
  aiResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiResultsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  aiResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  aiSuggestionCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  aiSuggestionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  useSuggestionButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  useSuggestionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Reports Navigation Button Styles
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  reportsButton: {
    marginLeft: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reportsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reportsButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  reportsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Professional Header Styles
  govLogoGradient: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Professional Input Styles
  professionalInputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  inputLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  inputLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  requiredIndicator: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionalIndicator: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionalText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '500',
  },
  professionalTextInput: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  professionalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  inputValidation: {
    marginLeft: 8,
  },

  // Professional Category Styles
  professionalCategoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  categoryLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  categoryLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  professionalCategoryScroll: {
    marginHorizontal: -8,
  },
  categoryScrollContent: {
    paddingHorizontal: 8,
  },
  professionalCategoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 6,
    padding: 16,
    alignItems: 'center',
    width: 140,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabelMain: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  categoryLabelSub: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  categoryMetadata: {
    alignItems: 'center',
    marginTop: 8,
  },
  priorityBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  departmentText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Professional Photo Styles
  professionalPhotoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  photoLabelPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  photoLabelSecondary: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  photoGuidelines: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  guidelinesText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
  },
  professionalPhotoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  professionalPhotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  photoSuccessText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  professionalPhotoPlaceholder: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  cameraIconContainer: {
    marginBottom: 16,
  },
  photoPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  photoPlaceholderSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  photoActionText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '500',
  },
  photoActionDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  photoActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // Professional Bottom Taskbar Styles
  professionalBottomTaskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  taskbarGradient: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  taskbarContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  taskbarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  taskbarItemActive: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  taskbarIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskbarIconActive: {
    backgroundColor: '#3b82f6',
  },
  taskbarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 1,
  },
  taskbarLabelActive: {
    color: '#1e40af',
  },
  taskbarLabelEn: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  taskbarLabelEnActive: {
    color: '#3b82f6',
  },
  governmentFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  governmentFooterText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
    fontStyle: 'italic',
  },
});
