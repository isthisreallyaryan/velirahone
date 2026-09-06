import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolateColor,
  Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export interface BreathingCanvasProps {
  heatLevel?: number; // 0 (Calm) to 100 (High Heat)
  children?: React.ReactNode;
}

export default function BreathingCanvas({ heatLevel = 0, children }: BreathingCanvasProps) {
  // Reanimated shared values for organic, non-linear breathing loops
  const breathe1 = useSharedValue(0);
  const breathe2 = useSharedValue(0);
  const heatProgress = useSharedValue(heatLevel / 100);

  useEffect(() => {
    // Orb 1 breathes on an 8-second cycle
    breathe1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Orb 2 breathes on a staggered 11-second cycle to prevent repeating patterns
    breathe2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    // Smoothly interpolates the entire background aesthetic based on debate velocity
    heatProgress.value = withTiming(heatLevel / 100, { duration: 3000 });
  }, [heatLevel]);

  // Top Left Atmospheric Orb
  const orb1Style = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      heatProgress.value,
      [0, 1],
      ['#ECFDF5', '#FFF7ED'] // Transitions from Luminous Mint to Warm Peach
    );
    return {
      backgroundColor: bgColor,
      transform: [
        { scale: 1 + breathe1.value * 0.3 },
        { translateX: breathe1.value * 40 },
        { translateY: breathe1.value * 30 }
      ],
    };
  });

  // Bottom Right Atmospheric Orb
  const orb2Style = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      heatProgress.value,
      [0, 1],
      ['#D1FAE5', '#FED7AA'] // Transitions from Deep Mint to Deep Peach
    );
    return {
      backgroundColor: bgColor,
      transform: [
        { scale: 1.2 + breathe2.value * 0.2 },
        { translateX: breathe2.value * -50 },
        { translateY: breathe2.value * -40 }
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* The Foundational Pure Canvas */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FAFAFA' }]} />
      
      {/* The Breathing Entities */}
      <Animated.View style={[styles.orb1, orb1Style]} />
      <Animated.View style={[styles.orb2, orb2Style]} />

      {/* 
        The Great Equalizer. 
        A maximum-intensity blur forces the hard-edged circles into a flawlessly smooth, 
        premium gradient mesh, hiding all the mathematical geometry underneath.
      */}
      <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
      
      {/* 
        Additional Gallery White overlay to ensure text contrast remains absolute 
        and the aesthetic stays incredibly premium and understated.
      */}
      <View 
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(250, 250, 250, 0.4)' }]} 
        pointerEvents="none" 
      />

      {/* The App's Content Layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width,
    top: -width * 0.4,
    left: -width * 0.4,
    opacity: 0.7,
  },
  orb2: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    bottom: -width * 0.5,
    right: -width * 0.4,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});

