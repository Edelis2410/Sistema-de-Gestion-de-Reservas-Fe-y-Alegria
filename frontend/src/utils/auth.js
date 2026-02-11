// src/utils/auth.js
const API_URL = 'http://localhost:5000/api';

// ======================
// FUNCIONES BÁSICAS
// ======================

export const saveAuthData = (token, user) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✅ [saveAuthData] Datos guardados:', {
      tokenLength: token.length,
      user: user.email
    });
    return true;
  } catch (error) {
    console.error('❌ [saveAuthData] Error:', error);
    return false;
  }
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('⚠️ [getToken] No hay token en localStorage');
    return null;
  }
  console.log(`🔑 [getToken] Token encontrado (${token.length} caracteres)`);
  return token;
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('❌ [getUser] Error:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ [logout] Sesión cerrada');
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
    
    return true;
  } catch (error) {
    console.error('❌ [logout] Error:', error);
    return false;
  }
};

// ======================
// NUEVAS FUNCIONES REQUERIDAS (Para evitar pantalla blanca)
// ======================

export const hasRole = (user, role) => {
  if (!user || !user.rol) return false;
  return user.rol.toLowerCase() === role.toLowerCase();
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🧹 [clearAuthData] Datos eliminados de localStorage');
  } catch (error) {
    console.error('❌ [clearAuthData] Error:', error);
  }
};

// ======================
// AUTH FETCH COMPLETO CON LOGS
// ======================

export const authFetch = async (url, options = {}) => {
  console.log(`🌐 [authFetch] Iniciando: ${url}`);
  
  const token = getToken();
  if (!token) {
    console.error('❌ [authFetch] No hay token disponible');
    logout();
    return null;
  }
  
  console.log(`🔐 [authFetch] Usando token (${token.length} caracteres)`);
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    console.log(`📥 [authFetch] Respuesta: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.error('🔒 [authFetch] Error 401 - Token inválido');
      logout();
      return null;
    }
    
    if (!response.ok) {
      console.error(`❌ [authFetch] Error HTTP ${response.status}`);
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    console.log('✅ [authFetch] Petición exitosa');
    return response;
    
  } catch (error) {
    console.error('🔥 [authFetch] Error completo:', error);
    throw error;
  }
};

// ======================
// FUNCIONES DE VERIFICACIÓN
// ======================

export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;
    
    console.log('🔍 [verifyToken] Verificando token...');
    const response = await authFetch(`${API_URL}/verify-token`);
    
    if (!response) return false;
    
    const data = await response.json();
    return data.success === true;
    
  } catch (error) {
    console.error('❌ [verifyToken] Error:', error);
    return false;
  }
};

// ======================
// FUNCIÓN DE PRUEBA
// ======================

export const testConnection = async () => {
  console.log('🧪 [testConnection] Iniciando prueba...');
  
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ [testConnection] Servidor activo:', healthData.message);
  } catch (error) {
    console.error('❌ [testConnection] No hay conexión con el servidor');
    throw new Error('El servidor no está disponible');
  }
  
  return { success: true };
};


// ======================
// FUNCIÓN PARA ACTUALIZAR DATOS (Requerida por AuthContext)
// ======================

export const refreshUserData = async () => {
  try {
    const user = getUser();
    if (!user) return null;

    console.log('🔄 [refreshUserData] Actualizando datos del usuario...');
    
    // Hacemos una petición al servidor para traer los datos frescos
    const response = await authFetch(`${API_URL}/usuarios/${user.id}`);
    
    if (response && response.ok) {
      const data = await response.json();
      const updatedUser = data.data || data;
      
      // Guardamos los datos actualizados manteniendo el token actual
      const token = getToken();
      saveAuthData(token, updatedUser);
      
      console.log('✅ [refreshUserData] Datos actualizados con éxito');
      return updatedUser;
    }
    return user;
  } catch (error) {
    console.error('❌ [refreshUserData] Error:', error);
    return getUser(); // Si falla, devolvemos lo que ya tenemos
  }
};