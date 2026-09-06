import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Handshake, MessageCircle, Search, Swords, UserPlus } from 'lucide-react-native';

// Pulling live dynamic state for connections
import { useUserStore } from '../../src/store/useUserStore';

export default function FriendsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Data Subscription
  const friends = useUserStore((state) => state.friends) || [];

  const filteredFriends = friends.filter(friend => 
    friend.pseudonym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <Text className="text-3xl font-[Outfit_700Bold] text-[#111827] tracking-tight">
            Handshakes
          </Text>
          <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280] mt-1">
            Your trusted debate network
          </Text>
        </View>

        {/* Search Bar (Organic Glass) */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 mb-8">
          <View className="flex-row items-center bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] px-4 py-3 shadow-sm shadow-[#111827]/5">
            <Search color="#6B7280" size={20} className="mr-3" />
            <TextInput
              className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#111827]"
              placeholder="Search by pseudonym..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Friends List */}
        <View className="px-6">
          {friends.length === 0 ? (
            <Animated.View entering={FadeInUp.delay(200).springify()} className="items-center justify-center py-12 border border-dashed border-[#D1D5DB] rounded-[32px] bg-[#FAFAFA]">
              <View className="w-16 h-16 rounded-full bg-[#ECFDF5] items-center justify-center mb-4 border border-[#D1FAE5]">
                <Handshake color="#047857" size={32} />
              </View>
              <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827] mb-2">
                No Handshakes Yet
              </Text>
              <Text className="text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280] text-center px-8">
                Complete a 24-hour pod and offer a handshake to debaters who argued with logic and integrity.
              </Text>
            </Animated.View>
          ) : (
            <View className="space-y-4">
              {filteredFriends.map((friend, index) => (
                <Animated.View key={friend.id} entering={FadeInUp.delay(150 + index * 50).springify()}>
                  <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] p-4 shadow-sm shadow-[#111827]/5 flex-row items-center">
                    
                    {/* Avatar */}
                    <View className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] items-center justify-center mr-4">
                      <Text className="text-lg font-[Outfit_700Bold] text-[#047857]">
                        {friend.initials}
                      </Text>
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <Text className="text-base font-[Outfit_600SemiBold] text-[#111827] mb-1">
                        {friend.pseudonym}
                      </Text>
                      <View className="flex-row items-center">
                        <Swords color="#6B7280" size={12} className="mr-1" />
                        <Text className="text-xs font-[PlusJakartaSans_500Medium] text-[#6B7280]">
                          {friend.mutualPods} Mutual {friend.mutualPods === 1 ? 'Pod' : 'Pods'}
                        </Text>
                        
                        <View className="w-1 h-1 rounded-full bg-[#D1D5DB] mx-2" />
                        
                        <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#047857]">
                          {friend.alignmentScore}% Alignment
                        </Text>
                      </View>
                    </View>

                    {/* Direct Message Action */}
                    <TouchableOpacity 
                      onPress={() => router.push(`/chat/${friend.id}`)}
                      className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E5E7EB] items-center justify-center active:bg-[#ECFDF5] active:border-[#D1FAE5]"
                    >
                      <MessageCircle color="#111827" size={20} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

