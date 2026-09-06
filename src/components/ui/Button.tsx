import React from 'react';
import { 
  Text, 
  Pressable, 
  ActivityIndicator, 
  View, 
  StyleSheet 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps extends React.ComponentProps<typeof Pressable> {
  label: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  hapticFeedback = 'light',
  fullWidth = true,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  className = '',
  ...props
}: ButtonProps) {
  // Reanimated Spring Physics for Tactile Touch
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.9, { duration: 100 });
    
    if (hapticFeedback !== 'none') {
      const hapticStyle = 
        hapticFeedback === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy :
        hapticFeedback === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : 
        Haptics.ImpactFeedbackStyle.Light;
      Haptics.impactAsync(hapticStyle);
    }
    
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
    onPressOut?.(e);
  };

  // Organic Glass Design System Mappings
  const variantStyles = {
    primary: 'bg-[#111827] border border-[#111827] shadow-md shadow-[#111827]/20',
    secondary: 'bg-[#ECFDF5] border border-[#D1FAE5]',
    glass: 'bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] shadow-sm shadow-[#111827]/5',
    ghost: 'bg-transparent border border-transparent',
    danger: 'bg-[#FFF7ED] border border-[#FED7AA]',
  };

  const textStyles = {
    primary: 'text-[#FAFAFA]',
    secondary: 'text-[#047857]',
    glass: 'text-[#111827]',
    ghost: 'text-[#6B7280]',
    danger: 'text-[#EA580C]',
  };

  const sizeStyles = {
    sm: 'py-2.5 px-4 rounded-[16px]',
    md: 'py-4 px-6 rounded-[24px]',
    lg: 'py-5 px-8 rounded-[32px]',
  };

  const textSizeStyles = {
    sm: 'text-sm font-[Outfit_600SemiBold]',
    md: 'text-base font-[Outfit_600SemiBold]',
    lg: 'text-lg font-[Outfit_700Bold]',
  };

  const isDisabled = disabled || isLoading;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={animatedStyle}
      className={`
        flex-row items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FAFAFA' : '#111827'} 
          className="mr-2" 
        />
      ) : leftIcon ? (
        <View className="mr-2">{leftIcon}</View>
      ) : null}

      <Text 
        className={`
          ${textStyles[variant]}
          ${textSizeStyles[size]}
        `}
      >
        {isLoading ? 'Processing...' : label}
      </Text>

      {!isLoading && rightIcon && (
        <View className="ml-2">{rightIcon}</View>
      )}
    </AnimatedPressable>
  );
}

