import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../src/components/PrimaryButton";
import { login } from "../../src/api/auth";
import { useAuth } from "../../src/api/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    const res = await login({ email, password, rememberMe });
    setLoading(false);
    if (!res?.access_token) {
      Alert.alert("Login fallido", "Revisá tus credenciales");
      return;
    }
    await setToken(res.access_token, rememberMe); // Web: sessionStorage/localStorage. Native: memoria/SecureStore
    router.replace("/(app)/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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

      <Pressable
        onPress={() => setRememberMe((v) => !v)}
        style={styles.rememberRow}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxOn]}>
          {rememberMe ? <Text style={styles.check}>✓</Text> : null}
        </View>
        <Text style={styles.rememberText}>Recordarme</Text>
      </Pressable>

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
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: "#111827", borderColor: "#111827" },
  check: { color: "#fff", fontSize: 14, fontWeight: "900" },
  rememberText: { fontSize: 14 },
});
