import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig?.extra ?? {};

export type LoginPayload = { username: string; password: string };

export async function login(
  payload: LoginPayload
): Promise<{ token: string } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { token: string };
    return data;
  } catch (e) {
    console.warn("login error", e);
    return null;
  }
}
