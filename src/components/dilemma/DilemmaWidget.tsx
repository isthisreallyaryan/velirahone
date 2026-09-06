import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeIn,
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  Layout
} from 'react-native-reanimated';
import { Clock, CheckCircle2, Users, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface DilemmaOption {
  id: string;
  text: string;
  percentage?: number; // Only revealed after voting
}

export interface DilemmaWidgetProps {
  question: string;
  options: DilemmaOption[];
  hoursRemaining: number;
  friendsVotedCount?: number;
  onVote: (optionId: string) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function DilemmaWidget({
  question,
  options,
  hoursRemaining,
  friendsVotedCount = 0,
  onVote,
}: DilemmaWidgetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelection = async (optionId: string) => {
    if (selectedId) return; // Prevent double voting
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedId(optionId);
    
    // In production, this fires the vector-alignment logic to the store
    setTimeout(() => onVote(optionId), 500); 
  };

  return (
    <Animated.View 
      entering={FadeInDown.springify().damping(16)}
      layout={Layout.springify()}
      className="w-full bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-6 shadow-sm shadow-[#111827]/5"
    >
      {/* Header: Timer & Status */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#D1FAE5]">
          <Clock color="#047857" size={14} className="mr-1.5" />
          <Text className="text-xs font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider">
            {hoursRemaining}h Remaining
          </Text>
        </View>

        {friendsVotedCount > 0 && (
          <View className="flex-row items-center">
            <Users color="#6B7280" size={14} className="mr-1.5" />
            <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#6B7280]">
              {friendsVotedCount} Handshakes voted
            </Text>
          </View>
        )}
      </View>

      {/* The Dilemma Prompt */}
      <Text className="text-2xl font-[Outfit_700Bold] text-[#111827] leading-snug mb-6">
        {question}
      </Text>

      {/* Options Container */}
      <View className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const hasVoted = selectedId !== null;
          const isUnselected = hasVoted && !isSelected;

          return (
            <AnimatedTouchable
              key={option.id}
              layout={Layout.springify()}
              onPress={() => handleSelection(option.id)}
              disabled={hasVoted}
              activeOpacity={0.8}
              className={`w-full overflow-hidden rounded-[20px] border ${
                isSelected 
                  ? 'bg-[#ECFDF5] border-[#047857] shadow-md shadow-[#047857]/10' 
                  : isUnselected
                    ? 'bg-[#FAFAFA] border-[#E5E7EB] opacity-60'
                    : 'bg-[#FAFAFA] border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
            >
              {/* Progress Bar Fill (Only visible after voting) */}
              {hasVoted && (
                <Animated.View 
                  entering={FadeIn.duration(400)}
                  className={`absolute top-0 bottom-0 left-0 ${isSelected ? 'bg-[#D1FAE5]' : 'bg-[#E5E7EB]'}`}
                  style={{ width: `${option.percentage || 0}%`, opacity: 0.5 }}
                />
              )}

              <View className="px-5 py-4 flex-row items-center justify-between relative z-10">
                <Text 
                  className={`flex-1 text-base font-[PlusJakartaSans_600SemiBold] mr-4 ${
                    isSelected ? 'text-[#047857]' : 'text-[#111827]'
                  }`}
                >
                  {option.text}
                </Text>

                {/* State Icons */}
                {isSelected ? (
                  <Animated.View entering={FadeIn.springify()}>
                    <CheckCircle2 color="#047857" size={20} />
                  </Animated.View>
                ) : hasVoted ? (
                  <Animated.Text entering={FadeIn.springify()} className="text-sm font-[Outfit_700Bold] text-[#6B7280]">
                    {option.percentage}%
                  </Animated.Text>
                ) : (
                  <View className="w-5 h-5 rounded-full border border-[#D1D5DB]" />
                )}
              </View>
            </AnimatedTouchable>
          );
        })}
      </View>

      {/* Post-Vote Context / Next Steps */}
      {selectedId && (
        <Animated.View entering={FadeInDown.springify().delay(300)} className="mt-6 pt-5 border-t border-[rgba(17,24,39,0.05)]">
          <TouchableOpacity className="flex-row items-center justify-between active:opacity-70">
            <View>
              <Text className="text-sm font-[Outfit_600SemiBold] text-[#111827] mb-0.5">
                Vector Recalibrated
              </Text>
              <Text className="text-[10px] font-[PlusJakartaSans_500Medium] text-[#6B7280]">
                See how your coordinates shifted
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center">
              <ChevronRight color="#111827" size={16} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

