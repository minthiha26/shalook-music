import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const USERS_STORAGE_KEY = '@shalook_users';
const CURRENT_USER_KEY = '@shalook_current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const saveUsers = async (users) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const users = await getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password, // In production, this should be hashed
        name,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveUsers(users);

      // Auto login after signup
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  const signIn = async (email, password) => {
    try {
      const users = await getUsers();
      
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;

      setUser(userWithoutPassword);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: 'Failed to sign out' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const users = await getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await saveUsers(users);
        
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
