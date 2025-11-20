import { registerApi } from '@/src/services/authApi';
import { setAuth } from '@/src/store/authSlice';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too short').required('Required'),
});

export default function RegisterScreen() {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setStatus }) => {
        try {
          const user = await registerApi(values);
          // Auto-login locally after registration (DummyJSON doesn't return usable auth token)
          dispatch(setAuth({ user, token: 'LOCAL_REG_TOKEN' }));
          router.replace('/(tabs)');
        } catch (e: any) {
          setStatus({ general: 'Registration failed' });
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, status }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>

          <TextInput style={styles.input} placeholder="Username" value={values.username} onChangeText={handleChange('username')} />
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}

          <TextInput style={styles.input} placeholder="Email" value={values.email} onChangeText={handleChange('email')} />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={values.password} onChangeText={handleChange('password')} />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {status?.general && <Text style={styles.error}>{status.general}</Text>}

          <Button title="Create Account" onPress={handleSubmit as any} />
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
  error: { color: 'red' },
});
