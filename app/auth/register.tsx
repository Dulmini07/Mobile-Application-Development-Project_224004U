import { registerApi } from "@/src/services/authApi";
import { setAuth } from "@/src/store/authSlice";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(4, "Too short").required("Password required"),
});

export default function RegisterScreen() {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setStatus }) => {
        try {
          const user = await registerApi(values);

          dispatch(setAuth({ user, token: "LOCAL_REG_TOKEN" }));
          router.replace("/(tabs)");
        } catch (e: any) {
          setStatus({ general: "Registration failed" });
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, status }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Welcome — please register</Text>

          {/* USERNAME */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={values.username}
              onChangeText={handleChange("username")}
            />
          </View>
          {errors.username && <Text style={styles.error}>{errors.username}</Text>}

          {/* EMAIL */}
          <View style={[styles.inputContainer, { marginTop: 20 }]}>
            <Feather name="mail" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={values.email}
              onChangeText={handleChange("email")}
              keyboardType="email-address"
            />
          </View>
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          {/* PASSWORD */}
          <View style={[styles.inputContainer, { marginTop: 20 }]}>
            <Feather name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
            />
          </View>
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {status?.general && <Text style={styles.error}>{status.general}</Text>}

          <TouchableOpacity
            onPress={handleSubmit as any}
            style={styles.loginButton}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={{ marginTop: 18 }}
          >
            <Text style={styles.registerText}>
              Already have an account?{" "}
              <Text style={styles.registerLink}>Login</Text>
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
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 178,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 12, color: "#061422" },
  subtitle: { fontSize: 13, color: "#9AA4B2", marginBottom: 28 },

  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 18, // increased horizontal padding for more space
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E6EE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    width: "96%",
    marginTop: 32,
  },
  // larger gap between icon and placeholder text
  icon: { marginRight: 16 },
  input: {
    flex: 1,
    fontSize: 16,
  },

  loginButton: {
    marginTop: 60,
    backgroundColor: "#2c92ffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    alignItems: "center",
    elevation: 3,
    minWidth: "80%",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  registerText: { textAlign: "center", fontSize: 14, color: "#555" },
  registerLink: { color: "#2c92ff", fontWeight: "600" },

  error: {
    color: "red",
    fontSize: 13,
    marginTop: 6,
    alignSelf: "flex-start",
    marginLeft: "7%",
  },
});
