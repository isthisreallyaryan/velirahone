import React from 'react';
import { View, TouchableOpacity, ViewProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInUp, FadeInDown, Springify } from 'react-native-reanimated';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'glass' | 'mint' | 'peach' | 'solid';
  radius?: 'md' | 'lg' | 'xl';
  animated?: boolean;
  animationDirection?: 'up' | 'down' | 'none';
  delay?: number;
  onPress?: () => void;
  className?: string;
}

export default function Card({
  children,
  variant = 'glass',
  radius = 'lg',
  animated = false,
  animationDirection = 'up',
  delay = 0,
  onPress,
  className = '',
  ...props
}: CardProps) {
  // Organic Glass Design System Mappings
  const variantStyles = {
    glass: 'bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] shadow-sm shadow-[#111827]/5',
    mint: 'bg-[#ECFDF5] border border-[#D1FAE5] shadow-sm shadow-[#047857]/5',
    peach: 'bg-[#FFF7ED] border border-[#FED7AA] shadow-sm shadow-[#EA580C]/5',
    solid: 'bg-[#FAFAFA] border border-[#E5E7EB]',
  };

  const radiusStyles = {
    md: 'rounded-[16px]',
    lg: 'rounded-[24px]',
    xl: 'rounded-[32px]',
  };

  const baseStyle = `${variantStyles[variant]} ${radiusStyles[radius]} p-5 ${className}`;

  // Determine Animation wrapper
  const getAnimatedEntry = () => {
    if (!animated || animationDirection === 'none') return undefined;
    const animation = animationDirection === 'up' ? FadeInUp : FadeInDown;
    return animation.delay(delay).springify().damping(14).stiffness(200);
  };

  const animationSpec = getAnimatedEntry();

  // If it's a structural layout container without interaction
  if (!onPress) {
    if (animationSpec) {
      return (
        <Animated.View entering={animationSpec} className={baseStyle} {...props}>
          {children}
        </Animated.View>
      );
    }
    return (
      <View className={baseStyle} {...props}>
        {children}
      </View>
    );
  }

  // If it's an interactive element (like a Pod entry in the Arena feed)
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  if (animationSpec) {
    return (
      <AnimatedTouchable 
        entering={animationSpec} 
        onPress={onPress} 
        activeOpacity={0.7}
        className={baseStyle} 
        {...(props as any)}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      className={baseStyle} 
      {...(props as any)}
    >
      {children}
    </TouchableOpacity>
  );
}

