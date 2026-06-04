import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import AuthScreen from './AuthScreen';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { currentUser, guestAccess } = useAuth();
  return currentUser || guestAccess ? children : <AuthScreen />;
}