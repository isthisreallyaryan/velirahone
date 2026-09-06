import React, { useState, forwardRef } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword,
  containerClassName = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Reanimated shared value for smooth border and background transitions
  const focusProgress = useSharedValue(0);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  // Interpolating the Organic Glass properties based on focus state
  const animatedContainerStyle = useAnimatedStyle(() => {
    // If there is an error, we lock the container to the Warm Peach error state
    if (error) {
      return {
        backgroundColor: '#FFF7ED',
        borderColor: '#FED7AA',
      };
    }

    return {
      backgroundColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        ['rgba(255,255,255,0.70)', 'rgba(255,255,255,0.95)']
      ),
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        ['rgba(255,255,255,0.90)', '#047857'] // Snaps to Deep Sage on focus
      ),
    };
  });

  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-[PlusJakartaSans_600SemiBold] text-[#111827] mb-2 ml-1">
          {label}
        </Text>
      )}

      <AnimatedView 
        style={animatedContainerStyle}
        className="flex-row items-center rounded-[24px] px-4 py-4 border shadow-sm shadow-[#111827]/5"
      >
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#111827] leading-tight"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-3 p-1 active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPasswordVisible ? (
              <EyeOff color={isFocused ? '#047857' : '#6B7280'} size={20} />
            ) : (
              <Eye color={isFocused ? '#047857' : '#6B7280'} size={20} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View className="ml-3">
            {rightIcon}
          </View>
        )}
      </AnimatedView>

      {error && (
        <Animated.View className="flex-row items-center mt-2 ml-1">
          <AlertCircle color="#EA580C" size={14} className="mr-1.5" />
          <Text className="text-xs font-[PlusJakartaSans_500Medium] text-[#EA580C]">
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;

