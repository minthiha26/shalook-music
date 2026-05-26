import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { HomeScreen, SearchScreen, DownloadsScreen, ProfileScreen } from '../screens';
import { COLORS, SIZES } from '../constants';
import { useDownloads } from '../context';

const Tab = createBottomTabNavigator();

const TabBarBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
    <View style={styles.tabBarOverlay} />
  </View>
);

const MainNavigator = () => {
  const { downloadQueue } = useDownloads();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          const size = focused ? 26 : 24;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Downloads':
              iconName = focused ? 'download' : 'download-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Downloads" 
        component={DownloadsScreen}
        options={{
          tabBarLabel: 'Downloads',
          tabBarBadge: downloadQueue.length > 0 ? downloadQueue.length : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 85 : 65,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -4,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  tabBarItem: {
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
});

export default MainNavigator;
