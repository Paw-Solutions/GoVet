import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { getIdToken } from "../utils/googleAuth";
import { validateToken, extractEmailFromToken } from "../utils/jwtUtils";

type AuthContextValue = {
  idToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: () => Promise<{ success: boolean; error?: string }>;
  loginWithToken: (
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "govet_auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      // Validar token antes de aceptarlo
      const validation = validateToken(storedToken);
      if (validation.valid) {
        setIdToken(storedToken);
        setUserEmail(validation.email || null);
      } else {
        // Token inválido o no autorizado, limpiar
        console.warn("Token almacenado inválido:", validation.error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await getIdToken();

      // Validar token
      const validation = validateToken(token);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      setIdToken(token);
      setUserEmail(validation.email || null);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Error al iniciar sesión",
      };
    }
  };

  const loginWithToken = async (
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validar token
    const validation = validateToken(token);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    setIdToken(token);
    setUserEmail(validation.email || null);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    return { success: true };
  };

  const logout = () => {
    setIdToken(null);
    setUserEmail(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      idToken,
      isAuthenticated: !!idToken,
      isLoading,
      userEmail,
      login,
      loginWithToken,
      logout,
    }),
    [idToken, isLoading, userEmail]
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
