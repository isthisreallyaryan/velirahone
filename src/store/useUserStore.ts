import { create } from 'zustand';
import * as Haptics from 'expo-haptics';

export interface ChatMessage {
  id: string;
  senderId: string;
  pseudonym: string;
  content: string;
  status: 'none' | 'verified' | 'challenged' | 'debunked';
  timestamp: string;
  type?: 'text' | 'voice' | 'dilemma_reference';
}

export interface ArenaPod {
  id: string;
  topic: string;
  heatLevel: number;
  hoursRemaining: number;
  participants: string[];
}

interface ArenaState {
  activePods: ArenaPod[];
  messages: ChatMessage[];
  isConnecting: boolean;
  
  // Actions
  connectToPod: (podId: string) => Promise<void>;
  sendMessage: (podId: string, content: string) => void;
  challengeMessage: (messageId: string) => Promise<void>;
  verifyMessage: (messageId: string) => Promise<void>;
}

export const useArenaStore = create<ArenaState>((set, get) => ({
  activePods: [
    {
      id: 'pod_1',
      topic: 'Universal Basic Income is structurally unsustainable.',
      heatLevel: 85,
      hoursRemaining: 14,
      participants: ['me', 'usr_8x7b', 'usr_3b2a'],
    }
  ],
  messages: [],
  isConnecting: false,

  connectToPod: async (podId) => {
    set({ isConnecting: true });
    
    // Simulating a secure websocket handshake to join the 6-person room
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    set({
      isConnecting: false,
      messages: [
        { 
          id: 'm1', 
          senderId: 'usr_8x7b', 
          pseudonym: 'CipherWeaver', 
          content: 'UBI ignores the velocity of money. If you inject baseline capital without output, you just inflate the floor.', 
          status: 'none', 
          timestamp: '10:42 AM' 
        },
        { 
          id: 'm2', 
          senderId: 'me', 
          pseudonym: 'NeonMango', 
          content: 'But you are assuming supply remains entirely static. Automation is already decoupling labor from production.', 
          status: 'none', 
          timestamp: '10:44 AM' 
        }
      ]
    });
  },

  sendMessage: (podId, content) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      pseudonym: 'NeonMango', // In production, this pulls dynamically from useUserStore
      content,
      status: 'none',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  challengeMessage: async (messageId) => {
    // Firing a heavy haptic strike immediately anchors the user's action
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    set((state) => ({
      messages: state.messages.map(m => 
        m.id === messageId ? { ...m, status: 'challenged' } : m
      )
    }));
  },

  verifyMessage: async (messageId) => {
    // Rewarding a successful citation with a crisp success vibration
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    set((state) => ({
      messages: state.messages.map(m => 
        m.id === messageId ? { ...m, status: 'verified' } : m
      )
    }));
  }
}));

