import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, G, Rect } from 'react-native-svg';
import ReportScreen from './ReportScreen';
import MapScreen from './MapScreen';
import StatusScreen from './StatusScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

// CUSTOM SVG HOME ICON COMPONENT
const HomeSvgIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      d="M7.994.303.641 7.656l.709.707.652-.652v8.3h5.006V11.01h2v5.002h4.994V7.725l.785.785h.207v-1h.21L7.993.303zm.002 1.414 5.006 5.008v8.287h-2.994V10.01h-4v5.002H3.002V6.71l4.994-4.994z"
      fill={color}
    />
  </Svg>
);

// CUSTOM SVG MAP ICON COMPONENT
const MapSvgIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30">
    <Path
      d="M 21 2 C 17.134 2 14 5.134 14 9 C 14 13.604 18.551094 15.744813 19.121094 16.257812 C 19.703094 16.781813 20.183906 17.832047 20.378906 18.498047 C 20.472906 18.821047 20.738 18.985187 21 18.992188 C 21.263 18.985187 21.527094 18.821047 21.621094 18.498047 C 21.815094 17.833047 22.295906 16.781813 22.878906 16.257812 C 23.448906 15.744813 28 13.604 28 9 C 28 5.134 24.866 2 21 2 z M 4.0878906 5.015625 C 3.5105137 4.9934902 3 5.4556562 3 6.0664062 L 3 23.244141 C 3 24.137141 3.5912187 24.922969 4.4492188 25.167969 L 10.644531 26.9375 C 10.877531 27.0035 11.122469 27.0035 11.355469 26.9375 L 17.503906 25.181641 C 17.840906 25.085641 18.196109 25.079062 18.537109 25.164062 L 25.695312 26.955078 C 26.357312 27.121078 27 26.618547 27 25.935547 L 27 15.642578 L 25 17.238281 L 25 24.71875 L 19 23.21875 L 19 20.050781 L 17 17.238281 L 17 23.246094 L 12 24.675781 L 12 8.78125 L 12.011719 8.7773438 C 12.029719 8.0383437 12.137219 7.3236719 12.324219 6.6386719 L 11.537109 6.8359375 C 11.197109 6.9209375 10.839953 6.9143594 10.501953 6.8183594 L 4.3398438 5.0566406 C 4.2559688 5.0327656 4.170373 5.0187871 4.0878906 5.015625 z M 21 7 C 22.105 7 23 7.895 23 9 C 23 10.105 22.105 11 21 11 C 19.895 11 19 10.105 19 9 C 19 7.895 19.895 7 21 7 z M 5 7.3261719 L 10 8.7539062 L 10 24.673828 L 5 23.246094 L 5 7.3261719 z"
      fill={color}
    />
  </Svg>
);

// CUSTOM SVG ALERT ICON COMPONENT
const AlertSvgIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G>
      <G>
        <Rect width="24" height="24" opacity="0"/>
        <Path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill={color}/>
        <Circle cx="12" cy="16" r="1" fill={color}/>
        <Path d="M12 7a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z" fill={color}/>
      </G>
    </G>
  </Svg>
);

// CUSTOM SVG USER ICON COMPONENT
const UserSvgIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      d="M8.467 1037.328a3.291 3.291 0 0 0-3.282 3.286 3.29 3.29 0 0 0 3.282 3.285 3.29 3.29 0 0 0 3.282-3.285 3.291 3.291 0 0 0-3.282-3.286zm0 .939c1.3 0 2.344 1.045 2.344 2.347a2.339 2.339 0 0 1-2.344 2.347 2.339 2.339 0 0 1-2.344-2.347 2.339 2.339 0 0 1 2.344-2.347zm-3.013 6.57c-1.441 0-2.62 1.168-2.62 2.605v4.42a.469.47 0 0 0 .468.469h10.332a.469.47 0 0 0 .467-.47V1047.443c0-1.437-1.18-2.604-2.621-2.604H5.454zm0 .94h6.026c.943 0 1.685.738 1.685 1.665V1051.392H3.77v-3.95c0-.927.74-1.665 1.683-1.665z"
      fill={color}
      transform="translate(-1.03 -1106.225)scale(1.06642)"
    />
  </Svg>
);

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
        {iconName === "home-svg" ? (
          <HomeSvgIcon 
            size={focused ? 24 : 22}
            color={focused ? '#667eea' : '#757575'} 
          />
        ) : iconName === "map-svg" ? (
          <MapSvgIcon 
            size={focused ? 24 : 22}
            color={focused ? '#667eea' : '#757575'} 
          />
        ) : iconName === "alert-svg" ? (
          <AlertSvgIcon 
            size={focused ? 24 : 22}
            color={focused ? '#667eea' : '#757575'} 
          />
        ) : iconName === "user-svg" ? (
          <UserSvgIcon 
            size={focused ? 24 : 22}
            color={focused ? '#667eea' : '#757575'} 
          />
        ) : (
          <Icon 
            name={iconName} 
            color={focused ? '#667eea' : '#757575'} 
            size={focused ? 24 : 22} 
          />
        )}
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
              iconName="home-svg"
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
              iconName="map-svg"
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
              iconName="alert-svg"
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
              iconName="user-svg"
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
