import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { Canvas } from '@react-three/fiber/native';
import { ArrowRight, Check, X } from 'lucide-react-native';
import { useUserStore } from '../../src/store/useUserStore';

const { width } = Dimensions.get('window');

// 3D Glass Core (Placeholder for the morphing crystal)
function GlassCore({ isFractured }: { isFractured: boolean }) {
  return (
    <mesh scale={isFractured ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        color={isFractured ? "#6B4EFF" : "#E0F2FE"} 
        transmission={0.9} 
        opacity={1} 
        metalness={0} 
        roughness={0.1} 
        ior={1.5} 
        thickness={2}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </mesh>
  );
}

const QUESTIONS = [
  { axis: 'fiscal', text: "Should the government heavily regulate markets to protect the vulnerable, or deregulate to let the private sector build wealth?" },
  { axis: 'social', text: "Should the state actively preserve its ancient culture and traditions, or adapt laws to support progressive social definitions?" },
  { axis: 'authority', text: "During a massive disruptive protest, do you prioritize the absolute right to dissent, or deploy forces to maintain absolute public order?" },
  { axis: 'welfare', text: "Should healthcare and higher education be completely free (tax-funded), or treated as privatized, user-funded services?" }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setValuesVector = useUserStore((state) => state.setValuesVector);
  
  const [step, setStep] = useState(0); // 0: Fracture, 1: Quiz, 2: Convergence
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ fiscal: 0.5, social: 0.5, authority: 0.5, welfare: 0.5 });

  // Animation Values
  const fractureProgress = useSharedValue(0);
  const cardTranslateX = useSharedValue(0);
  const cardRotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Initial fade in and fracture sequence trigger
    opacity.value = withTiming(1, { duration: 800 });
    fractureProgress.value = withDelay(1500, withSpring(37, { damping: 12 }, (finished) => {
      if (finished) {
        setTimeout(() => runOnJS(setStep)(1), 2000);
      }
    }));
  }, []);

  const animatedCounterStyle = useAnimatedStyle(() => {
    return {
      opacity: step === 0 ? 1 : withTiming(0),
      transform: [{ scale: step === 0 ? 1 : withTiming(1.1) }]
    };
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: cardTranslateX.value },
        { rotateZ: `${cardRotate.value}deg` }
      ]
    };
  });

  const handleAnswer = (direction: 'left' | 'right') => {
    // Left = 0.0 (Progressive/Collectivist), Right = 1.0 (Traditional/Market)
    const currentAxis = QUESTIONS[questionIndex].axis as keyof typeof scores;
    const value = direction === 'right' ? 1.0 : 0.0;
    
    setScores(prev => ({ ...prev, [currentAxis]: value }));
    
    // Swipe out animation
    cardTranslateX.value = withTiming(direction === 'right' ? width : -width, { duration: 300 });
    cardRotate.value = withTiming(direction === 'right' ? 15 : -15, { duration: 300 });

    setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex(prev => prev + 1);
        cardTranslateX.value = 0;
        cardRotate.value = 0;
      } else {
        setStep(2);
      }
    }, 350);
  };

  const finalizeOnboarding = () => {
    setValuesVector(scores);
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* 3D Canvas Background */}
      <View className="absolute inset-0 h-[50%] mt-10">
        <Canvas>
          <GlassCore isFractured={step > 0} />
        </Canvas>
      </View>

      {/* Step 0: The Fracture */}
      {step === 0 && (
        <Animated.View style={animatedCounterStyle} className="flex-1 justify-center items-center px-6 mt-32">
          <Text className="text-8xl font-[Outfit_700Bold] text-[#0F172A] tracking-tighter">
            37%
          </Text>
          <Text className="text-xl font-[Outfit_600SemiBold] text-[#0F172A] mt-4 text-center">
            of friendships fracture over politics.
          </Text>
          <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#64748B] mt-2 text-center">
            We turned complex humans into rigid party labels. The system broke how we connect.
          </Text>
        </Animated.View>
      )}

      {/* Step 1: The Values Calibration */}
      {step === 1 && (
        <View className="flex-1 justify-end pb-20 px-6">
          <Text className="text-center text-[#64748B] font-[PlusJakartaSans_600SemiBold] mb-4">
            Axis {questionIndex + 1} of 4: {QUESTIONS[questionIndex].axis.toUpperCase()}
          </Text>
          <Animated.View 
            style={animatedCardStyle}
            className="bg-[rgba(255,255,255,0.72)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-8 shadow-lg shadow-[#0F172A]/5"
          >
            <Text className="text-2xl font-[Outfit_600SemiBold] text-[#0F172A] text-center leading-snug">
              {QUESTIONS[questionIndex].text}
            </Text>
            <View className="flex-row justify-between mt-10">
              <TouchableOpacity 
                onPress={() => handleAnswer('left')}
                className="w-16 h-16 rounded-full bg-[#FFE4E6] items-center justify-center border border-[#FDA4AF]"
              >
                <X color="#E11D48" size={28} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleAnswer('right')}
                className="w-16 h-16 rounded-full bg-[#E0F2FE] items-center justify-center border border-[#7DD3FC]"
              >
                <Check color="#0284C7" size={28} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Step 2: The Convergence */}
      {step === 2 && (
        <View className="flex-1 justify-end pb-20 px-6">
          <View className="bg-[rgba(255,255,255,0.72)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-8 shadow-lg shadow-[#0F172A]/5 items-center">
            <Text className="text-3xl font-[Outfit_700Bold] text-[#0F172A] mb-2 text-center">
              Coordinates Locked.
            </Text>
            <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#64748B] text-center mb-8">
              We match you by your moral architecture, logic, and integrity.
            </Text>
            <TouchableOpacity 
              onPress={finalizeOnboarding}
              className="w-full flex-row justify-center items-center bg-[#0F172A] rounded-[24px] py-4 shadow-md shadow-[#0F172A]/20 active:opacity-80"
            >
              <Text className="text-[#F8FAFC] text-lg font-[Outfit_600SemiBold] mr-2">
                Enter The Arena
              </Text>
              <ArrowRight color="#F8FAFC" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

