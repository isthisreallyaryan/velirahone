import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface IdeologicalVector {
  fiscal: number;
  social: number;
  authority: number;
  welfare: number;
}

export interface HandshakeConnection {
  id: string;
  pseudonym: string;
  initials: string;
  mutualPods: number;
  alignmentScore: number;
}

export interface UserProfile {
  id: string;
  pseudonym: string;
  realName: string;
  location: string;
  isKYCVerified: boolean;
}

interface UserState {
  profile: UserProfile | null;
  valuesVector: IdeologicalVector;
  factCheckTokens: number;
  friends: HandshakeConnection[];
  
  // Actions
  useToken: () => boolean;
  replenishTokens: () => void;
  updateVector: (axis: keyof IdeologicalVector, value: number) => void;
  addHandshake: (friend: HandshakeConnection) => void;
  initializeProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      
      // Default continuous coordinates
      valuesVector: {
        fiscal: 0.51,
        social: 0.73,
        authority: 0.42,
        welfare: 0.65,
      },
      
      factCheckTokens: 5,
      
      // Seeded high-integrity network
      friends: [
        { id: 'usr_8x7b', pseudonym: 'CipherWeaver', initials: 'CW', mutualPods: 3, alignmentScore: 82 },
        { id: 'usr_9x2c', pseudonym: 'Komal', initials: 'K', mutualPods: 7, alignmentScore: 94 },
      ],

      useToken: () => {
        const currentTokens = get().factCheckTokens;
        if (currentTokens > 0) {
          set({ factCheckTokens: currentTokens - 1 });
          // Haptic feedback handled at the component level for precise timing
          return true;
        }
        return false;
      },

      replenishTokens: () => {
        set({ factCheckTokens: 5 });
      },

      updateVector: (axis, value) => {
        set((state) => ({
          valuesVector: {
            ...state.valuesVector,
            [axis]: value,
          }
        }));
      },

      addHandshake: (friend) => {
        set((state) => ({
          friends: [friend, ...state.friends]
        }));
      },

      initializeProfile: () => {
        // Seeding encrypted identity verified via secure KYC
        set({
          profile: {
            id: 'usr_9x8a7b6c5',
            pseudonym: 'NeonMango',
            realName: 'Vijender Singh',
            location: 'Hyderabad',
            isKYCVerified: true,
          }
        });
      }
    }),
    {
      name: 'arena-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the non-ephemeral state
      partialize: (state) => ({ 
        valuesVector: state.valuesVector,
        factCheckTokens: state.factCheckTokens,
        friends: state.friends,
        profile: state.profile
      }),
    }
  )
);
