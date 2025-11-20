import { loginApi } from '@/src/services/authApi';
import { setAuth } from '@/src/store/authSlice';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginScreen() {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setStatus }) => {
        try {
          const data = await loginApi(values);
          // DummyJSON returns token and user; normalize as expected
          dispatch(setAuth({ user: data, token: data.token }));
          router.replace('/(tabs)');
        } catch (e: any) {
          setStatus({ general: 'Invalid username or password' });
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, status }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange('username')}
          />
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {status?.general && <Text style={styles.error}>{status.general}</Text>}

          <Button title="Login" onPress={handleSubmit as any} />

          <Pressable onPress={() => router.push('/auth/register')} style={{ marginTop: 12 }}>
            <Text style={{ color: '#007AFF', textAlign: 'center' }}>
              Don't have an account? Register
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  error: { color: 'red', marginBottom: 10 },
});
