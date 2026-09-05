import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';

// Hold the native splash screen until fonts are parsed to prevent unstyled text flashes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
  });

  useEffect(() => {
    if (fontError) throw fontError;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // GestureHandlerRootView is strictly required at the root for react-native-reanimated spring physics
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Enforce dark status bar icons over the Gallery White canvas */}
      <StatusBar style="dark" translucent />
      
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          // Applies the Gallery White base across all stack screens
          contentStyle: { backgroundColor: '#FAFAFA' },
          animation: 'fade'
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="arena/[id]" 
          options={{ 
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal' 
          }} 
        />
        <Stack.Screen 
          name="chat/[id]" 
          options={{ 
            animation: 'slide_from_right' 
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
