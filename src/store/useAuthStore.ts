import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface AuthUser {
  id: string;
  pseudonym: string;
  realName?: string;
  isKYCVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (pseudonym: string, masterKey: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (pseudonym: string, masterKey: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulating a secure cryptographic handshake with the backend (e.g., Supabase)
          await new Promise((resolve) => setTimeout(resolve, 1200));

          if (masterKey !== 'cipher') {
            throw new Error('Invalid master key. Access denied.');
          }

          const mockUser: AuthUser = {
            id: 'usr_9x8a7b6c5',
            pseudonym: pseudonym || 'NeonMango',
            realName: 'Encrypted Entity',
            isKYCVerified: true,
          };

          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          set({ 
            error: error.message || 'Authentication failed.',
            isLoading: false 
          });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        // Simulating secure token destruction
        await new Promise((resolve) => setTimeout(resolve, 600));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'arena-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the session data, not the loading or error states
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

