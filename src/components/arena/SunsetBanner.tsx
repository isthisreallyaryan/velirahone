import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Sunset, Lock, Handshake } from 'lucide-react-native';

export interface SunsetBannerProps {
  hoursRemaining: number;
  minutesRemaining: number;
  onReviewHandshakes: () => void;
}

export default function SunsetBanner({ 
  hoursRemaining, 
  minutesRemaining, 
  onReviewHandshakes 
}: SunsetBannerProps) {
  // A subtle, slow-breathing pulse to indicate time is running out without inducing anxiety
  const pulseAnim = useSharedValue(0.4);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
    backgroundColor: '#FED7AA', // Warm Peach core glow
  }));

  const isCritical = hoursRemaining === 0;

  return (
    <Animated.View 
      entering={FadeInDown.springify().damping(16).stiffness(100)}
      className="w-full px-4 mb-4 z-40"
    >
      <View className="overflow-hidden rounded-[24px] border border-[rgba(254,215,170,0.90)] shadow-lg shadow-[#EA580C]/10">
        
        {/* The Sunset Glass Layer */}
        <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
        <View className="absolute inset-0 bg-[rgba(255,247,237,0.75)]" />
        
        {/* Breathing Glow Indicator */}
        <Animated.View 
          style={[StyleSheet.absoluteFill, animatedGlowStyle]} 
          className="opacity-20 mix-blend-overlay"
        />

        <View className="p-4 flex-row items-center">
          
          {/* Iconography */}
          <View className="w-12 h-12 rounded-full bg-[#FFF7ED] border border-[#FED7AA] items-center justify-center mr-4">
            {isCritical ? (
              <Lock color="#EA580C" size={24} />
            ) : (
              <Sunset color="#EA580C" size={24} />
            )}
          </View>

          {/* Countdown & Context */}
          <View className="flex-1 mr-2">
            <Text className="text-sm font-[Outfit_700Bold] text-[#111827] mb-0.5">
              {isCritical ? 'Pod Locking Soon' : 'The Sun is Setting'}
            </Text>
            <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#EA580C]">
              {hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}{minutesRemaining}m remaining
            </Text>
            <Text className="text-[10px] font-[PlusJakartaSans_500Medium] text-[#6B7280] mt-1 pr-2 leading-tight">
              Debate ends permanently. Extend handshakes to debaters who argued with integrity.
            </Text>
          </View>

          {/* Action Trigger */}
          <TouchableOpacity 
            onPress={onReviewHandshakes}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-[#111827] shadow-md shadow-[#111827]/20 items-center justify-center"
          >
            <Handshake color="#FAFAFA" size={20} />
          </TouchableOpacity>
          
        </View>
      </View>
    </Animated.View>
  );
}

