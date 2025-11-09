import React from 'react';
import { View, ViewProps, Platform, StyleProp, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};
export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#007AFF',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#0A84FF',
  },
};

export function ThemedView({ children, style, lightColor, darkColor, pointerEvents, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Map RN's pointerEvents prop to style on web to avoid deprecation warning
  const webPointerStyle =
    Platform.OS === 'web' && pointerEvents
      ? ({
          pointerEvents:
            pointerEvents === 'none' || pointerEvents === 'box-none' ? 'none' : 'auto',
        } as ViewStyle)
      : undefined;

  return (
    <View
      {...otherProps}
      // Only pass prop on native; web uses style mapping
      pointerEvents={Platform.OS !== 'web' ? pointerEvents : undefined}
      style={[{ backgroundColor }, style as StyleProp<ViewStyle>, webPointerStyle]}
    >
      {children}
    </View>
  );
}

export default ThemedView;
