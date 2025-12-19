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
  sessionToken: string | null; // Cambia de idToken a sessionToken
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

const TOKEN_STORAGE_KEY = "govet_session_token"; // Renómbralo para evitar confusiones futuras

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      // Opción básica: podrías validar el expiration si quieres, aquí solo lo cargamos
      setSessionToken(storedToken);
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUserEmail(payload.email || null);
      } catch {
        setUserEmail(null);
      }
    }
    setIsLoading(false);
  }, []);

  // Nuevo login: pide idToken, pide sessionToken al backend y lo guarda
  const login = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const idToken = await getIdToken();

      // Llama al backend /login
      const resp = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return { success: false, error: errorData.detail || "Login falló" };
      }

      const data = await resp.json();
      setSessionToken(data.sessionToken);
      setUserEmail(data.email || null);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.sessionToken);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Error en login",
      };
    }
  };

  // Permite login programático (por ejemplo, con un idToken GSI)
  const loginWithToken = async (
    idToken: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Llama al backend /login
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return { success: false, error: errorData.detail || "Login falló" };
      }

      const data = await resp.json();
      setSessionToken(data.sessionToken);
      setUserEmail(data.email || null);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.sessionToken);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || "Login falló" };
    }
  };

  const logout = () => {
    setSessionToken(null);
    setUserEmail(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      sessionToken,
      isAuthenticated: !!sessionToken,
      isLoading,
      userEmail,
      login,
      loginWithToken,
      logout,
    }),
    [sessionToken, isLoading, userEmail]
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