import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Swords, Users, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#111827', // Deep Onyx for active states
        tabBarInactiveTintColor: '#6B7280', // Flint for inactive
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 32 : 24,
          left: 24,
          right: 24,
          height: 64,
          elevation: 0, // Removes Android default shadow
          borderTopWidth: 0,
          backgroundColor: 'transparent',
        },
        // The Organic Glass background layer
        tabBarBackground: () => (
          <View 
            className="flex-1 rounded-[32px] overflow-hidden border border-[rgba(255,255,255,0.90)] bg-[rgba(255,255,255,0.50)] shadow-lg shadow-[#111827]/5"
          >
            <BlurView 
              tint="light" 
              intensity={70} 
              style={StyleSheet.absoluteFill} 
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="arena"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Swords color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Users color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
