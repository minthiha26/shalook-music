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

const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
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
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    if (!agreeTerms) {
      Alert.alert('Terms Required', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setIsLoading(true);
    const result = await signUp(email, password, name);
    setIsLoading(false);
    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#1a472a', '#121212']}
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
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
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>
                Sign up to start downloading your favorite music
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="What should we call you?"
                autoCapitalize="words"
                error={errors.name}
                icon={<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />}
              />

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
                placeholder="Create a strong password"
                secureTextEntry
                error={errors.password}
                icon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
                icon={<Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />}
              />

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                  {agreeTerms && (
                    <Ionicons name="checkmark" size={14} color={COLORS.background} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.registerButton}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Sign Up */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={22} color={COLORS.text} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={22} color={COLORS.text} />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.signInLink}>Sign in</Text>
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
    height: SCREEN_HEIGHT * 0.4,
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 24,
    ...SHADOWS.large,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  registerButton: {
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
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  socialButtonText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
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
  signInLink: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '700',
  },
});

export default RegisterScreen;
