import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Mic, Square, MapPin, Trash2, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface VoiceRecorderProps {
  onSend: (audioData: any, pins: number[]) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pins, setPins] = useState<number[]>([]);

  // Physics values for the expanding pill and pulsing indicator
  const containerWidth = useSharedValue(48); // Starts as a circle (w-12)
  const pulseAnim = useSharedValue(0.5);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000);
      
      // Warm Peach breathing pulse for the recording indicator
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = 0.5;
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(true);
    setDuration(0);
    setPins([]);
    
    // Smoothly expand into the full Organic Glass command bar
    containerWidth.value = withSpring(300, { damping: 16, stiffness: 120 });
    contentOpacity.value = withTiming(1, { duration: 300 });
    
    // In production: await Audio.setAudioModeAsync(...) and start recording
  };

  const handleDropPin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPins((prev) => [...prev, duration]);
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRecording(false);
    containerWidth.value = withSpring(48, { damping: 16, stiffness: 120 });
    contentOpacity.value = withTiming(0, { duration: 200 });
    onCancel();
  };

  const handleSend = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(false);
    containerWidth.value = withSpring(48, { damping: 16, stiffness: 120 });
    contentOpacity.value = withTiming(0, { duration: 200 });
    
    // In production: stop recording, get URI, and pass alongside pins
    onSend({ uri: 'mock_audio_uri' }, pins);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    width: containerWidth.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
  }));

  return (
    <Animated.View 
      style={animatedContainerStyle}
      className={`h-12 flex-row items-center overflow-hidden rounded-full ${
        isRecording 
          ? 'bg-[rgba(255,255,255,0.95)] border border-[rgba(255,255,255,1)] shadow-md shadow-[#111827]/10' 
          : 'bg-[#ECFDF5] border border-[#D1FAE5]'
      }`}
    >
      {!isRecording ? (
        <TouchableOpacity 
          onPress={handleStartRecording}
          className="w-12 h-12 items-center justify-center"
        >
          <Mic color="#047857" size={20} />
        </TouchableOpacity>
      ) : (
        <Animated.View 
          style={animatedContentStyle} 
          className="flex-1 flex-row items-center justify-between px-2"
        >
          {/* Left: Timer & Pulse */}
          <View className="flex-row items-center ml-2">
            <Animated.View style={animatedPulseStyle} className="w-2.5 h-2.5 rounded-full bg-[#EA580C] mr-2" />
            <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#111827] w-10">
              {formatTime(duration)}
            </Text>
          </View>

          {/* Center: Timestamp Pin Action */}
          <TouchableOpacity 
            onPress={handleDropPin}
            className="flex-row items-center bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1.5 rounded-full active:bg-[#FFEDD5]"
          >
            <MapPin color="#EA580C" size={14} className="mr-1.5" />
            <Text className="text-xs font-[PlusJakartaSans_700Bold] text-[#EA580C] uppercase tracking-wider">
              Drop Pin ({pins.length})
            </Text>
          </TouchableOpacity>

          {/* Right: Cancel or Send */}
          <View className="flex-row items-center space-x-1 mr-1">
            <TouchableOpacity 
              onPress={handleCancel}
              className="w-9 h-9 rounded-full items-center justify-center active:bg-[#F3F4F6]"
            >
              <Trash2 color="#9CA3AF" size={18} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSend}
              className="w-9 h-9 rounded-full bg-[#111827] items-center justify-center active:bg-[#1F2937]"
            >
              <Send color="#FAFAFA" size={16} style={{ marginLeft: -2 }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

