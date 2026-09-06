import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Play, Pause, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface ThreadPlayerProps {
  duration: number; // in seconds
  pins?: number[];  // array of timestamps in seconds
  isMe?: boolean;
}

export default function ThreadPlayer({ duration, pins = [], isMe = false }: ThreadPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Animated progress for the playback head
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= duration) {
            setIsPlaying(false);
            progressAnim.value = withTiming(0, { duration: 300 });
            return 0;
          }
          progressAnim.value = withTiming(next / duration, { duration: 1000, easing: Easing.linear });
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlayback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(!isPlaying);
  };

  const jumpToPin = async (time: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentTime(time);
    progressAnim.value = withTiming(time / duration, { duration: 300 });
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`,
    };
  });

  return (
    <View className="w-64 max-w-full">
      <View className="flex-row items-center mb-2">
        {/* Play/Pause Control */}
        <TouchableOpacity 
          onPress={togglePlayback}
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 shadow-sm ${
            isMe ? 'bg-[#FAFAFA] shadow-[#111827]/10' : 'bg-[#ECFDF5] border border-[#D1FAE5] shadow-[#047857]/5'
          }`}
        >
          {isPlaying ? (
            <Pause color={isMe ? "#111827" : "#047857"} size={18} />
          ) : (
            <Play color={isMe ? "#111827" : "#047857"} size={18} style={{ marginLeft: 3 }} />
          )}
        </TouchableOpacity>

        {/* Timeline & Scrubber */}
        <View className="flex-1 justify-center relative h-8">
          {/* Base Track */}
          <View className={`h-1.5 w-full rounded-full overflow-hidden ${isMe ? 'bg-[#374151]' : 'bg-[#E5E7EB]'}`}>
            {/* Active Progress Fill */}
            <Animated.View 
              style={animatedProgressStyle} 
              className={`h-full ${isMe ? 'bg-[#FAFAFA]' : 'bg-[#047857]'}`} 
            />
          </View>

          {/* Absolute Timestamp Pins */}
          {pins.map((pinTime, index) => {
            const positionPercent = (pinTime / duration) * 100;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => jumpToPin(pinTime)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ left: `${positionPercent}%`, position: 'absolute' }}
                className="items-center -ml-1.5"
              >
                <View className="w-3 h-3 rounded-full bg-[#EA580C] border-2 border-[#FFF7ED] shadow-sm shadow-[#EA580C]/20 z-10" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Meta Data Row: Timestamps & Pinned Quotes */}
      <View className="flex-row justify-between items-start mt-1">
        <View className="flex-row space-x-2">
          <Text className={`text-[10px] font-[PlusJakartaSans_600SemiBold] ${isMe ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Dynamic Pin Labels */}
        {pins.length > 0 && (
          <View className="flex-col items-end space-y-1">
            {pins.map((pin, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => jumpToPin(pin)}
                className="flex-row items-center bg-[#FFF7ED] px-2 py-1 rounded-full border border-[#FED7AA]"
              >
                <MapPin color="#EA580C" size={10} className="mr-1" />
                <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#EA580C]">
                  Pin @ {formatTime(pin)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

