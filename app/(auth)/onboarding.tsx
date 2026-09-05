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

// 3D Glass Core (The Morphing Crystal)
function GlassCore({ isFractured }: { isFractured: boolean }) {
  return (
    <mesh scale={isFractured ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        color={isFractured ? "#047857" : "#FAFAFA"} 
        transmission={0.9} 
        opacity={1} 
        metalness={0.1} 
        roughness={0.05} 
        ior={1.5} 
        thickness={2}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ECFDF5" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#FFF7ED" />
    </mesh>
  );
}

const QUESTIONS = [
  { axis: 'fiscal', text: "Should the government heavily regulate markets to protect the vulnerable, or deregulate to let the private sector build wealth?" },
  { axis: 'social', text: "Should the state actively preserve its ancient culture and traditions, or adapt laws to support progressive social definitions?" },
  { axis: 'authority', text: "During a massive disruptive protest, do you prioritize the absolute right to dissent, or deploy forces to maintain absolute public order?" },
  { axis: 'welfare', text: "Should healthcare and higher education be completely tax-funded, or treated as privatized, user-funded services?" }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setValuesVector = useUserStore((state) => state.setValuesVector);
  
  const [step, setStep] = useState(0); 
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ fiscal: 0.5, social: 0.5, authority: 0.5, welfare: 0.5 });

  // Animation Values
  const fractureProgress = useSharedValue(0);
  const cardTranslateX = useSharedValue(0);
  const cardRotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
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
    <View className="flex-1 bg-[#FAFAFA]">
      <View className="absolute inset-0 h-[50%] mt-10">
        <Canvas>
          <GlassCore isFractured={step > 0} />
        </Canvas>
      </View>

      {step === 0 && (
        <Animated.View style={animatedCounterStyle} className="flex-1 justify-center items-center px-6 mt-32">
          <Text className="text-8xl font-[Outfit_700Bold] text-[#111827] tracking-tighter">
            37%
          </Text>
          <Text className="text-xl font-[Outfit_600SemiBold] text-[#111827] mt-4 text-center">
            of friendships fracture over politics.
          </Text>
          <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280] mt-2 text-center">
            We turned complex humans into rigid party labels. The system broke how we connect.
          </Text>
        </Animated.View>
      )}

      {step === 1 && (
        <View className="flex-1 justify-end pb-20 px-6">
          <Text className="text-center text-[#6B7280] font-[PlusJakartaSans_600SemiBold] mb-4 tracking-widest uppercase text-xs">
            Axis {questionIndex + 1} / 4 — {QUESTIONS[questionIndex].axis}
          </Text>
          <Animated.View 
            style={animatedCardStyle}
            className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-8 shadow-lg shadow-[#111827]/5"
          >
            <Text className="text-2xl font-[Outfit_600SemiBold] text-[#111827] text-center leading-snug">
              {QUESTIONS[questionIndex].text}
            </Text>
            <View className="flex-row justify-between mt-10">
              <TouchableOpacity 
                onPress={() => handleAnswer('left')}
                className="w-16 h-16 rounded-full bg-[#FFF7ED] items-center justify-center border border-[#FED7AA]"
              >
                <X color="#EA580C" size={28} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleAnswer('right')}
                className="w-16 h-16 rounded-full bg-[#ECFDF5] items-center justify-center border border-[#D1FAE5]"
              >
                <Check color="#047857" size={28} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {step === 2 && (
        <View className="flex-1 justify-end pb-20 px-6">
          <View className="bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] p-8 shadow-lg shadow-[#111827]/5 items-center">
            <Text className="text-3xl font-[Outfit_700Bold] text-[#111827] mb-2 text-center">
              Coordinates Locked.
            </Text>
            <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280] text-center mb-8">
              We match you by your moral architecture, logic, and integrity.
            </Text>
            <TouchableOpacity 
              onPress={finalizeOnboarding}
              className="w-full flex-row justify-center items-center bg-[#111827] rounded-[24px] py-4 shadow-md shadow-[#111827]/20 active:opacity-80"
            >
              <Text className="text-[#FAFAFA] text-lg font-[Outfit_600SemiBold] mr-2">
                Enter The Arena
              </Text>
              <ArrowRight color="#FAFAFA" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

