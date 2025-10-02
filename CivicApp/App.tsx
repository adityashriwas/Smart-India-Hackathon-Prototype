import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeTabs from './src/screens/HomeTabs';
import AuthScreen from './src/screens/AuthScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import NearbyReportsScreen from './src/screens/NearbyReportsScreen';
import TrackingScreen from './src/screens/TrackingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="NearbyReports" component={NearbyReportsScreen} />
        <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
