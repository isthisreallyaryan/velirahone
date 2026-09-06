import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Send, Mic, ShieldAlert, Target, Flame, CheckCircle } from 'lucide-react-native';

// Live dynamic state integration
import { useArenaStore } from '../../src/store/useArenaStore';
import { useUserStore } from '../../src/store/useUserStore';

export default function LiveArenaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // State Subscriptions
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const { activePods, messages, sendMessage, challengeMessage } = useArenaStore();
  const { factCheckTokens, useToken } = useUserStore();

  const pod = activePods.find(p => p.id === id) || { 
    topic: "Universal Basic Income is structurally unsustainable.", 
    heatLevel: 85,
    hoursRemaining: 14 
  };

  // The Breathing Canvas State - Driven by chat velocity (Heat Level)
  const heatAnim = useSharedValue(pod.heatLevel / 100);

  useEffect(() => {
    // In production, this reacts to real-time message frequency
    heatAnim.value = withTiming(pod.heatLevel / 100, { duration: 2000 });
  }, [pod.heatLevel]);

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      heatAnim.value,
      [0, 1],
      ['#FAFAFA', '#FFF7ED'] // Gallery White to Warm Peach
    );
    return { backgroundColor, flex: 1 };
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(id as string, inputText);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleFactCheck = (messageId: string) => {
    if (factCheckTokens > 0) {
      useToken();
      challengeMessage(messageId);
      // Opens the CitationModal sheet in production
    }
  };

  // Mock messages for layout context
  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === 'me';
    const isVerified = item.status === 'verified';
    const isChallenged = item.status === 'challenged';

    return (
      <Animated.View entering={FadeInUp.springify()} className={`mb-4 max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
        {!isMe && (
          <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#6B7280] mb-1 ml-2">
            {item.pseudonym}
          </Text>
        )}
        
        <View 
          className={`px-4 py-3 rounded-[20px] border shadow-sm ${
            isMe 
              ? 'bg-[#111827] border-[#111827] shadow-[#111827]/10 rounded-br-[4px]' 
              : 'bg-[rgba(255,255,255,0.70)] border-[rgba(255,255,255,0.90)] shadow-[#111827]/5 rounded-bl-[4px]'
          }`}
        >
          <Text className={`text-base font-[PlusJakartaSans_500Medium] ${isMe ? 'text-[#FAFAFA]' : 'text-[#111827]'}`}>
            {item.content}
          </Text>
        </View>

        {/* Fact-Check Status Badges */}
        {isVerified && (
          <View className="flex-row items-center mt-1 ml-2">
            <CheckCircle color="#047857" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider">
              Verified Source
            </Text>
          </View>
        )}
        
        {(!isMe && !isVerified && !isChallenged) && (
          <TouchableOpacity 
            onPress={() => handleFactCheck(item.id)}
            className="flex-row items-center mt-1 ml-2 opacity-50 active:opacity-100"
          >
            <ShieldAlert color="#EA580C" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#EA580C] uppercase tracking-wider">
              Swipe or Tap to Challenge
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <Animated.View style={animatedBackground}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Floating Glass Header */}
        <View className="absolute top-0 left-0 right-0 z-50 pt-14 pb-4 px-4 overflow-hidden border-b border-[rgba(255,255,255,0.90)]">
          <BlurView tint="light" intensity={70} style={StyleSheet.absoluteFill} />
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-[rgba(255,255,255,0.5)] rounded-full">
              <ChevronLeft color="#111827" size={24} />
            </TouchableOpacity>
            
            <View className="flex-1 items-center px-4">
              <Text className="text-sm font-[Outfit_700Bold] text-[#111827] mb-1 text-center" numberOfLines={1}>
                {pod.topic}
              </Text>
              <View className="flex-row items-center space-x-2">
                <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#6B7280]">
                  {pod.hoursRemaining}h remaining
                </Text>
                <View className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                <View className="flex-row items-center">
                  <Flame color={pod.heatLevel > 75 ? "#EA580C" : "#047857"} size={12} className="mr-1" />
                  <Text className={`text-xs font-[PlusJakartaSans_700Bold] uppercase tracking-wider ${pod.heatLevel > 75 ? 'text-[#EA580C]' : 'text-[#047857]'}`}>
                    {pod.heatLevel > 75 ? 'High Heat' : 'Steady'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="w-10 h-10" /> {/* Balancer */}
          </View>
        </View>

        {/* Chat Timeline */}
        <FlatList
          ref={flatListRef}
          data={messages.length > 0 ? messages : [{ id: '1', senderId: 'other', pseudonym: 'NeonMango', content: 'Universal Basic Income removes the incentive to produce.', status: 'none' }]}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 120, paddingBottom: 24, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Fact-Check Token HUD & Input Area */}
        <Animated.View entering={FadeInDown.springify()} className="px-4 pb-6 pt-2 bg-transparent">
          {/* Token Bar HUD */}
          <View className="flex-row items-center justify-between mb-3 px-2">
            <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#6B7280] uppercase tracking-wider">
              Fact-Checks Remaining
            </Text>
            <View className="flex-row space-x-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <View 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index <= factCheckTokens ? 'bg-[#047857]' : 'bg-[#E5E7EB]'
                  }`} 
                />
              ))}
            </View>
          </View>

          {/* Organic Glass Input Pill */}
          <View className="flex-row items-center bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] pl-4 pr-2 py-2 shadow-sm shadow-[#111827]/5">
            <TextInput
              className="flex-1 max-h-24 text-base font-[PlusJakartaSans_500Medium] text-[#111827] pt-2 pb-2"
              placeholder="State your case..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            {inputText.trim() ? (
              <TouchableOpacity 
                onPress={handleSend}
                className="w-10 h-10 rounded-full bg-[#111827] items-center justify-center ml-2"
              >
                <Send color="#FAFAFA" size={18} style={{ marginLeft: -2 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="w-10 h-10 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] items-center justify-center ml-2">
                <Mic color="#047857" size={20} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

