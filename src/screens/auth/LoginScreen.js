import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { Button, Input } from '../../components';
import { useAuth } from '../../context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a472a', '#121212']}
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="musical-notes" size={56} color={COLORS.primary} />
              </View>
              <Text style={styles.appName}>Shalook Music</Text>
              <Text style={styles.tagline}>Download. Listen. Enjoy.</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to continue listening</Text>

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                icon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
                icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title="Log In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.loginButton}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpLink}>Sign up for free</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    color: COLORS.text,
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 24,
    ...SHADOWS.large,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '700',
  },
});

export default LoginScreen;
