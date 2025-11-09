import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

export function ExternalLink({ url, title }: { url: string; title: string }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)}>
      <Text style={{ color: '#007AFF', textDecorationLine: 'underline' }}>{title}</Text>
    </TouchableOpacity>
  );
}
