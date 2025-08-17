import React, { createContext, useContext, useState } from "react";

type AuthState = { token: string | null; setToken: (t: string | null) => void };
const AuthCtx = createContext<AuthState>({ token: null, setToken: () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  return (
    <AuthCtx.Provider value={{ token, setToken }}>{children}</AuthCtx.Provider>
  );
}
