import SplashScreen from '@/src/components/SplashScreen';
import { SplashScreen as ExpoSplashScreen } from 'expo-router';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { persistor, store } from '@/src/store';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Modal } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ensure native splash doesn't auto-hide before we control it
// (call once at module load)
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

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
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/register" />
              <Stack.Screen name="details/[id]" />
            </Stack>

            {/* Modal ensures splash renders above native UI on Android */}
            <Modal
              visible={showSplash}
              transparent={false}
              animationType="fade"
              presentationStyle="fullScreen"
              hardwareAccelerated={true}
              statusBarTranslucent={true}
              onRequestClose={() => {
                /* prevent Android back button from closing splash */
              }}
            >
              <SplashScreen />
            </Modal>
          </View>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});
