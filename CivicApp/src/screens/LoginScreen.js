import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  SafeAreaView,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // floating background shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(float1, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(float2, { toValue: 0, duration: 3500, useNativeDriver: true }),
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    // Add haptic feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!selectedUserType) {
      Alert.alert('Selection Required', 'Please select Citizen or Employee');
      return;
    }

    setLoading(true);
    try {
      // Navigate to combined Auth screen with the chosen tab and user type
      navigation.navigate('Auth', { tab: 'login', type: selectedUserType });
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <ImageBackground
        source={require('../../assets/icon.png')}
        resizeMode="cover"
        imageStyle={styles.bgImage}
        style={styles.gradient}
      >
        {/* animated decorative shapes */}
        <Animated.View
          style={[
            styles.floating,
            styles.float1,
            {
              transform: [
                { translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) },
                { scale: pulse },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floating,
            styles.float2,
            {
              transform: [
                { translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
              ],
            },
          ]}
        />
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>JH</Text>
              </View>
            </View>
            <Text style={styles.title}>Jharkhand Municipal Corporation</Text>
            <Text style={styles.subtitle}>Civic Services Portal</Text>
          </Animated.View>

          {/* Login Card */}
          <Animated.View 
            style={[
              styles.loginCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.cardTitle}>Log in as</Text>
            
            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeCard,
                  selectedUserType === 'citizen' && styles.selectedCard
                ]}
                onPress={() => handleUserTypeSelect('citizen')}
              >
                <View style={[styles.iconContainer, styles.citizenIcon]}>
                  <Text style={styles.iconText}>👥</Text>
                </View>
                <Text style={styles.userTypeText}>Citizen</Text>
                {selectedUserType === 'citizen' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeCard,
                  selectedUserType === 'employee' && styles.selectedCard
                ]}
                onPress={() => handleUserTypeSelect('employee')}
              >
                <View style={[styles.iconContainer, styles.employeeIcon]}>
                  <Text style={styles.iconText}>👔</Text>
                </View>
                <Text style={styles.userTypeText}>Employee</Text>
                {selectedUserType === 'employee' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                !selectedUserType && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading || !selectedUserType}
            >
              <View
                style={[
                  styles.loginButtonGradient,
                  selectedUserType ? styles.loginButtonActive : styles.loginButtonInactive
                ]}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Please wait...' : 'Login'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Signup Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Auth', { tab: 'signup', type: selectedUserType || 'citizen' })}
              style={{ marginTop: 16 }}
            >
              <Text style={styles.linkUnderCard}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  bgImage: { 
    opacity: 0.08 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  floating: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  float1: { 
    top: 60, 
    left: -30 
  },
  float2: { 
    bottom: 80, 
    right: -40 
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  userTypeCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  citizenIcon: {
    backgroundColor: '#E8F5E8',
  },
  employeeIcon: {
    backgroundColor: '#FFF4E6',
  },
  iconText: {
    fontSize: 24,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#4A90E2',
  },
  loginButtonInactive: {
    backgroundColor: '#CCCCCC',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkUnderCard: {
    textAlign: 'center',
    color: '#1f7ae0',
    fontWeight: '600',
  },
});
