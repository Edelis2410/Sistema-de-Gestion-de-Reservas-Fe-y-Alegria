import React, { useState } from 'react';
import { LogIn, Lock, Mail, User, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveAuthData } from '../utils/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'docente' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // RESTAURADA TU RUTA ORIGINAL: /api/login
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rolSeleccionado: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // --- PERSISTENCIA PARA EVITAR PESTAÑEO ---
      // Mantenemos tus llaves de localStorage y el orden de ejecución
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Llamada a tu utilidad original
      saveAuthData(data.token, data.user);
      
      // Actualizar el estado global del contexto
      await login(data.user, data.token);

      // Redirección basada en tus roles originales
      const rutaDestino = data.user.rol === 'administrador' 
        ? '/admin/dashboard' 
        : '/docente/dashboard';
      
      navigate(rutaDestino, { replace: true });

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión. Verifique sus credenciales.');
      
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-300">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Inicio de Sesión</h1>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selector de rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seleccione su tipo de cuenta
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'docente' }))}
                    className={`flex-1 flex items-center justify-center p-3 rounded-2xl border transition-colors ${
                      formData.role === 'docente' 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <User className={`w-4 h-4 mr-2 ${formData.role === 'docente' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">Docente</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                    className={`flex-1 flex items-center justify-center p-3 rounded-2xl border transition-colors ${
                      formData.role === 'admin' 
                        ? 'border-green-600 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <Shield className={`w-4 h-4 mr-2 ${formData.role === 'admin' ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">Administrador</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="correo@institucion.edu.ve"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-right">
                  <RouterLink
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </RouterLink>
                </div>
              </div>

              {/* Botón de inicio de sesión */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl font-medium text-white transition-all ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'Iniciando sesión...' : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Nota: Si tiene problemas para iniciar sesión, contacte al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;