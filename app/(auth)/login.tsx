import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../src/components/PrimaryButton";
import { login } from "../../src/api/auth";
import { useAuth } from "../../src/api/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    const res = await login({ username, password });
    setLoading(false);
    if (!res?.token) {
      Alert.alert("Login fallido", "Revisá tus credenciales");
      return;
    }
    await setToken(res.token); // ← Web: sessionStorage | Native: SecureStore
    router.replace("/(app)/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <PrimaryButton
        label={loading ? "Ingresando..." : "Ingresar"}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
});
