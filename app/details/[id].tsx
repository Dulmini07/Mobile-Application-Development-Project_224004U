import React from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsScreen() {
  const { id, title, score, image } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image source={{ uri: image as string }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>{title}</Text>
      <Text style={{ marginTop: 8, fontSize: 16 }}>Score: {score}</Text>
      <Text style={{ marginTop: 8 }}>More details about the match/player coming soon...</Text>
    </View>
  );
}
