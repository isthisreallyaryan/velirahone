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
        // On successful registration, immediately push to the 3D values calibration
        router.push('/(auth)/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Existing users bypass onboarding and jump straight into the Arena feed
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
      className="flex-1 bg-[#F8FAFC] justify-center px-6"
    >
      <View className="mb-10">
        <Text className="text-4xl font-[Outfit_700Bold] text-[#0F172A] tracking-tight mb-2">
          {isSignUp ? 'Claim Your Stance' : 'Enter the Arena'}
        </Text>
        <Text className="text-base font-[PlusJakartaSans_500Medium] text-[#64748B]">
          {isSignUp 
            ? 'Forge an identity built on your core values.' 
            : 'Sign in to access your pods and verified facts.'}
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <View className="flex-row items-center bg-[rgba(255,255,255,0.72)] border border-[rgba(255,255,255,0.90)] rounded-[24px] px-4 py-4 shadow-sm shadow-[#0F172A]/5">
          <Mail color="#64748B" size={20} className="mr-3" />
          <TextInput
            className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#0F172A]"
            placeholder="Email address"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="flex-row items-center bg-[rgba(255,255,255,0.72)] border border-[rgba(255,255,255,0.90)] rounded-[24px] px-4 py-4 shadow-sm shadow-[#0F172A]/5">
          <Lock color="#64748B" size={20} className="mr-3" />
          <TextInput
            className="flex-1 text-base font-[PlusJakartaSans_500Medium] text-[#0F172A]"
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {errorMessage ? (
        <View className="flex-row items-center bg-[#FFE4E6] rounded-2xl px-4 py-3 mb-6 border border-[#FDA4AF]">
          <AlertCircle color="#E11D48" size={18} className="mr-2" />
          <Text className="flex-1 text-sm font-[PlusJakartaSans_500Medium] text-[#9F1239]">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity 
        onPress={handleAuthentication}
        disabled={isLoading}
        className="flex-row justify-center items-center bg-[#0F172A] rounded-[24px] py-4 shadow-md shadow-[#0F172A]/20 active:opacity-80 mb-6"
      >
        {isLoading ? (
          <ActivityIndicator color="#F8FAFC" />
        ) : (
          <>
            <Text className="text-[#F8FAFC] text-lg font-[Outfit_600SemiBold] mr-2">
              {isSignUp ? 'Begin Calibration' : 'Sign In'}
            </Text>
            <ArrowRight color="#F8FAFC" size={20} />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
      }}>
        <Text className="text-center text-[#64748B] text-sm font-[PlusJakartaSans_600SemiBold]">
          {isSignUp ? 'Already mapped your values? ' : 'New to the debate? '}
          <Text className="text-[#0F172A]">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

