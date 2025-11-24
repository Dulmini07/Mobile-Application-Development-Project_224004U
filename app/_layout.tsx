import { ThemeProvider } from '@/src/context/ThemeContext';
import { persistor, store } from '@/src/store';
import { SplashScreen as ExpoSplashScreen, Stack } from 'expo-router';
import * as SplashScreenAPI from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// call at module load so splash is prevented from auto-hiding
SplashScreenAPI.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // show splash briefly on cold start
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setShowSplash(false); // hide in-app overlay
      // hide native splash after JS is ready
      ExpoSplashScreen.hideAsync().catch(() => {});
    }, 3000); // 3s splash
    return () => clearTimeout(t);
  }, []);

  // Render app and overlay splash on top so that splash always covers initial routes
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" color="#007AFF" />} persistor={persistor}>
        <ThemeProvider>
          <View style={{ flex: 1 }}>
            {/* splash route first so it loads immediately */}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="splash" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/register" />
              <Stack.Screen name="details/[id]" />
            </Stack>
          </View>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
