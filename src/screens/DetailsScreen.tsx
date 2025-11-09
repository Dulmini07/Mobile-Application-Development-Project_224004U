import React from 'react';
import { View, Text, Image } from 'react-native';

export default function DetailsScreen({ route }: any) {
  const { item } = route.params; // item passed from HomeScreen
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={{ marginTop: 8 }}>Score: {item.score}</Text>
    </View>
  );
}
