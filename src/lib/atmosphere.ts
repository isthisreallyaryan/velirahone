import { useState, useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

export type AtmosphericTheme = 'calm' | 'elevated' | 'heated' | 'sunset';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryAccent: string;
  secondaryAccent: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}

export const ATMOSPHERE_PALETTES: Record<AtmosphericTheme, ThemeColors> = {
  calm: {
    background: '#FAFAFA',
    cardBackground: 'rgba(255, 255, 255, 0.70)',
    primaryAccent: '#047857', // Deep Sage / Luminous Mint
    secondaryAccent: '#ECFDF5',
    border: 'rgba(255, 255, 255, 0.90)',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
  },
  elevated: {
    background: '#F8FAFC',
    cardBackground: 'rgba(255, 255, 255, 0.80)',
    primaryAccent: '#0369A1', // Deep Slate Blue
    secondaryAccent: '#E0F2FE',
    border: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
  },
  heated: {
    background: '#FFF7ED', // Warm Peach Canvas
    cardBackground: 'rgba(255, 255, 255, 0.75)',
    primaryAccent: '#EA580C', // Heated Amber / Orange
    secondaryAccent: '#FFEDD5',
    border: 'rgba(254, 215, 170, 0.90)',
    textPrimary: '#111827',
    textSecondary: '#7C2D12',
  },
  sunset: {
    background: '#FEF2F2', // Soft Crimson/Sunset
    cardBackground: 'rgba(255, 255, 255, 0.75)',
    primaryAccent: '#DC2626',
    secondaryAccent: '#FEE2E2',
    border: 'rgba(254, 202, 202, 0.90)',
    textPrimary: '#111827',
    textSecondary: '#991B1B',
  },
};

/**
 * Hook to manage dynamic atmospheric transitions based on debate heat levels or user focus state.
 */
export function useAtmosphere(theme: AtmosphericTheme = 'calm') {
  const currentPalette = ATMOSPHERE_PALETTES[theme];

  return {
    palette: currentPalette,
    // Helper to determine heat state from a 0-100 number
    getThemeFromHeat: (heatLevel: number): AtmosphericTheme => {
      if (heatLevel > 80) return 'heated';
      if (heatLevel > 50) return 'elevated';
      return 'calm';
    }
  };
}

