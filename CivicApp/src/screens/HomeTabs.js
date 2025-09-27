import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ReportScreen from './ReportScreen';
import MapScreen from './MapScreen';
import StatusScreen from './StatusScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

// EXCEPTIONAL PROFESSIONAL SIH-WINNING TAB ICON COMPONENT
const ExceptionalProfessionalTabIcon = ({ focused, iconName, label, labelEn, color }) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [pulseAnim] = React.useState(new Animated.Value(1));
  
  React.useEffect(() => {
    if (focused) {
      // Scale animation for tap feedback
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation for active tab
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [focused, scaleAnim, pulseAnim]);

  return (
    <Animated.View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      transform: [{ scale: scaleAnim }],
      paddingVertical: 8,
    }}>
      {/* EXCEPTIONAL GRADIENT BACKGROUND FOR ACTIVE TAB */}
      {focused && (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={{
            position: 'absolute',
            width: 60,
            height: 45,
            borderRadius: 22,
            opacity: 0.15,
          }}
        />
      )}
      
      {/* PROFESSIONAL ICON CONTAINER WITH PULSE ANIMATION */}
      <Animated.View style={{
        width: 52,
        height: 36,
        borderRadius: 18,
        backgroundColor: focused ? '#ffffff' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        elevation: focused ? 8 : 0,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: focused ? 0.3 : 0,
        shadowRadius: 8,
        borderWidth: focused ? 2 : 0,
        borderColor: focused ? '#667eea' : 'transparent',
        transform: [{ scale: pulseAnim }]
      }}>
        <Icon 
          name={iconName} 
          color={focused ? '#667eea' : '#757575'} 
          size={focused ? 24 : 22} 
        />
      </Animated.View>
      
      {/* PROFESSIONAL BILINGUAL LABELS */}
      <Text style={{ 
        color: focused ? '#667eea' : '#757575', 
        fontSize: 11, 
        fontWeight: focused ? 'bold' : '600',
        textAlign: 'center',
        marginBottom: 1,
      }}>
        {label}
      </Text>
      <Text style={{ 
        color: focused ? '#667eea' : '#9e9e9e', 
        fontSize: 9, 
        fontWeight: focused ? '500' : '400',
        textAlign: 'center',
        opacity: focused ? 0.8 : 0.6,
      }}>
        {labelEn}
      </Text>
    </Animated.View>
  );
};

export default function HomeTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 25,
          shadowColor: '#667eea',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          height: Platform.OS === 'ios' ? 95 : 85,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 12,
          paddingHorizontal: 12,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarShowLabel: false, // We'll handle labels in our custom component
      }}
    >
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <ExceptionalProfessionalTabIcon 
              focused={focused}
              iconName="home-variant"
              label="होम"
              labelEn="Home"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <ExceptionalProfessionalTabIcon
              focused={focused}
              iconName="map-marker-radius"
              label="नक्शा"
              labelEn="Map"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <ExceptionalProfessionalTabIcon 
              focused={focused}
              iconName="clipboard-list"
              label="स्थिति"
              labelEn="Status"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <ExceptionalProfessionalTabIcon 
              focused={focused}
              iconName="account"
              label="प्रोफ़ाइल"
              labelEn="Profile"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
