import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
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

// Keep the splash screen visible while fonts and global state initialize
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
    // If the font fails to load, throw an error to trigger an error boundary
    if (fontError) throw fontError;

    // Once fonts are successfully loaded, unmount the splash screen gracefully
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Return null to let the native splash screen persist
  }

  return (
    <>
      {/* 
        Strict Light Mode enforcement.
        The Luminous Glass aesthetic requires a dark status bar text over the Alabaster canvas.
      */}
      <StatusBar style="dark" translucent />
      
      {/* 
        The primary routing stack.
        (tabs) serves as the authenticated core experience.
        (auth) manages the sign-in and spatial 3D onboarding flows.
      */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
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
    </>
  );
}
