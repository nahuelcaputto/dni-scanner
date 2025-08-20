import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Storage cross‑platform: WEB → sessionStorage, NATIVE → SecureStore
const storage = {
  async getItem(key: string) {
    if (Platform.OS === "web")
      return Promise.resolve(sessionStorage.getItem(key));
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      sessionStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      sessionStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const TOKEN_KEY = "auth_token";

type AuthState = {
  token: string | null;
  hydrating: boolean;
  setToken: (t: string | null) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthState>({
  token: null,
  hydrating: true,
  setToken: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(TOKEN_KEY);
      setTokenState(saved ?? null);
      setHydrating(false);
    })();
  }, []);

  const setToken = async (t: string | null) => {
    setTokenState(t);
    if (t) await storage.setItem(TOKEN_KEY, t);
    else await storage.removeItem(TOKEN_KEY);
  };

  const signOut = async () => {
    await setToken(null);
  };

  return (
    <AuthCtx.Provider value={{ token, hydrating, setToken, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
