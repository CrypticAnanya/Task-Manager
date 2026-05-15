import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

import { authApi } from "../services/api";
import type { AuthResponse, User } from "../types/api";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { full_name: string; email: string; password: string; confirm_password: string; role: "ADMIN" | "MEMBER" }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistAuth(payload: AuthResponse) {
  localStorage.setItem("accessToken", payload.access);
  localStorage.setItem("refreshToken", payload.refresh);
  localStorage.setItem("authUser", JSON.stringify(payload.user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("authUser");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem("accessToken")));

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((freshUser) => {
        setUser(freshUser);
        localStorage.setItem("authUser", JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAdmin: user?.role === "ADMIN",
      login: async (email, password) => {
        const payload = await authApi.login({ email, password });
        persistAuth(payload);
        setUser(payload.user);
        setAccessToken(payload.access);
        toast.success(`Welcome back, ${payload.user.full_name}`);
      },
      register: async (formPayload) => {
        const payload = await authApi.register(formPayload);
        persistAuth(payload);
        setUser(payload.user);
        setAccessToken(payload.access);
        toast.success(payload.user.role === "ADMIN" ? "Admin workspace unlocked" : "Account created");
      },
      logout: async () => {
        const refresh = localStorage.getItem("refreshToken");
        await authApi.logout(refresh).catch(() => undefined);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        setUser(null);
        setAccessToken(null);
        toast.success("Signed out");
      },
    }),
    [accessToken, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
