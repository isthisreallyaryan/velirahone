import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  Dimensions,
  Keyboard
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ShieldAlert, X, Link as LinkIcon, Target, Send, Quote } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export interface CitationModalProps {
  isVisible: boolean;
  messageContent: string;
  onClose: () => void;
  onSubmit: (citationUrl: string, rationale: string) => void;
}

export default function CitationModal({ 
  isVisible, 
  messageContent, 
  onClose, 
  onSubmit 
}: CitationModalProps) {
  const [url, setUrl] = useState('');
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Physics values for the bottom sheet and backdrop
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 16, stiffness: 120, mass: 0.8 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(height, { duration: 250 }, (finished) => {
        if (finished) {
          runOnJS(resetForm)();
        }
      });
    }
  }, [isVisible]);

  const resetForm = () => {
    setUrl('');
    setRationale('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = () => {
    if (!url.trim()) return;
    setIsSubmitting(true);
    Keyboard.dismiss();
    
    // Simulating the RPC call to the verification AI/community queue
    setTimeout(() => {
      onSubmit(url, rationale);
      handleClose();
    }, 800);
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 101,
  }));

  // Prevent rendering entirely if perfectly hidden to save GPU cycles
  if (!isVisible && translateY.value === height) return null;

  return (
    <>
      {/* Frosted Backdrop */}
      <Animated.View style={backdropStyle} pointerEvents={isVisible ? 'auto' : 'none'}>
        <BlurView tint="dark" intensity={30} style={StyleSheet.absoluteFill}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={handleClose} 
          />
        </BlurView>
      </Animated.View>

      {/* The Organic Glass Sheet */}
      <Animated.View 
        style={[sheetStyle, styles.sheetContainer]} 
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View className="bg-[rgba(255,255,255,0.92)] border-t border-l border-r border-[rgba(255,255,255,0.95)] rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl shadow-[#111827]/10">
            
            {/* Drag Handle Indicator */}
            <View className="w-12 h-1.5 bg-[#E5E7EB] rounded-full self-center mb-6" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#FFF7ED] border border-[#FED7AA] items-center justify-center mr-3">
                  <ShieldAlert color="#EA580C" size={20} />
                </View>
                <View>
                  <Text className="text-xl font-[Outfit_700Bold] text-[#111827]">
                    Initiate Fact-Check
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Target color="#EA580C" size={12} className="mr-1" />
                    <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#EA580C] uppercase tracking-wider">
                      Costs 1 Token
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                onPress={handleClose}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center active:bg-[#E5E7EB]"
              >
                <X color="#6B7280" size={18} />
              </TouchableOpacity>
            </View>

            {/* Target Claim Context */}
            <View className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[20px] p-4 mb-6 flex-row">
              <Quote color="#9CA3AF" size={16} className="mr-2 mt-0.5" />
              <Text className="flex-1 text-sm font-[PlusJakartaSans_500Medium] text-[#6B7280] italic leading-relaxed">
                "{messageContent}"
              </Text>
            </View>

            {/* URL Input */}
            <View className="mb-4">
              <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#111827] uppercase tracking-wider mb-2 ml-1">
                Primary Source URL
              </Text>
              <View className="flex-row items-center bg-[#FAFAFA] border border-[#E5E7EB] rounded-[24px] px-4 py-3 focus:border-[#047857] focus:bg-[#ECFDF5]">
                <LinkIcon color="#9CA3AF" size={18} className="mr-3" />
                <TextInput
                  className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#111827]"
                  placeholder="https://..."
                  placeholderTextColor="#9CA3AF"
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={url}
                  onChangeText={setUrl}
                />
              </View>
            </View>

            {/* Rationale Input */}
            <View className="mb-6">
              <Text className="text-xs font-[PlusJakartaSans_600SemiBold] text-[#111827] uppercase tracking-wider mb-2 ml-1">
                Context (Optional)
              </Text>
              <View className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-[24px] px-4 py-3">
                <TextInput
                  className="w-full h-20 text-base font-[PlusJakartaSans_500Medium] text-[#111827] text-left"
                  placeholder="Specify exactly where the source debunks the claim..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={rationale}
                  onChangeText={setRationale}
                />
              </View>
            </View>

            {/* Submit Action */}
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={!url.trim() || isSubmitting}
              className={`w-full flex-row justify-center items-center rounded-[24px] py-4 shadow-md ${
                !url.trim() 
                  ? 'bg-[#E5E7EB] shadow-none' 
                  : 'bg-[#111827] shadow-[#111827]/20 active:opacity-80'
              }`}
            >
              <Text className={`text-lg font-[Outfit_600SemiBold] mr-2 ${
                !url.trim() ? 'text-[#9CA3AF]' : 'text-[#FAFAFA]'
              }`}>
                {isSubmitting ? 'Verifying Coordinates...' : 'Submit Citation'}
              </Text>
              {!isSubmitting && (
                <Send color={!url.trim() ? '#9CA3AF' : '#FAFAFA'} size={18} />
              )}
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
});

