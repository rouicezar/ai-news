import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "../types/content";

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "ai-news-auth-user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildDemoUser = (email: string, username = "demo-reader"): User => ({
  id: "viewer_demo",
  username,
  displayName: username,
  bio: "AI 新闻读者",
  role: "user",
  followersCount: 0,
  articlesCount: 0,
  totalLikesCount: 0,
  totalBookmarksCount: 0,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setCurrentUser(JSON.parse(stored) as User);
    }
  }, []);

  const persistUser = useCallback((user: User) => {
    setCurrentUser(user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        throw new Error("请输入邮箱和密码。");
      }

      persistUser(buildDemoUser(email));
    },
    [persistUser],
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      if (!username || !email || !password) {
        throw new Error("请填写用户名、邮箱和密码。");
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        throw new Error("用户名只能包含字母、数字、短横线和下划线。");
      }

      persistUser(buildDemoUser(email, username));
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      register,
      logout,
    }),
    [currentUser, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
