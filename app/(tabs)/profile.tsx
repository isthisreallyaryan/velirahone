import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ShieldCheck, Settings, LogOut, CheckCircle, Target, Activity } from 'lucide-react-native';

// Pulling live dynamic state for precise vector coordinates and tokens
import { useUserStore } from '../../src/store/useUserStore';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Dynamic Data Subscriptions
  const { profile, valuesVector, factCheckTokens } = useUserStore();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  const renderVectorAxis = (label: string, leftLabel: string, rightLabel: string, score: number) => (
    <View className="mb-5">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-[Outfit_600SemiBold] text-[#111827]">{label}</Text>
        <Text className="text-sm font-[PlusJakartaSans_700Bold] text-[#047857]">
          {score.toFixed(2)}
        </Text>
      </View>
      <View className="h-3 w-full bg-[#FAFAFA] rounded-full border border-[#E5E7EB] overflow-hidden flex-row">
        {/* Luminous Mint fill representing the exact coordinate */}
        <Animated.View 
          className="h-full bg-[#047857] rounded-full"
          style={{ width: `${score * 100}%` }}
        />
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#6B7280] uppercase tracking-wider">{leftLabel}</Text>
        <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#6B7280] uppercase tracking-wider">{rightLabel}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      className="flex-1 bg-[#FAFAFA]"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header & Identity */}
      <View className="px-6 pt-16 pb-6">
        <Animated.View entering={FadeInDown.delay(100).springify()} className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-3xl font-[Outfit_700Bold] text-[#111827] tracking-tight mr-2">
                {profile?.pseudonym || 'NeonMango'}
              </Text>
              {profile?.isKYCVerified && (
                <ShieldCheck color="#047857" size={24} />
              )}
            </View>
            <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280]">
              {profile?.realName || 'Identity Encrypted'}
            </Text>
          </View>
          <View className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] items-center justify-center">
            <Text className="text-xl font-[Outfit_700Bold] text-[#047857]">
              {profile?.pseudonym?.substring(0, 2).toUpperCase() || 'NM'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Fact-Check Tokens HUD */}
      <Animated.View entering={FadeInUp.delay(150).springify()} className="px-6 mb-8">
        <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-6 shadow-sm shadow-[#111827]/5">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Target color="#111827" size={20} className="mr-2" />
              <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827]">
                Daily Quota
              </Text>
            </View>
            <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#6B7280]">
              Resets at Midnight
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <View 
                key={index} 
                className={`w-12 h-12 rounded-full border-2 items-center justify-center ${
                  index <= (factCheckTokens || 5) 
                    ? 'bg-[#ECFDF5] border-[#D1FAE5]' 
                    : 'bg-[#FAFAFA] border-[#E5E7EB]'
                }`}
              >
                {index <= (factCheckTokens || 5) && (
                  <CheckCircle color="#047857" size={20} />
                )}
              </View>
            ))}
          </View>
          <Text className="text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280] leading-relaxed text-center">
            You have {factCheckTokens || 5} truth-seeking challenges remaining. Deploy them strategically when a claim demands verification.
          </Text>
        </View>
      </Animated.View>

      {/* Continuous Values Vector */}
      <Animated.View entering={FadeInUp.delay(200).springify()} className="px-6 mb-8">
        <Text className="text-lg font-[Outfit_600SemiBold] text-[#111827] mb-4">
          Ideological Coordinates
        </Text>
        <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-6 shadow-sm shadow-[#111827]/5">
          {renderVectorAxis('Fiscal Philosophy', 'Regulated', 'Free Market', valuesVector?.fiscal || 0.51)}
          {renderVectorAxis('Social Heritage', 'Progressive', 'Traditional', valuesVector?.social || 0.73)}
          {renderVectorAxis('State Authority', 'Civil Liberties', 'Order & Law', valuesVector?.authority || 0.42)}
          {renderVectorAxis('Welfare Structure', 'Universal', 'Privatized', valuesVector?.welfare || 0.65)}
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View entering={FadeInUp.delay(250).springify()} className="px-6 space-y-3">
        <TouchableOpacity className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[20px] p-4 flex-row items-center justify-between active:bg-[#ECFDF5] active:border-[#D1FAE5]">
          <View className="flex-row items-center">
            <Settings color="#111827" size={20} className="mr-3" />
            <Text className="text-base font-[PlusJakartaSans_600SemiBold] text-[#111827]">
              Account Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSignOut}
          className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[20px] p-4 flex-row items-center justify-between active:bg-[#FFF7ED] active:border-[#FED7AA]"
        >
          <View className="flex-row items-center">
            <LogOut color="#EA580C" size={20} className="mr-3" />
            <Text className="text-base font-[PlusJakartaSans_600SemiBold] text-[#EA580C]">
              Secure Disconnect
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

