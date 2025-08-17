import { Redirect } from "expo-router";
import { useAuth } from "../src/api/AuthContext";

export default function Index() {
  const { token } = useAuth();
  return <Redirect href={token ? "/(app)/home" : "/(auth)/login"} />;
}
