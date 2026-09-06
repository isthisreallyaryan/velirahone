import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface ValuesVector {
  fiscal: number;    // 0 (Regulated) to 1 (Free Market)
  social: number;    // 0 (Progressive) to 1 (Traditional)
  authority: number; // 0 (Civil Liberties) to 1 (Order & Law)
  welfare: number;   // 0 (Universal) to 1 (Privatized)
}

export interface Friend {
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
  isKYCVerified: boolean;
}

interface UserState {
  profile: UserProfile | null;
  valuesVector: ValuesVector | null;
  factCheckTokens: number;
  lastTokenResetDate: string | null;
  friends: Friend[];
  
  // Actions
  initializeProfile: () => void;
  useToken: () => boolean;
  updateVector: (axis: keyof ValuesVector, delta: number) => void;
  addHandshake: (friend: Friend) => void;
}

// Initial mock data simulating a securely authenticated session
const MOCK_PROFILE: UserProfile = {
  id: 'usr_9x8a7b6c5',
  pseudonym: 'NeonMango',
  realName: 'Vijender Singh',
  isKYCVerified: true,
};

const MOCK_VECTOR: ValuesVector = {
  fiscal: 0.51,
  social: 0.73,
  authority: 0.42,
  welfare: 0.65,
};

const MOCK_FRIENDS: Friend[] = [
  { id: 'f_1', pseudonym: 'CipherWeaver', initials: 'CW', mutualPods: 3, alignmentScore: 82 },
  { id: 'f_2', pseudonym: 'AtlasShrugged', initials: 'AS', mutualPods: 1, alignmentScore: 45 },
  { id: 'f_3', pseudonym: 'SolarPunk2099', initials: 'SP', mutualPods: 5, alignmentScore: 91 },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      valuesVector: null,
      factCheckTokens: 5,
      lastTokenResetDate: null,
      friends: [],

      initializeProfile: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        // Reset tokens if a new day has started
        let tokens = state.factCheckTokens;
        if (state.lastTokenResetDate !== today) {
          tokens = 5;
        }

        set({
          profile: state.profile || MOCK_PROFILE,
          valuesVector: state.valuesVector || MOCK_VECTOR,
          friends: state.friends.length > 0 ? state.friends : MOCK_FRIENDS,
          factCheckTokens: tokens,
          lastTokenResetDate: today,
        });
      },

      useToken: () => {
        const { factCheckTokens } = get();
        if (factCheckTokens > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          set({ factCheckTokens: factCheckTokens - 1 });
          return true;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return false;
      },

      updateVector: (axis, delta) => {
        const { valuesVector } = get();
        if (!valuesVector) return;

        // Ensure bounds between 0 and 1
        const newValue = Math.max(0, Math.min(1, valuesVector[axis] + delta));
        
        set({
          valuesVector: {
            ...valuesVector,
            [axis]: newValue,
          },
        });
      },

      addHandshake: (friend) => {
        const { friends } = get();
        if (!friends.find(f => f.id === friend.id)) {
          set({ friends: [friend, ...friends] });
        }
      },
    }),
    {
      name: 'arena-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Automatically rehydrate the profile upon app launch
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeProfile();
        }
      },
    }
  )
);

