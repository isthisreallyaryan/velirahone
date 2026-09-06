import { create } from 'zustand';
import * as Haptics from 'expo-haptics';

export interface DirectMessage {
  id: string;
  senderId: string;
  content?: string;
  timestamp: string;
  type: 'text' | 'voice' | 'dilemma_reference';
  pins?: number[];
  duration?: number;
}

interface ChatState {
  // Messages keyed by the friend's ID for O(1) constant time lookup
  threads: Record<string, DirectMessage[]>;
  activeTyping: Record<string, boolean>;
  
  // Actions
  sendMessage: (
    friendId: string, 
    content: string, 
    type?: 'text' | 'voice' | 'dilemma_reference',
    pins?: number[],
    duration?: number
  ) => void;
  receiveMessage: (friendId: string, message: DirectMessage) => void;
  setTypingStatus: (friendId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  threads: {},
  activeTyping: {},

  sendMessage: (friendId, content, type = 'text', pins = [], duration) => {
    const newMessage: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: 'me',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      pins,
      duration
    };

    set((state) => {
      const currentThread = state.threads[friendId] || [];
      return {
        threads: {
          ...state.threads,
          [friendId]: [...currentThread, newMessage]
        }
      };
    });
    
    // Provide physical confirmation that the thought was dispatched
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  receiveMessage: (friendId, message) => {
    set((state) => {
      const currentThread = state.threads[friendId] || [];
      return {
        threads: {
          ...state.threads,
          [friendId]: [...currentThread, message]
        }
      };
    });
    
    // Subtle notification for incoming intel
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  setTypingStatus: (friendId, isTyping) => {
    set((state) => ({
      activeTyping: {
        ...state.activeTyping,
        [friendId]: isTyping
      }
    }));
  }
}));

