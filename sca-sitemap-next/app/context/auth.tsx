"use client";

/**
 * context/auth.tsx
 * ─────────────────────────────────────────────────────────────
 * Manages JWT token, login/logout state, and route protection.
 * Calls api.login() from the services layer — no raw fetch here.
 * ─────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/app/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await apiLogin(username, password);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      router.push("/");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
