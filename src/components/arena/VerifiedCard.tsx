import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { ShieldCheck, ExternalLink, Quote, Target } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface VerifiedCardProps {
  originalClaim: string;
  sourceTitle: string;
  sourceUrl: string;
  excerpt: string;
  challengerName?: string; // Who spent the token
}

export default function VerifiedCard({
  originalClaim,
  sourceTitle,
  sourceUrl,
  excerpt,
  challengerName = "System",
}: VerifiedCardProps) {
  
  const handleOpenSource = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const supported = await Linking.canOpenURL(sourceUrl);
    if (supported) {
      await Linking.openURL(sourceUrl);
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.springify().damping(14).delay(100)}
      layout={Layout.springify()}
      className="my-2 max-w-[90%] self-center w-full"
    >
      {/* 
        The Verified Luminous Glass Container
        Using the Deep Sage / Mint palette to establish absolute, undeniable authority.
      */}
      <View className="bg-[#ECFDF5] border border-[#D1FAE5] shadow-md shadow-[#047857]/10 rounded-[24px] overflow-hidden">
        
        {/* Header: Authority Stamp */}
        <View className="bg-[#047857] px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-4">
            <ShieldCheck color="#FAFAFA" size={18} className="mr-2" />
            <Text className="text-sm font-[Outfit_700Bold] text-[#FAFAFA] tracking-wide">
              CITATION VERIFIED
            </Text>
          </View>
          <View className="flex-row items-center bg-[rgba(255,255,255,0.2)] px-2 py-1 rounded-full">
            <Target color="#FAFAFA" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#FAFAFA] uppercase tracking-wider">
              Token Rewarded
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Context: The Defeated Claim */}
          <View className="mb-4">
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider mb-1 ml-1">
              Challenged Claim
            </Text>
            <View className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[16px] p-3 flex-row items-start opacity-70">
              <Text className="text-xs font-[PlusJakartaSans_500Medium] text-[#6B7280] italic leading-relaxed line-through">
                "{originalClaim}"
              </Text>
            </View>
          </View>

          {/* The Truth: Sourced Excerpt */}
          <View className="mb-5">
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider mb-1 ml-1">
              Verified Reality
            </Text>
            <View className="flex-row">
              <Quote color="#047857" size={18} className="mr-2 mt-1 opacity-50" />
              <Text className="flex-1 text-sm font-[PlusJakartaSans_600SemiBold] text-[#111827] leading-relaxed">
                {excerpt}
              </Text>
            </View>
          </View>

          {/* Action: View Primary Source */}
          <TouchableOpacity 
            onPress={handleOpenSource}
            activeOpacity={0.7}
            className="flex-row items-center justify-between bg-[#FAFAFA] border border-[#D1FAE5] rounded-[16px] p-3 shadow-sm shadow-[#047857]/5"
          >
            <View className="flex-1 mr-3">
              <Text className="text-xs font-[Outfit_700Bold] text-[#111827] mb-0.5" numberOfLines={1}>
                {sourceTitle}
              </Text>
              <Text className="text-[10px] font-[PlusJakartaSans_500Medium] text-[#6B7280]" numberOfLines={1}>
                {sourceUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-[#ECFDF5] items-center justify-center">
              <ExternalLink color="#047857" size={14} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Credit */}
        <View className="px-4 pb-3 pt-1">
          <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#047857] text-center opacity-80">
            Fact-check initiated by {challengerName}
          </Text>
        </View>

      </View>
    </Animated.View>
  );
}

