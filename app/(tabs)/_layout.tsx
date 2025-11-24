import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticTab } from '@/src/components/haptic-tab';
import { RootState } from '@/src/store';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // 🔥 Get user from Redux Auth
  const user = useSelector((state: RootState) => state.auth.user);

  // 🔥 Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
    }
  }, [user]);

  // compute tab bar style: add top padding + height so icons sit lower
  // keep dark-mode background color when colorScheme === 'dark'
  const tabBarStyle = {
    paddingTop: 10,
    height: 100,
    ...(colorScheme === 'dark' ? { backgroundColor: '#15181fff' } : {}),
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // apply the computed tabBarStyle (includes padding/height and optional dark bg)
        tabBarStyle,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
  name="index"
  options={{
    title: "Home",
   tabBarIcon: ({ color }) => (
      <Feather name="home" size={26} color={color} />
    ),
  }}
/>

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
             <Feather name="search" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => (
             <Feather name="heart" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
             <Feather name="user" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
