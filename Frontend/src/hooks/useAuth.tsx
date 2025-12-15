import React, { createContext, useContext, useMemo, useState } from "react";
import { getIdToken } from "../utils/googleAuth";

type AuthContextValue = {
  idToken: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  loginWithToken: (token: string) => void; // ← añadido
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [idToken, setIdToken] = useState<string | null>(null);

  const login = async () => {
    const token = await getIdToken();
    setIdToken(token);
  };

  const loginWithToken = (token: string) => { // ← añadido
    setIdToken(token);
  };

  const logout = () => {
    setIdToken(null);
  };

  const value = useMemo(
    () => ({
      idToken,
      isAuthenticated: !!idToken,
      login,
      loginWithToken, // ← añadido
      logout,
    }),
    [idToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}