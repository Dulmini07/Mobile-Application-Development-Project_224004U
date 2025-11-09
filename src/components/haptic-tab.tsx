import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: PressableProps) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        Haptics.selectionAsync(); // short vibration
        props.onPress?.(e);
      }}
    />
  );
}
