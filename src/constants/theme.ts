// Safqa Theme - Noon Clone with Orange replacing Yellow
export const COLORS = {
  // Primary Brand Colors
  primary: '#F58634',        // Orange (replaces Noon's Yellow)
  primaryLight: '#FFB74D',   // Light orange for backgrounds
  primaryDark: '#E65100',    // Darker orange for pressed states

  // Secondary
  secondary: '#3866DF',      // Blue (for checkout, active tabs)
  secondaryLight: '#5C8AFF',
  secondaryDark: '#1A47B8',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F5F5',
  card: '#FFFFFF',
  border: '#E8E8E8',
  divider: '#EEEEEE',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',
  textWhite: '#FFFFFF',

  // Status
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Special
  express: '#F58634',        // Express badge color (orange)
  discount: '#E53935',       // Red for discount tags
  star: '#FFC107',           // Star rating color
  freeShipping: '#4CAF50',

  // Tab bar
  tabActive: '#F58634',
  tabInactive: '#9E9E9E',
  dealsTab: '#F58634',       // Orange for Deals tab
};

export const SIZES = {
  // Base
  base: 8,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 30,

  // Font sizes
  fontXs: 10,
  fontSm: 12,
  fontMd: 14,
  fontLg: 16,
  fontXl: 18,
  fontXxl: 22,
  fontTitle: 26,

  // Border radius
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  // Screen
  tabBarHeight: 60,
  headerHeight: 56,
  searchBarHeight: 44,
};

export const FONTS = {
  regular: {
    fontWeight: '400' as const,
  },
  medium: {
    fontWeight: '500' as const,
  },
  semiBold: {
    fontWeight: '600' as const,
  },
  bold: {
    fontWeight: '700' as const,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};
