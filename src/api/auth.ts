const BASE_URL = "https://TU_API_BASE_URL"; // ←--- PONÉ TU URL

export type LoginPayload = { username: string; password: string };

export async function login(
  payload: LoginPayload
): Promise<{ token: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
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
