import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator } from 'react-native';
import { store as realStore, persistor } from '../src/store';

// ✅ Guarantee only one Redux store instance (avoids reinitialization)
const store = (globalThis as any).__APP_STORE__ ?? ((globalThis as any).__APP_STORE__ = realStore);

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* Redux Persist Gate ensures saved data loads before UI renders */}
      <PersistGate loading={<ActivityIndicator size="large" color="#007AFF" />} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="details/[id]" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
