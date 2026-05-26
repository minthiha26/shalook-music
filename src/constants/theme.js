// Spotify-inspired Theme
export const COLORS = {
  // Primary colors
  primary: '#1DB954',        // Spotify green
  primaryDark: '#1aa34a',
  primaryLight: '#1ed760',
  
  // Background colors
  background: '#121212',     // Main background
  surface: '#181818',        // Cards, elevated surfaces
  surfaceLight: '#282828',   // Lighter surface
  surfaceHover: '#333333',   // Hover state
  
  // Text colors
  text: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#727272',
  
  // Accent colors
  accent: '#1DB954',
  accentBlue: '#509bf5',
  accentPurple: '#af2896',
  accentOrange: '#f59b23',
  accentPink: '#e91e63',
  
  // Status colors
  success: '#1DB954',
  error: '#f15e6c',
  warning: '#f59b23',
  info: '#509bf5',
  
  // Other
  border: '#333333',
  divider: '#282828',
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardBg: '#181818',
  inputBg: '#333333',
  
  // Gradients (as array for LinearGradient)
  gradientPrimary: ['#1DB954', '#191414'],
  gradientDark: ['#333333', '#121212'],
  gradientCard: ['#535353', '#121212'],
  gradientPurple: ['#af2896', '#509bf5'],
  gradientOrange: ['#f59b23', '#e91e63'],
};

export const FONTS = {
  light: 'System',
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
  hero: 56,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  
  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  // Layout
  padding: 16,
  margin: 16,
  
  // Legacy support
  radiusLg: 20,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 8,
  },
};
