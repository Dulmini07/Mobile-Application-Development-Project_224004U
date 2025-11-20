import { logout, RootState } from '@/src/store';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>
        Logged in as: {user?.username ?? user?.name ?? 'User'}
      </Text>

      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}
