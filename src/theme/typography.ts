export const ArenaTypography = {
  family: {
    // Outfit: Used for primary headers, high-impact numbers, and status stamps
    display: {
      regular: 'Outfit_400Regular',
      medium: 'Outfit_500Medium',
      semiBold: 'Outfit_600SemiBold',
      bold: 'Outfit_700Bold',
    },
    // Plus Jakarta Sans: Used for chat bubbles, metadata, UI text, and long-form reading
    body: {
      regular: 'PlusJakartaSans_400Regular',
      medium: 'PlusJakartaSans_500Medium',
      semiBold: 'PlusJakartaSans_600SemiBold',
      bold: 'PlusJakartaSans_700Bold',
    },
  },
  size: {
    '2xs': 10, // Metadata, timestamps, tiny uppercase labels
    xs: 12,    // Subtext, captions
    sm: 14,    // Standard UI controls, small body
    base: 16,  // Primary chat bubble text
    lg: 18,    // Sub-headers, prominent buttons
    xl: 20,    // Modal headers
    '2xl': 24, // Dilemma prompts, major section titles
    '3xl': 32, // Hero text, landing screens
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.625, // Optimized for long-form reading in chat bubbles
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.5, // Essential for the 'uppercase tracking-wider' UI labels
  }
} as const;

export type TypographyTheme = typeof ArenaTypography;

