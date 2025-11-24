import { loginApi } from '@/src/services/authApi';
import { setAuth } from '@/src/store/authSlice';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        try {
          const data = await loginApi(values);
          dispatch(setAuth({ user: data, token: data.token }));
          router.replace('/(tabs)');
        } catch (e: any) {
          setStatus({ general: 'Invalid username or password' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        status,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              placeholderTextColor="#999"
            />
          </View>
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              placeholderTextColor="#999"
            />
          </View>
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {status?.general && <Text style={styles.error}>{status.general}</Text>}

          {/* Solid Login Button (matches profile edit button style) */}
          <TouchableOpacity
            onPress={handleSubmit as any}
            disabled={isSubmitting}
            style={[styles.loginButton, isSubmitting && { opacity: 0.8 }]}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            style={{ marginTop: 60 }}
          >
            <Text style={styles.registerText}>
              Don’t have an account? <Text style={styles.registerLink}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 18, // increased horizontal padding for more space
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // larger gap between icon and placeholder text
  icon: { marginRight: 16 },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 50,
    backgroundColor: '#2c92ffff', // match profile edit button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 3,
    minWidth: '80%',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    color: '#2c92ff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },
});
