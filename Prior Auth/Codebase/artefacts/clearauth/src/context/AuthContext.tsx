import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, USER_PROFILES } from "@/lib/utils";

interface AuthContextType {
  role: Role | null;
  user: typeof USER_PROFILES[Role] | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("clearauth_role") as Role | null;
    if (storedRole && USER_PROFILES[storedRole]) {
      setRole(storedRole);
    }
  }, []);

  const login = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem("clearauth_role", newRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("clearauth_role");
    window.location.href = "/login";
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
