// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { 
  saveAuthData, 
  getToken, 
  getUser, 
  logout as logoutUtil,
  verifyToken,
  authFetch
} from '../utils/auth';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const storedUser = getUser();
      const token = getToken();
      
      if (!token || !storedUser) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      const isValid = await verifyToken();
      if (isValid) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        logoutUtil();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error en checkAuth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (userData, token) => {
    try {
      saveAuthData(token, userData);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: 'Error al guardar sesión' };
    }
  };

  const logout = () => {
    logoutUtil();
    setUser(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  // ==========================================
  // FUNCIÓN UPDATEUSER (CORREGIDA)
  // ==========================================
  const updateUser = async (datosNuevos) => {
    try {
      const token = getToken();
      
      // Enviamos los datos al servidor usando la nueva ruta de perfil
      const response = await fetch('http://localhost:5000/api/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosNuevos)
      });

      const data = await response.json();

      if (data.success) {
        // 1. Actualizamos el estado global de React
        setUser(data.user);
        
        // 2. IMPORTANTE: Actualizar también el localStorage 
        // para que al refrescar (F5) no se pierda la foto
        saveAuthData(token, data.user);
        
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'No se pudo actualizar' };
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const hasRole = (role) => user?.rol === role;
  const hasAnyRole = (allowedRoles) => allowedRoles.includes(user?.rol);

  const value = {
    user,
    login,
    logout,
    updateUser, // Ahora ya envía datos
    loading,
    isAuthenticated,
    userRole: user?.rol || null,
    hasRole,
    hasAnyRole,
    refreshAuth: checkAuth,
    getAuthHeaders: () => {
      const token = getToken();
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    },
    authFetch: (url, options = {}) => authFetch(url, options)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};