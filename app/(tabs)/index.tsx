import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, ChevronRight, Users, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Pulling live dynamic state to guarantee real-time UI rendering
import { useArenaStore } from '../../src/store/useArenaStore';
import { useDilemmaStore } from '../../src/store/useDilemmaStore';
import { useUserStore } from '../../src/store/useUserStore';

export default function HomeScreen() {
  const router = useRouter();

  // Dynamic Data Subscriptions
  const activeDropIns = useArenaStore((state) => state.activeDropIns) || [];
  const currentDilemma = useDilemmaStore((state) => state.currentDilemma);
  const respondingFriends = useUserStore((state) => 
    currentDilemma ? state.getFriendsWhoAnswered(currentDilemma.id) : []
  );

  // Formats the actual device date automatically
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  return (
    <ScrollView 
      className="flex-1 bg-[#FAFAFA]"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-[Outfit_700Bold] text-[#111827] tracking-tight">
          The Daily Pulse
        </Text>
        <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280] mt-1">
          {currentDate}
        </Text>
      </View>

      {/* Dynamic Drop-In Alerts */}
      {activeDropIns.length > 0 && (
        <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827]">
              Live Arenas Need You
            </Text>
            {/* Warm Peach High-Heat Tag */}
            <View className="bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FED7AA]">
              <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#EA580C]">
                {activeDropIns.length} High Heat
              </Text>
            </View>
          </View>

          {activeDropIns.map((arena) => (
            <TouchableOpacity 
              key={arena.id}
              onPress={() => router.push(`/arena/${arena.id}`)}
              className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] p-5 shadow-sm shadow-[#111827]/5 active:opacity-80 mb-4"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Zap color="#EA580C" size={20} fill="#EA580C" className="mr-2" />
                  <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#EA580C]">
                    Drop-In Requested
                  </Text>
                </View>
                <Text className="text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280]">
                  {arena.spotsLeft} {arena.spotsLeft === 1 ? 'Spot' : 'Spots'} Left
                </Text>
              </View>
              
              <Text className="text-xl font-[Outfit_600SemiBold] text-[#111827] mb-2 leading-tight">
                "{arena.topic}"
              </Text>
              
              <View className="flex-row items-center justify-between mt-4">
                <View className="flex-row -space-x-2">
                  {/* Dynamic user avatars based on spots filled */}
                  {Array.from({ length: 6 - arena.spotsLeft }).map((_, i) => (
                    <View key={i} className="w-8 h-8 rounded-full bg-[#ECFDF5] border-2 border-[#FAFAFA] items-center justify-center">
                      <Users color="#047857" size={14} />
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#111827] mr-1">Join</Text>
                  <ChevronRight color="#111827" size={16} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Dynamic Global Daily Dilemma */}
      {currentDilemma && (
        <Animated.View entering={FadeInDown.delay(200).springify()} className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827]">
              Global Dilemma
            </Text>
            {/* Luminous Mint Timer Tag */}
            <View className="flex-row items-center bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
              <Clock color="#047857" size={12} className="mr-1" />
              <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#047857]">
                Closes in {currentDilemma.hoursLeft}h
              </Text>
            </View>
          </View>

          <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-6 shadow-sm shadow-[#111827]/5">
            <Text className="text-2xl font-[Outfit_600SemiBold] text-[#111827] leading-snug mb-6">
              {currentDilemma.question}
            </Text>

            <View className="space-y-3">
              {currentDilemma.options.map((option: string, index: number) => (
                <TouchableOpacity 
                  key={index}
                  className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-[20px] p-4 flex-row items-center justify-between active:bg-[#ECFDF5] active:border-[#D1FAE5]"
                >
                  <Text className="text-base font-[PlusJakartaSans_600SemiBold] text-[#111827]">
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Dynamic Friend Activity Overlay */}
            {respondingFriends.length > 0 && (
              <View className="mt-8 pt-6 border-t border-[rgba(17,24,39,0.05)]">
                <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#6B7280] mb-3">
                  {respondingFriends.length} {respondingFriends.length === 1 ? 'friend' : 'friends'} answered this
                </Text>
                <View className="flex-row -space-x-3">
                  {respondingFriends.slice(0, 3).map((friend) => (
                    <View key={friend.id} className="w-10 h-10 rounded-full bg-[#ECFDF5] border-2 border-[#FAFAFA] items-center justify-center">
                      <Text className="text-xs font-[Outfit_700Bold] text-[#047857]">
                        {friend.initials}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

