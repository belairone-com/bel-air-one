import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type MaisonUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  vip: boolean;
  createdAt: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  users: MaisonUser[];
  currentUser: MaisonUser | null;
  guestAccess: boolean;
  register: (input: RegisterInput) => { ok: boolean; message?: string };
  login: (email: string, password: string) => { ok: boolean; message?: string };
  continueAsGuest: () => void;
  logout: () => void;
  approveVip: (userId: string) => void;
  revokeVip: (userId: string) => void;
};

const USERS_KEY = 'bel_air_one_users';
const SESSION_KEY = 'bel_air_one_session';
const GUEST_KEY = 'bel_air_one_guest_access';

const adminUser: MaisonUser = {
  id: 'admin-bel-air-one',
  name: 'Administrateur BEL AIR ONE',
  email: 'admin@belairone.ch',
  password: 'BelAirOneAdmin2026!',
  role: 'admin',
  vip: true,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  const parsed = stored ? (JSON.parse(stored) as MaisonUser[]) : [];
  const hasAdmin = parsed.some((user) => user.email === adminUser.email);
  const users = hasAdmin ? parsed : [adminUser, ...parsed];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<MaisonUser[]>(loadUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [guestAccess, setGuestAccess] = useState(() => localStorage.getItem(GUEST_KEY) === 'true');

  const persistUsers = (nextUsers: MaisonUser[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  };

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const register = ({ name, email, password }: RegisterInput) => {
    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);

    if (!cleanName || !cleanEmail || !password) {
      return { ok: false, message: 'Veuillez compléter tous les champs.' };
    }

    if (password.length < 8) {
      return { ok: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }

    if (users.some((user) => user.email === cleanEmail)) {
      return { ok: false, message: 'Un compte existe déjà avec cette adresse.' };
    }

    const newUser: MaisonUser = {
      id: `user-${crypto.randomUUID()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role: 'user',
      vip: false,
      createdAt: new Date().toISOString(),
    };

    persistUsers([...users, newUser]);
    localStorage.setItem(SESSION_KEY, newUser.id);
    localStorage.removeItem(GUEST_KEY);
    setCurrentUserId(newUser.id);
    setGuestAccess(false);
    return { ok: true };
  };

  const login = (email: string, password: string) => {
    const cleanEmail = normalizeEmail(email);
    const foundUser = users.find((user) => user.email === cleanEmail && user.password === password);

    if (!foundUser) {
      return { ok: false, message: 'Identifiants incorrects.' };
    }

    localStorage.setItem(SESSION_KEY, foundUser.id);
    localStorage.removeItem(GUEST_KEY);
    setCurrentUserId(foundUser.id);
    setGuestAccess(false);
    return { ok: true };
  };

  const continueAsGuest = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem(GUEST_KEY, 'true');
    setCurrentUserId(null);
    setGuestAccess(true);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(GUEST_KEY);
    setCurrentUserId(null);
    setGuestAccess(false);
  };

  const approveVip = (userId: string) => {
    if (currentUser?.role !== 'admin') return;
    persistUsers(users.map((user) => (user.id === userId ? { ...user, vip: true } : user)));
  };

  const revokeVip = (userId: string) => {
    if (currentUser?.role !== 'admin') return;
    persistUsers(users.map((user) => (user.id === userId ? { ...user, vip: false } : user)));
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, guestAccess, register, login, continueAsGuest, logout, approveVip, revokeVip }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}