import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { ShieldAlert, CheckCircle, Clock } from 'lucide-react-native';

export interface ChatMessage {
  id: string;
  senderId: string;
  pseudonym?: string;
  content: string;
  status: 'none' | 'verified' | 'challenged' | 'debunked';
  timestamp: string;
  isConsecutive?: boolean; // Hides avatar/name if same user sends multiple messages
}

export interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  onChallenge?: (messageId: string) => void;
}

export default function ChatBubble({ message, isMe, onChallenge }: ChatBubbleProps) {
  const { status, isConsecutive } = message;

  return (
    <Animated.View 
      entering={FadeInUp.springify().damping(14)}
      layout={Layout.springify()}
      className={`mb-3 max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}
    >
      {/* Sender Pseudonym - Only show if it's someone else and not a consecutive message */}
      {!isMe && !isConsecutive && (
        <Text className="text-[11px] font-[PlusJakartaSans_700Bold] text-[#6B7280] mb-1 ml-3 uppercase tracking-wider">
          {message.pseudonym}
        </Text>
      )}
      
      <View 
        className={`px-4 py-3 border shadow-sm ${
          isMe 
            ? 'bg-[#111827] border-[#111827] shadow-[#111827]/10 rounded-[20px] rounded-br-[4px]' 
            : 'bg-[rgba(255,255,255,0.70)] border-[rgba(255,255,255,0.90)] shadow-[#111827]/5 rounded-[20px] rounded-bl-[4px]'
        } ${
          // Apply a subtle Deep Sage glow if the message has been verified by the community/system
          status === 'verified' && !isMe ? 'bg-[#ECFDF5] border-[#D1FAE5]' : ''
        } ${
          // Apply a Warm Peach warning state if the claim is currently under challenge
          status === 'challenged' && !isMe ? 'bg-[#FFF7ED] border-[#FED7AA]' : ''
        }`}
      >
        <Text 
          className={`text-base font-[PlusJakartaSans_500Medium] leading-relaxed ${
            isMe ? 'text-[#FAFAFA]' : 'text-[#111827]'
          } ${
            status === 'debunked' ? 'line-through opacity-50' : ''
          }`}
        >
          {message.content}
        </Text>
      </View>

      {/* Metadata & Actions Row */}
      <View className={`flex-row items-center mt-1.5 space-x-3 ${isMe ? 'justify-end mr-2' : 'justify-start ml-2'}`}>
        
        {/* Timestamp */}
        <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#9CA3AF]">
          {message.timestamp}
        </Text>

        {/* Fact-Check Status Indicators */}
        {status === 'verified' && (
          <View className="flex-row items-center">
            <View className="w-1 h-1 rounded-full bg-[#D1D5DB] mr-2" />
            <CheckCircle color="#047857" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider">
              Sourced & Verified
            </Text>
          </View>
        )}

        {status === 'challenged' && (
          <View className="flex-row items-center">
            <View className="w-1 h-1 rounded-full bg-[#D1D5DB] mr-2" />
            <Clock color="#EA580C" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#EA580C] uppercase tracking-wider">
              Verification Pending
            </Text>
          </View>
        )}
        
        {/* Challenge Action Button (Only visible on others' unverified messages) */}
        {!isMe && status === 'none' && onChallenge && (
          <TouchableOpacity 
            onPress={() => onChallenge(message.id)}
            className="flex-row items-center opacity-50 active:opacity-100"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="w-1 h-1 rounded-full bg-[#D1D5DB] mr-2" />
            <ShieldAlert color="#6B7280" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#6B7280] uppercase tracking-wider">
              Challenge Claim
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

