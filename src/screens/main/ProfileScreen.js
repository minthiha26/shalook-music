import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { Button, Input } from '../../components';
import { useAuth, useDownloads } from '../../context';

const ProfileScreen = ({ navigation }) => {
  const { user, signOut, updateProfile } = useAuth();
  const { downloads, clearAllDownloads } = useDownloads();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    downloadWifi: true,
    highQuality: true,
    notifications: true,
    autoPlay: true,
    darkMode: true,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setIsLoading(true);
    await updateProfile({ name: name.trim() });
    setIsLoading(false);
    setIsEditing(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all downloads. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAllDownloads },
      ]
    );
  };

  const stats = [
    { label: 'Downloads', value: downloads.length, icon: 'download' },
    { label: 'Playlists', value: 0, icon: 'list' },
    { label: 'Favorites', value: 0, icon: 'heart' },
  ];

  const menuItems = [
    {
      title: 'Account',
      items: [
        { id: 'edit', label: 'Edit Profile', icon: 'person-outline', onPress: () => setIsEditing(true) },
        { id: 'password', label: 'Change Password', icon: 'lock-closed-outline' },
        { id: 'privacy', label: 'Privacy Settings', icon: 'shield-outline' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'quality', label: 'Audio Quality', icon: 'musical-notes-outline', value: 'Very High' },
        { id: 'storage', label: 'Storage', icon: 'folder-outline', value: '2.4 GB used' },
        { id: 'language', label: 'Language', icon: 'globe-outline', value: 'English' },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        { id: 'clear_cache', label: 'Clear Cache', icon: 'trash-outline' },
        { id: 'clear_downloads', label: 'Clear Downloads', icon: 'close-circle-outline', destructive: true, onPress: handleClearData },
      ],
    },
    {
      title: 'About',
      items: [
        { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
        { id: 'terms', label: 'Terms of Service', icon: 'document-text-outline' },
        { id: 'privacy_policy', label: 'Privacy Policy', icon: 'shield-checkmark-outline' },
        { id: 'version', label: 'App Version', icon: 'information-circle-outline', value: '1.0.0' },
      ],
    },
  ];

  const renderSettingToggle = (key, label, icon, description) => (
    <View style={styles.settingItem} key={key}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.text}
      />
    </View>
  );

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, item.destructive && styles.destructiveIcon]}>
        <Ionicons 
          name={item.icon} 
          size={22} 
          color={item.destructive ? COLORS.error : COLORS.textSecondary} 
        />
      </View>
      <Text style={[styles.menuLabel, item.destructive && styles.destructiveText]}>
        {item.label}
      </Text>
      {item.value ? (
        <Text style={styles.menuValue}>{item.value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[COLORS.surfaceLight, COLORS.background]}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Profile</Text>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => navigation.navigate('Settings')}
              >
                <Ionicons name="settings-outline" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  variant="rounded"
                />
                <View style={styles.editActions}>
                  <Button
                    title="Cancel"
                    variant="ghost"
                    size="small"
                    onPress={() => {
                      setName(user?.name || '');
                      setIsEditing(false);
                    }}
                  />
                  <Button
                    title="Save"
                    size="small"
                    onPress={handleSaveProfile}
                    loading={isLoading}
                  />
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <View style={styles.statItem}>
                  <Ionicons name={stat.icon} size={20} color={COLORS.primary} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                {index < stats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* Settings Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          {renderSettingToggle('downloadWifi', 'Download on Wi-Fi only', 'wifi-outline', 'Save mobile data')}
          {renderSettingToggle('highQuality', 'High quality audio', 'musical-notes-outline', '320kbps streaming')}
          {renderSettingToggle('notifications', 'Push notifications', 'notifications-outline')}
          {renderSettingToggle('autoPlay', 'Autoplay', 'play-circle-outline', 'Play similar tracks')}
        </View>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            variant="outline"
            fullWidth
            onPress={handleLogout}
            icon={<Ionicons name="log-out-outline" size={20} color={COLORS.text} />}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Ionicons name="musical-notes" size={32} color={COLORS.primary} />
          <Text style={styles.appName}>Shalook Music</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  editForm: {
    width: '80%',
    marginTop: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius.lg,
    padding: 20,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginTop: 24,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius.md,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  settingDescription: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(241, 94, 108, 0.1)',
  },
  menuLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  destructiveText: {
    color: COLORS.error,
  },
  menuValue: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  signOutSection: {
    paddingHorizontal: SIZES.padding,
    marginTop: 32,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 100,
  },
  appName: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginTop: 12,
  },
  appVersion: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    marginTop: 4,
  },
});

export default ProfileScreen;
