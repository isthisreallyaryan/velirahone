import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase'; 

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthentication = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Immediate vindication: smooth routing straight to the spatial calibration
        router.push('/(auth)/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Existing users bypass the quiz and are empowered to enter the Arena instantly
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#FAFAFA] justify-center px-6"
    >
      <View className="mb-10">
        <Text className="text-4xl font-[Outfit_700Bold] text-[#111827] tracking-tight mb-2">
          {isSignUp ? 'Claim Your Stance' : 'Enter the Arena'}
        </Text>
        <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#6B7280]">
          {isSignUp 
            ? 'Forge an identity built on your core values.' 
            : 'Sign in to access your pods and verified facts.'}
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        {/* Organic Glass Input */}
        <View className="flex-row items-center bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] px-4 py-4 shadow-sm shadow-[#111827]/5">
          <Mail color="#6B7280" size={20} className="mr-3" />
          <TextInput
            className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#111827]"
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Organic Glass Input */}
        <View className="flex-row items-center bg-[rgba(255,255,255,0.70)] border border-[rgba(255,255,255,0.90)] rounded-[24px] px-4 py-4 shadow-sm shadow-[#111827]/5">
          <Lock color="#6B7280" size={20} className="mr-3" />
          <TextInput
            className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#111827]"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {errorMessage ? (
        <View className="flex-row items-center bg-[#FFF7ED] rounded-2xl px-4 py-3 mb-6 border border-[#FED7AA]">
          <AlertCircle color="#EA580C" size={18} className="mr-2" />
          <Text className="flex-1 text-sm font-[PlusJakartaSans_500Medium] text-[#C2410C]">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity 
        onPress={handleAuthentication}
        disabled={isLoading}
        className="flex-row justify-center items-center bg-[#111827] rounded-[24px] py-4 shadow-md shadow-[#111827]/20 active:opacity-80 mb-6"
      >
        {isLoading ? (
          <ActivityIndicator color="#FAFAFA" />
        ) : (
          <>
            <Text className="text-[#FAFAFA] text-lg font-[Outfit_600SemiBold] mr-2">
              {isSignUp ? 'Begin Calibration' : 'Sign In'}
            </Text>
            <ArrowRight color="#FAFAFA" size={20} />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
      }}>
        <Text className="text-center text-[#6B7280] text-sm font-[PlusJakartaSans_600SemiBold]">
          {isSignUp ? 'Already mapped your values? ' : 'New to the debate? '}
          <Text className="text-[#111827]">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
