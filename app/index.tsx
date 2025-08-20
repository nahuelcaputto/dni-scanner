import { Redirect } from "expo-router";
import { useAuth } from "../src/api/AuthContext";

export default function Index() {
  const { token, hydrating } = useAuth();
  if (hydrating) return null; // opcional: mostrar un Splash/Loader
  return <Redirect href={token ? "/(app)/home" : "/(auth)/login"} />;
}
