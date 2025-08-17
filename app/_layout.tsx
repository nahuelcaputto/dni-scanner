import { Stack } from "expo-router";
import { AuthProvider } from "../src/api/AuthContext";
import "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
