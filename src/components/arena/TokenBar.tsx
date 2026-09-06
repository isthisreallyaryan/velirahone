import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  FadeIn
} from 'react-native-reanimated';
import { Target } from 'lucide-react-native';

export interface TokenBarProps {
  currentTokens: number;
  maxTokens?: number;
  className?: string;
}

// Individual animated token dot
const TokenDot = ({ isActive, index }: { isActive: boolean; index: number }) => {
  const activeAnim = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    // Spring physics give a satisfying "pop" when a token is spent or replenished
    activeAnim.value = withSpring(isActive ? 1 : 0, {
      damping: 12,
      stiffness: 200,
      mass: 0.8
    });
  }, [isActive]);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        activeAnim.value,
        [0, 1],
        ['#E5E7EB', '#047857'] // Muted Slate to Deep Sage (Luminous Mint palette)
      ),
      transform: [
        { scale: 1 + (activeAnim.value * 0.2) } // Subtly larger when active
      ]
    };
  });

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 50)}
      style={[animatedDotStyle, styles.dot]} 
    />
  );
};

export default function TokenBar({ 
  currentTokens, 
  maxTokens = 5,
  className = '' 
}: TokenBarProps) {
  
  // Create an array representing the max tokens to map over
  const tokensArray = Array.from({ length: maxTokens }, (_, i) => i + 1);

  return (
    <View className={`flex-row items-center justify-between bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-full px-4 py-2 shadow-sm shadow-[#111827]/5 ${className}`}>
      
      {/* Label & Icon */}
      <View className="flex-row items-center">
        <Target color={currentTokens > 0 ? "#047857" : "#9CA3AF"} size={14} className="mr-2" />
        <Text className={`text-xs font-[PlusJakartaSans_700Bold] uppercase tracking-wider ${
          currentTokens > 0 ? 'text-[#111827]' : 'text-[#9CA3AF]'
        }`}>
          {currentTokens > 0 ? 'Truth-Seeking Active' : 'Tokens Depleted'}
        </Text>
      </View>

      {/* Token Indicators */}
      <View className="flex-row space-x-1.5 ml-4">
        {tokensArray.map((index) => (
          <TokenDot 
            key={index} 
            index={index}
            isActive={index <= currentTokens} 
          />
        ))}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  }
});
