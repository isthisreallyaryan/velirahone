export const ArenaColors = {
  // The Organic Glass Foundation
  glass: {
    background: 'rgba(255, 255, 255, 0.70)',
    border: 'rgba(255, 255, 255, 0.90)',
    overlay: 'rgba(255, 255, 255, 0.40)',
    shadow: 'rgba(17, 24, 39, 0.05)',
  },
  
  // Deep Sage & Luminous Mint (Verification, Alignment, Truth)
  mint: {
    50: '#ECFDF5',  // Luminous Mint (Backgrounds)
    100: '#D1FAE5', // Borders & subtle highlights
    600: '#059669', // Muted text & secondary icons
    700: '#047857', // Deep Sage (Core accent, verification stamp)
    900: '#064E3B', // High-contrast text
  },

  // Warm Peach & Heated Amber (Challenges, Tension, Countdowns)
  peach: {
    50: '#FFF7ED',  // Warm Peach (Backgrounds)
    100: '#FFEDD5', // Active hover states
    200: '#FED7AA', // Borders & countdown glows
    600: '#EA580C', // Heated Amber (Core accent, challenge triggers)
    900: '#7C2D12', // High-contrast text
  },

  // Typography, Shadows & Neutrals
  neutral: {
    50: '#FAFAFA',  // App background
    100: '#F3F4F6', // Input backgrounds
    200: '#E5E7EB', // Dividers
    300: '#D1D5DB', // Disabled states
    400: '#9CA3AF', // Placeholder text
    500: '#6B7280', // Secondary text
    600: '#4B5563', 
    700: '#374151',
    800: '#1F2937', 
    900: '#111827', // Primary text & highest contrast elements
  }
} as const;

export type ColorTheme = typeof ArenaColors;

