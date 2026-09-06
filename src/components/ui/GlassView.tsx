import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

export interface GlassViewProps extends ViewProps {
  children?: React.ReactNode;
  intensity?: number;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  overlayOpacity?: number;
  className?: string;
}

export default function GlassView({
  children,
  intensity = 70,
  radius = 'lg',
  overlayOpacity = 0.5,
  className = '',
  style,
  ...props
}: GlassViewProps) {
  
  // Mapping precisely to the Organic Glass radius architecture
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-[16px]',
    md: 'rounded-[24px]',
    lg: 'rounded-[32px]',
    xl: 'rounded-[40px]',
    full: 'rounded-full',
  };

  return (
    <View 
      className={`overflow-hidden border border-[rgba(255,255,255,0.90)] shadow-lg shadow-[#111827]/5 ${radiusStyles[radius]} ${className}`}
      style={style}
      {...props}
    >
      {/* 
        The foundational native iOS/Android frosted blur layer 
      */}
      <BlurView 
        tint="light" 
        intensity={intensity} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* 
        The Luminous overlay. 
        Without this, pure blurs can look muddy over complex backgrounds.
        This injects the Gallery White tint directly into the glass for that premium architectural finish.
      */}
      <View 
        className="absolute inset-0" 
        style={{ backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})` }} 
      />
      
      {/* Content wrapper ensures text/icons sit safely above the blur stack */}
      <View className="relative z-10 w-full h-full">
        {children}
      </View>
    </View>
  );
}

