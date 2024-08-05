// src/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../libs/contexts/auth.context';

interface AuthLayoutProps {
  element: React.ReactElement;
}

export default function ProtectedAuthRoute ({ element }: AuthLayoutProps) {
  const authContext = useContext(AuthContext);

  if (authContext?.authData?.token) {
    return <Navigate to="/" />;
  }

  return element;
}

