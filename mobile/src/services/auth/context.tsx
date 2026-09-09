import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api, type role, type user } from '../api';

type authState = {
  user: user | null;
  signIn: (email: string, password: string, role: role) => Promise<void>;
  signOut: () => Promise<void>;
};

const authContext = createContext<authState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);

  const value = useMemo<authState>(
    () => ({
      user,
      async signIn(email, password, role) {
        setUser(await api.auth.signIn(email, password, role));
      },
      async signOut() {
        await api.auth.signOut();
        setUser(null);
      },
    }),
    [user]
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(authContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
