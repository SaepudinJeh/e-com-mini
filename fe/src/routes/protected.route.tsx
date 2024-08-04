// src/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../libs/contexts/auth.context';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export default function ProtectedRoute ({ element }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);

  if (!authContext?.authData?.token) {
    authContext?.logout()
    return <Navigate to="/auth/login" />;
  }

  return element;
}

