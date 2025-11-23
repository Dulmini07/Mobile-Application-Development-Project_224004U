import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

type Props = {
  name?: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/**
 * Feather-based IconSymbol
 * - Use <IconSymbol name="chevron-left" size={24} color="#000" />
 * - Exports both named and default to match different import styles.
 */
export const IconSymbol: React.FC<Props> = ({ name = 'circle', size = 24, color = '#000', style }) => {
  return <Feather name={name as any} size={size} color={color} style={style} />;
};

export default IconSymbol;
