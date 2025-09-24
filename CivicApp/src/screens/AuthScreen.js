import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';

export default function AuthScreen({ route, navigation }) {
  const initialTab = route?.params?.tab === 'signup' ? 'signup' : 'login';
  const initialUserType = route?.params?.type || 'citizen';

  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Login form
  const [email, setEmail] = useState(
    initialUserType === 'employee' ? 'employee@test.com' : 'citizen@test.com'
  );
  const [password, setPassword] = useState('password123');

  // Signup form
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Animations
  const indicatorX = useRef(new Animated.Value(initialTab === 'signup' ? 1 : 0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(cardTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [tab]);

  const onSwitch = (next) => {
    setTab(next);
    Animated.timing(indicatorX, {
      toValue: next === 'signup' ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = () => {
    // Dummy credentials for quick testing
    // citizen@test.com / password123
    // employee@test.com / password123
    const ok =
      (email === 'citizen@test.com' && password === 'password123') ||
      (email === 'employee@test.com' && password === 'password123');
    if (ok) {
      navigation.replace('Home');
    } else {
      alert('Invalid credentials. Try:\n• citizen@test.com / password123\n• employee@test.com / password123');
    }
  };

  const handleSignup = () => {
    if (!name || !signupEmail || !phone || !signupPassword) {
      alert('Please fill all fields');
      return;
    }
    navigation.replace('Home');
  };

  const indicatorStyle = {
    transform: [
      {
        translateX: indicatorX.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>Go ahead and complete your account and setup</Text>
        <Text style={styles.headerSub}>Create your account and simplify your workflow instantly.</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
        <TouchableOpacity style={styles.tabBtn} onPress={() => onSwitch('login')}>
          <Text style={[styles.tabText, tab === 'login' && styles.tabActive]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => onSwitch('signup')}>
          <Text style={[styles.tabText, tab === 'signup' && styles.tabActive]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }] }>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {tab === 'login' ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
              />

              <View style={styles.rowBetween}>
                <TouchableOpacity style={styles.row} onPress={() => setRemember(!remember)}>
                  <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
                  <Text style={styles.muted}>Remember Me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                <Text style={styles.primaryBtnText}>Login</Text>
              </TouchableOpacity>

              <View style={{ height: 14 }} />
              <Text style={[styles.muted, { textAlign: 'center' }]}>Or continue with</Text>
              <View style={styles.socialRow}>
                <View style={styles.socialBtn}><Text style={styles.socialText}>Google</Text></View>
                <View style={styles.socialBtn}><Text style={styles.socialText}>Facebook</Text></View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput placeholder="John Doe" value={name} onChangeText={setName} style={styles.input} />

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                value={signupEmail}
                onChangeText={setSignupEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput
                placeholder="9876543210"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Create a password"
                value={signupPassword}
                onChangeText={setSignupPassword}
                style={styles.input}
                secureTextEntry
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
                <Text style={styles.primaryBtnText}>Create Account</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E3A59' },
  headerWrap: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 24 },
  headerSub: { color: 'rgba(255,255,255,0.75)', marginTop: 6 },

  tabs: {
    marginHorizontal: 20,
    backgroundColor: '#123D5F',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', zIndex: 2 },
  tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tabActive: { color: '#0E3A59', },
  tabIndicator: {
    position: 'absolute',
    width: 100,
    top: 6,
    bottom: 6,
    left: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    zIndex: 1,
  },

  card: {
    flex: 1,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  label: { color: '#34495e', fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#F3F6FB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#1f7ae0', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#1f7ae0' },
  muted: { color: '#7f8c8d' },
  link: { color: '#1f7ae0', fontWeight: '600' },

  primaryBtn: { backgroundColor: '#0E7AFE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  socialRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  socialBtn: { flex: 1, backgroundColor: '#F3F6FB', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  socialText: { color: '#34495e', fontWeight: '600' },
});
