import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { Handshake, MessageCircle, ArrowUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export interface FriendResponse {
  id: string;
  pseudonym: string;
  initials: string;
  alignmentScore: number;
  selectedOptionText: string;
  isAlignedWithUser: boolean;
}

export interface FriendResponsesProps {
  responses: FriendResponse[];
  userHasVoted: boolean;
}

export default function FriendResponses({ responses, userHasVoted }: FriendResponsesProps) {
  const router = useRouter();

  if (!userHasVoted) {
    return (
      <View className="mt-6 pt-5 border-t border-[rgba(17,24,39,0.05)] items-center">
        <View className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E5E7EB] items-center justify-center mb-3">
          <Handshake color="#9CA3AF" size={20} />
        </View>
        <Text className="text-sm font-[Outfit_600SemiBold] text-[#111827] mb-1">
          Network Insights Hidden
        </Text>
        <Text className="text-xs font-[PlusJakartaSans_500Medium] text-[#6B7280] text-center px-4">
          Lock in your vector coordinates first to see how your trusted handshakes navigated this dilemma.
        </Text>
      </View>
    );
  }

  if (responses.length === 0) {
    return null;
  }

  return (
    <View className="mt-6 pt-5 border-t border-[rgba(17,24,39,0.05)]">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-[Outfit_600SemiBold] text-[#111827]">
          Handshake Insights
        </Text>
        <View className="bg-[#FAFAFA] px-2 py-1 rounded-full border border-[#E5E7EB]">
          <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#6B7280] uppercase tracking-wider">
            {responses.length} Responded
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="-mx-6 px-6"
      >
        {responses.map((friend, index) => (
          <Animated.View 
            key={friend.id}
            entering={FadeInRight.springify().damping(14).delay(index * 100)}
            layout={Layout.springify()}
            className="mr-3"
          >
            <View className={`w-64 bg-[rgba(255,255,255,0.70)] border rounded-[20px] p-4 shadow-sm shadow-[#111827]/5 ${
              friend.isAlignedWithUser 
                ? 'border-[#D1FAE5]' 
                : 'border-[#E5E7EB]'
            }`}>
              
              {/* Header: User Info */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full border items-center justify-center mr-2 ${
                    friend.isAlignedWithUser 
                      ? 'bg-[#ECFDF5] border-[#D1FAE5]' 
                      : 'bg-[#FAFAFA] border-[#E5E7EB]'
                  }`}>
                    <Text className={`text-[10px] font-[Outfit_700Bold] ${
                      friend.isAlignedWithUser ? 'text-[#047857]' : 'text-[#6B7280]'
                    }`}>
                      {friend.initials}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs font-[Outfit_600SemiBold] text-[#111827]">
                      {friend.pseudonym}
                    </Text>
                    <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#047857]">
                      {friend.alignmentScore}% Alignment
                    </Text>
                  </View>
                </View>

                {/* Direct Message Action */}
                <TouchableOpacity 
                  onPress={() => router.push(`/chat/${friend.id}`)}
                  className="p-1.5 bg-[#FAFAFA] rounded-full border border-[#E5E7EB] active:bg-[#F3F4F6]"
                >
                  <MessageCircle color="#6B7280" size={14} />
                </TouchableOpacity>
              </View>

              {/* The Stance */}
              <View className={`p-3 rounded-[12px] border ${
                friend.isAlignedWithUser 
                  ? 'bg-[#ECFDF5] border-[#D1FAE5]' 
                  : 'bg-[#FAFAFA] border-[#E5E7EB]'
              }`}>
                <Text className="text-xs font-[PlusJakartaSans_700Bold] text-[#111827] mb-1 uppercase tracking-wider opacity-60">
                  {friend.isAlignedWithUser ? 'Shared Vector' : 'Divergent Vector'}
                </Text>
                <Text className={`text-xs font-[PlusJakartaSans_600SemiBold] leading-relaxed ${
                  friend.isAlignedWithUser ? 'text-[#047857]' : 'text-[#6B7280]'
                }`} numberOfLines={2}>
                  "{friend.selectedOptionText}"
                </Text>
              </View>

            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

