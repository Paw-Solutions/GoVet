import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { getIdToken } from "../utils/googleAuth";

type AuthContextValue = {
  idToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  loginWithToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "govet_auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setIdToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    const token = await getIdToken();
    setIdToken(token);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const loginWithToken = (token: string) => {
    setIdToken(token);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const logout = () => {
    setIdToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      idToken,
      isAuthenticated: !!idToken,
      isLoading,
      login,
      loginWithToken,
      logout,
    }),
    [idToken, isLoading]
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
