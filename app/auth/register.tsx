import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Register</Text>
      <TextInput placeholder="Username" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Password" secureTextEntry style={{ borderWidth: 1, marginBottom: 20, padding: 8 }} />
      <Button title="Create Account" onPress={() => router.replace('/auth/login')} />
    </View>
  );
}
