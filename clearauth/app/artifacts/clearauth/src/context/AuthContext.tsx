import { createContext, useContext, useState, ReactNode } from "react";
import { Role, USER_PROFILES } from "@/lib/utils";

interface AuthContextType {
  role: Role | null;
  user: typeof USER_PROFILES[Role] | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read the saved role before the first render so deep links survive a refresh.
  const [role, setRole] = useState<Role | null>(() => {
    try {
      const stored = localStorage.getItem("clearauth_role") as Role | null;
      return stored && USER_PROFILES[stored] ? stored : null;
    } catch {
      return null;
    }
  });

  const login = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem("clearauth_role", newRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("clearauth_role");
    window.location.href = `${import.meta.env.BASE_URL}login`;
  };

  const user = role ? USER_PROFILES[role] : null;

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
