import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Swords, Flame, Shield, Clock, ChevronRight, Activity } from 'lucide-react-native';

// Pulling live dynamic state for real-time matchmaking and pod tracking
import { useArenaStore } from '../../src/store/useArenaStore';

export default function ArenaScreen() {
  const router = useRouter();
  
  // Dynamic Data Subscriptions
  const { activePods, pastPods, isQueueing, enterQueue } = useArenaStore();

  const handleMatchmaking = async () => {
    // Triggers the Postgres pgvector RPC on the backend to match 6 balanced users
    await enterQueue();
  };

  return (
    <ScrollView 
      className="flex-1 bg-[#FAFAFA]"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-[Outfit_700Bold] text-[#111827] tracking-tight">
          The Arena
        </Text>
        <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280] mt-1">
          Matchmaking & Active Pods
        </Text>
      </View>

      {/* Matchmaking Command Center */}
      <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 mb-10">
        <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-6 shadow-sm shadow-[#111827]/5">
          <View className="w-12 h-12 rounded-full bg-[#ECFDF5] items-center justify-center mb-4 border border-[#D1FAE5]">
            <Swords color="#047857" size={24} />
          </View>
          <Text className="text-xl font-[Outfit_600SemiBold] text-[#111827] mb-2">
            Enter Matchmaking
          </Text>
          <Text className="text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280] mb-6 leading-relaxed">
            The algorithm will balance 6 users across the ideological spectrum for a 24-hour structured debate.
          </Text>

          <TouchableOpacity 
            onPress={handleMatchmaking}
            disabled={isQueueing}
            className={`w-full flex-row justify-center items-center rounded-[24px] py-4 shadow-md ${
              isQueueing ? 'bg-[#E5E7EB] shadow-none' : 'bg-[#111827] shadow-[#111827]/20 active:opacity-80'
            }`}
          >
            {isQueueing ? (
              <>
                <ActivityIndicator color="#6B7280" className="mr-3" />
                <Text className="text-[#6B7280] text-lg font-[Outfit_600SemiBold]">
                  Calibrating Vector...
                </Text>
              </>
            ) : (
              <>
                <Text className="text-[#FAFAFA] text-lg font-[Outfit_600SemiBold] mr-2">
                  Find a Pod
                </Text>
                <Activity color="#FAFAFA" size={20} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Active Pods */}
      <View className="px-6 mb-10">
        <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827] mb-4">
          Live Pods
        </Text>
        
        {activePods.length === 0 ? (
          <View className="items-center justify-center py-8 border border-dashed border-[#D1D5DB] rounded-[24px]">
            <Shield color="#9CA3AF" size={32} className="mb-3" />
            <Text className="text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280]">
              You have no active debates.
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {activePods.map((pod, index) => (
              <Animated.View key={pod.id} entering={FadeInUp.delay(150 + index * 50).springify()}>
                <TouchableOpacity 
                  onPress={() => router.push(`/arena/${pod.id}`)}
                  className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] p-5 shadow-sm shadow-[#111827]/5 active:opacity-80 flex-row items-center"
                >
                  <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-2">
                      {pod.heatLevel > 75 ? (
                        <View className="flex-row items-center bg-[#FFF7ED] px-2 py-1 rounded-full border border-[#FED7AA] mr-2">
                          <Flame color="#EA580C" size={12} className="mr-1" />
                          <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#EA580C] uppercase tracking-wider">
                            High Heat
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center bg-[#ECFDF5] px-2 py-1 rounded-full border border-[#D1FAE5] mr-2">
                          <Activity color="#047857" size={12} className="mr-1" />
                          <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider">
                            Steady
                          </Text>
                        </View>
                      )}
                      <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#6B7280]">
                        {pod.hoursRemaining}h left
                      </Text>
                    </View>
                    <Text className="text-base font-[Outfit_600SemiBold] text-[#111827] leading-snug" numberOfLines={2}>
                      "{pod.topic}"
                    </Text>
                  </View>
                  <View className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#E5E7EB] items-center justify-center">
                    <ChevronRight color="#111827" size={20} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Historical Pods */}
      {pastPods.length > 0 && (
        <View className="px-6 mb-6">
          <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827] mb-4">
            Archive
          </Text>
          <View className="space-y-3">
            {pastPods.map((pod) => (
              <TouchableOpacity 
                key={pod.id}
                onPress={() => router.push(`/arena/${pod.id}`)}
                className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[20px] p-4 flex-row items-center justify-between active:bg-[#F3F4F6]"
              >
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-[Outfit_600SemiBold] text-[#111827] mb-1" numberOfLines={1}>
                    {pod.topic}
                  </Text>
                  <View className="flex-row items-center">
                    <Clock color="#9CA3AF" size={12} className="mr-1" />
                    <Text className="text-xs font-[PlusJakartaSans_500Medium] text-[#9CA3AF]">
                      Ended {pod.endedAt}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs font-[PlusJakartaSans_700Bold] text-[#047857] bg-[#ECFDF5] px-2 py-1 rounded-lg">
                  {pod.userResult === 'won' ? '+25 XP' : '+5 XP'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

