import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type MaisonUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'pauvre';
  vip: boolean;
  createdAt: string;
  updatedAt?: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  users: MaisonUser[];
  currentUser: MaisonUser | null;
  isAdminAccount: boolean;
  guestAccess: boolean;
  isLoadingUsers: boolean;
  register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  continueAsGuest: () => void;
  logout: () => void;
  refreshUsers: () => Promise<void>;
  approveVip: (userId: string) => Promise<void>;
  revokeVip: (userId: string) => Promise<void>;
  setPauvre: (userId: string) => Promise<void>;
  removePauvre: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
};

const USERS_KEY = 'bel_air_one_users';
const SESSION_KEY = 'bel_air_one_session';
const GUEST_KEY = 'bel_air_one_guest_access';

const adminUser: MaisonUser = {
  id: 'admin-bel-air-one',
  name: 'Administrateur BEL AIR ONE',
  email: 'admin@belairone.ch',
  passwordHash: 'fd340f6d98baefb478287da717a58eb2a034b9090b84f3a5810dc00e440e8cdf',
  role: 'admin',
  vip: true,
  createdAt: new Date().toISOString(),
};

const ADMIN_EMAIL = 'admin@belairone.ch';

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function mapSupabaseUser(row: {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user' | 'pauvre';
  vip: boolean;
  created_at: string;
  updated_at?: string;
}): MaisonUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    vip: row.vip,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function loadUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  const parsed = stored
    ? (JSON.parse(stored) as Array<MaisonUser & { password?: string }>).map((user) => ({
        ...user,
        passwordHash: user.passwordHash ?? '',
      }))
    : [];
  const hasAdmin = parsed.some((user) => user.email === adminUser.email);
  const users = hasAdmin ? parsed : [adminUser, ...parsed];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<MaisonUser[]>(loadUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [guestAccess, setGuestAccess] = useState(() => localStorage.getItem(GUEST_KEY) === 'true');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const persistUsers = (nextUsers: MaisonUser[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  };

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId]
  );
  const isAdminAccount = currentUser?.role === 'admin' && currentUser.email === ADMIN_EMAIL;

  const refreshUsers = async () => {
    if (!supabase || !isAdminAccount) return;

    setIsLoadingUsers(true);
    const { data, error } = await supabase.rpc('site_account_list', {
      admin_email: currentUser.email,
      admin_password_hash: currentUser.passwordHash,
    });

    setIsLoadingUsers(false);

    if (error || !data) return;
    persistUsers(data.map(mapSupabaseUser));
  };

  const register = async ({ name, email, password }: RegisterInput) => {
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

    const passwordHash = await hashPassword(password);

    if (supabase) {
      const { data, error } = await supabase.rpc('site_account_register', {
        account_name: cleanName,
        account_email: cleanEmail,
        account_password_hash: passwordHash,
      });

      if (error || !data?.[0]) {
        return { ok: false, message: 'Impossible de créer le compte pour le moment.' };
      }

      const newUser = mapSupabaseUser(data[0]);
      persistUsers([newUser, ...users]);
      localStorage.setItem(SESSION_KEY, newUser.id);
      localStorage.removeItem(GUEST_KEY);
      setCurrentUserId(newUser.id);
      setGuestAccess(false);
      return { ok: true };
    }

    const newUser: MaisonUser = {
      id: `user-${crypto.randomUUID()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
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

  const login = async (email: string, password: string) => {
    const cleanEmail = normalizeEmail(email);
    const passwordHash = await hashPassword(password);
    let availableUsers = users;

    if (supabase) {
      const { data } = await supabase.rpc('site_account_login', {
        account_email: cleanEmail,
        account_password_hash: passwordHash,
      });

      if (data) {
        availableUsers = data.map(mapSupabaseUser);
        persistUsers(availableUsers);
      }
    }

    const foundUser = availableUsers.find((user) => user.email === cleanEmail && user.passwordHash === passwordHash);

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

  const updateVip = async (userId: string, vip: boolean) => {
    if (!isAdminAccount || !currentUser) return;

    if (supabase) {
      await supabase.rpc('site_account_set_vip', {
        admin_email: currentUser.email,
        admin_password_hash: currentUser.passwordHash,
        account_id: userId,
        account_vip: vip,
      });
    }

    persistUsers(users.map((user) => (user.id === userId ? { ...user, vip } : user)));
  };

  const approveVip = (userId: string) => updateVip(userId, true);
  const revokeVip = (userId: string) => updateVip(userId, false);

  const updateAccountRole = async (userId: string, role: 'user' | 'pauvre') => {
    if (!isAdminAccount || !currentUser) return;

    if (supabase) {
      await supabase.rpc('site_account_set_status', {
        admin_email: currentUser.email,
        admin_password_hash: currentUser.passwordHash,
        account_id: userId,
        account_role: role,
      });
    }

    persistUsers(users.map((user) => (
      user.id === userId
        ? { ...user, role, vip: role === 'pauvre' ? false : user.vip }
        : user
    )));
  };

  const setPauvre = (userId: string) => updateAccountRole(userId, 'pauvre');
  const removePauvre = (userId: string) => updateAccountRole(userId, 'user');

  const deleteUser = async (userId: string) => {
    if (!isAdminAccount || !currentUser) return;

    if (supabase) {
      await supabase.rpc('site_account_delete', {
        admin_email: currentUser.email,
        admin_password_hash: currentUser.passwordHash,
        account_id: userId,
      });
    }

    persistUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, isAdminAccount, guestAccess, isLoadingUsers, register, login, continueAsGuest, logout, refreshUsers, approveVip, revokeVip, setPauvre, removePauvre, deleteUser }}>
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
