import React, { useState, useRef } from 'react';
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
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Send, Mic, Play, Pause, Quote, MapPin } from 'lucide-react-native';

// Live dynamic state integration
import { useChatStore } from '../../src/store/useChatStore';
import { useUserStore } from '../../src/store/useUserStore';

export default function DirectMessageScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // State Subscriptions
  const [inputText, setInputText] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const { messages, sendMessage } = useChatStore();
  const friend = useUserStore((state) => state.friends.find(f => f.id === id)) || {
    pseudonym: "CipherWeaver",
    alignmentScore: 82,
    initials: "CW"
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(id as string, inputText, 'text');
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const togglePlay = (messageId: string) => {
    setPlayingId(playingId === messageId ? null : messageId);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === 'me';
    const isVoice = item.type === 'voice';
    const isDilemmaRef = item.type === 'dilemma_reference';

    return (
      <Animated.View entering={FadeInUp.springify()} className={`mb-5 max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}>
        
        {isDilemmaRef && (
          <View className={`flex-row items-center mb-1 ml-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <Quote color="#047857" size={12} className="mr-1" />
            <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#047857] uppercase tracking-wider">
              Re: Global Dilemma
            </Text>
          </View>
        )}

        <View 
          className={`px-4 py-3 border shadow-sm ${
            isMe 
              ? 'bg-[#111827] border-[#111827] shadow-[#111827]/10 rounded-[20px] rounded-br-[4px]' 
              : 'bg-[rgba(255,255,255,0.70)] border-[rgba(255,255,255,0.90)] shadow-[#111827]/5 rounded-[20px] rounded-bl-[4px]'
          }`}
        >
          {isVoice ? (
            <View className="flex-row items-center w-48">
              <TouchableOpacity 
                onPress={() => togglePlay(item.id)}
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isMe ? 'bg-[#FAFAFA]' : 'bg-[#ECFDF5] border border-[#D1FAE5]'
                }`}
              >
                {playingId === item.id ? (
                  <Pause color={isMe ? "#111827" : "#047857"} size={18} />
                ) : (
                  <Play color={isMe ? "#111827" : "#047857"} size={18} style={{ marginLeft: 3 }} />
                )}
              </TouchableOpacity>
              
              <View className="flex-1">
                {/* Simulated Waveform Line */}
                <View className="h-1 w-full bg-opacity-20 rounded-full overflow-hidden flex-row items-center bg-[#6B7280]">
                  <View className={`h-full w-1/3 ${isMe ? 'bg-[#FAFAFA]' : 'bg-[#047857]'}`} />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className={`text-[10px] font-[PlusJakartaSans_600SemiBold] ${isMe ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    0:14
                  </Text>
                  <Text className={`text-[10px] font-[PlusJakartaSans_600SemiBold] ${isMe ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    1:24
                  </Text>
                </View>
              </View>

              {/* Timestamp Pin */}
              {item.pins && item.pins.length > 0 && (
                <View className="absolute -bottom-6 left-12 flex-row items-center bg-[#FFF7ED] px-2 py-1 rounded-full border border-[#FED7AA]">
                  <MapPin color="#EA580C" size={10} className="mr-1" />
                  <Text className="text-[10px] font-[PlusJakartaSans_700Bold] text-[#EA580C]">
                    Pin @ 0:45
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text className={`text-base font-[PlusJakartaSans_500Medium] ${isMe ? 'text-[#FAFAFA]' : 'text-[#111827]'}`}>
              {item.content}
            </Text>
          )}
        </View>

        <Text className={`text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#9CA3AF] mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
          {item.timestamp}
        </Text>
      </Animated.View>
    );
  };

  // Injecting mock chat data for structural visibility
  const displayMessages = messages.length > 0 ? messages : [
    { id: '1', senderId: 'friend', type: 'dilemma_reference', content: 'You voted to decentralize power. I actually think regulating their practices makes more structural sense. Let me explain.', timestamp: '10:42 AM' },
    { id: '2', senderId: 'friend', type: 'voice', pins: [45], timestamp: '10:44 AM' },
    { id: '3', senderId: 'me', type: 'text', content: 'Listening now. The point you made at 0:45 about regulatory capture is exactly why I lean toward decentralization.', timestamp: '10:48 AM' }
  ];

  return (
    <View className="flex-1 bg-[#FAFAFA]">
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
            
            <View className="flex-1 items-center px-4 flex-row justify-center">
              <View className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] items-center justify-center mr-2">
                <Text className="text-xs font-[Outfit_700Bold] text-[#047857]">
                  {friend.initials}
                </Text>
              </View>
              <View>
                <Text className="text-sm font-[Outfit_700Bold] text-[#111827] text-center" numberOfLines={1}>
                  {friend.pseudonym}
                </Text>
                <Text className="text-[10px] font-[PlusJakartaSans_600SemiBold] text-[#047857] text-center">
                  {friend.alignmentScore}% Alignment
                </Text>
              </View>
            </View>
            
            <View className="w-10 h-10" />
          </View>
        </View>

        {/* Chat Timeline */}
        <FlatList
          ref={flatListRef}
          data={displayMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 120, paddingBottom: 24, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Organic Glass Input Area */}
        <Animated.View entering={FadeInDown.springify()} className="px-4 pb-6 pt-2 bg-transparent">
          <View className="flex-row items-center bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[32px] pl-4 pr-2 py-2 shadow-sm shadow-[#111827]/5">
            <TextInput
              className="flex-1 max-h-24 text-base font-[PlusJakartaSans_500Medium] text-[#111827] pt-2 pb-2"
              placeholder="Send a message..."
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
    </View>
  );
}

