import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; // Ou um componente de Spinner/Loading
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;