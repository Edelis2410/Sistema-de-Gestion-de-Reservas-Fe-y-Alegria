// src/components/common/ProtectedRoute.jsx - VERSIÓN ACTUALIZADA
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Usar función de auth.js para verificar autenticación
  if (!isAuthenticated()) {
    console.log('ProtectedRoute - Usuario NO autenticado, redirigiendo a /login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles && user.rol && !allowedRoles.includes(user.rol)) {
    console.log('ProtectedRoute - Rol no permitido:', user.rol);
    
    // Redirigir según el rol del usuario
    if (user.rol === 'administrador') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.rol === 'docente') {
      return <Navigate to="/docente/dashboard" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;