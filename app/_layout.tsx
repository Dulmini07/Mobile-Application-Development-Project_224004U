import { ThemeProvider } from '@/src/context/ThemeContext';
import { persistor, store } from '@/src/store';
import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" color="#007AFF" />} persistor={persistor}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="details/[id]" />
          </Stack>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
