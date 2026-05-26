import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { Button, Input } from '../../components';
import { useAuth, useDownloads } from '../../context';

const ProfileScreen = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { downloads, clearAllDownloads } = useDownloads();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  const [highQualityAudio, setHighQualityAudio] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsLoading(true);
    const result = await updateProfile({ name: name.trim() });
    setIsLoading(false);

    if (result.success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your downloads. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllDownloads();
            Alert.alert('Success', 'All downloads have been cleared');
          },
        },
      ]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, value, onValueChange, isSwitch = true }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {isSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.text}
        />
      )}
    </View>
  );

  const renderMenuButton = ({ icon, title, onPress, destructive = false }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? COLORS.error : COLORS.primary}
        />
      </View>
      <Text style={[styles.menuButtonText, destructive && styles.destructiveText]}>
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                icon={<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />}
              />
              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  size="small"
                  onPress={() => {
                    setName(user?.name || '');
                    setIsEditing(false);
                  }}
                  style={styles.editButton}
                />
                <Button
                  title="Save"
                  size="small"
                  onPress={handleSaveProfile}
                  loading={isLoading}
                  style={styles.editButton}
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{downloads.length}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {downloads.filter(d => d.format === 'mp3').length}
            </Text>
            <Text style={styles.statLabel}>MP3 Files</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {downloads.filter(d => d.format === 'mp4').length}
            </Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {renderSettingItem({
            icon: 'wifi-outline',
            title: 'Download over Wi-Fi only',
            subtitle: 'Save mobile data',
            value: downloadOverWifi,
            onValueChange: setDownloadOverWifi,
          })}
          
          {renderSettingItem({
            icon: 'musical-notes-outline',
            title: 'High quality audio',
            subtitle: '320kbps MP3',
            value: highQualityAudio,
            onValueChange: setHighQualityAudio,
          })}
          
          {renderSettingItem({
            icon: 'notifications-outline',
            title: 'Notifications',
            subtitle: 'Download complete alerts',
            value: notifications,
            onValueChange: setNotifications,
          })}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          {renderMenuButton({
            icon: 'trash-outline',
            title: 'Clear all downloads',
            onPress: handleClearData,
            destructive: true,
          })}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderMenuButton({
            icon: 'log-out-outline',
            title: 'Sign Out',
            onPress: handleLogout,
            destructive: true,
          })}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Shalook Music</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    marginBottom: 12,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  editForm: {
    width: '100%',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.primary,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
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
    marginBottom: 24,
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 8,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 8,
  },
  menuButtonText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  destructiveText: {
    color: COLORS.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  appName: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  appVersion: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: 4,
  },
});

export default ProfileScreen;
