import { create } from 'zustand';
import * as Haptics from 'expo-haptics';

export interface ArenaMessage {
  id: string;
  senderId: string;
  pseudonym?: string;
  content: string;
  status: 'none' | 'verified' | 'challenged' | 'debunked';
  timestamp: string;
  type: 'text' | 'voice' | 'dilemma_reference';
}

export interface DebatePod {
  id: string;
  topic: string;
  heatLevel: number; // 0 to 100
  hoursRemaining: number;
  participants: string[];
}

interface ArenaState {
  activePods: DebatePod[];
  messages: ArenaMessage[];
  isConnecting: boolean;
  
  // Core Actions
  joinPod: (podId: string) => Promise<void>;
  sendMessage: (podId: string, content: string) => void;
  updateHeatLevel: (podId: string, newHeat: number) => void;
  
  // The Fact-Check Engine
  challengeMessage: (messageId: string) => void;
  verifyMessage: (messageId: string, citationUrl: string) => void;
  debunkMessage: (messageId: string) => void;
}

export const useArenaStore = create<ArenaState>()((set, get) => ({
  activePods: [
    {
      id: 'pod_1',
      topic: 'Universal Basic Income is structurally unsustainable.',
      heatLevel: 85,
      hoursRemaining: 14,
      participants: ['usr_1', 'usr_2', 'usr_3', 'usr_9x8a7b6c5'],
    }
  ],
  messages: [],
  isConnecting: false,

  joinPod: async (podId) => {
    set({ isConnecting: true });
    
    // Simulating secure WebSocket handshake to the Arena
    await new Promise((resolve) => setTimeout(resolve, 800));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    set({
      isConnecting: false,
      messages: [
        {
          id: 'msg_1',
          senderId: 'other',
          pseudonym: 'CipherWeaver',
          content: 'UBI fundamentally removes the market incentive for baseline labor.',
          status: 'none',
          timestamp: '10:42 AM',
          type: 'text'
        }
      ]
    });
  },

  sendMessage: (podId, content) => {
    const newMessage: ArenaMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      content,
      status: 'none',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  updateHeatLevel: (podId, newHeat) => {
    set((state) => ({
      activePods: state.activePods.map((pod) =>
        pod.id === podId ? { ...pod, heatLevel: newHeat } : pod
      )
    }));
  },

  challengeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.id === messageId ? { ...msg, status: 'challenged' } : msg
      )
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  verifyMessage: (messageId, citationUrl) => {
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.id === messageId ? { ...msg, status: 'verified' } : msg
      )
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  debunkMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.id === messageId ? { ...msg, status: 'debunked' } : msg
      )
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}));

