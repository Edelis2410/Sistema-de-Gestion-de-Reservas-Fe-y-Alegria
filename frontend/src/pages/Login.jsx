import React, { useState } from 'react';
import { LogIn, Lock, Mail, User, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'docente'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulamos una petición al servidor
    setTimeout(() => {
      console.log('Datos de login:', formData);
      setIsLoading(false);
      
      // Datos simulados del usuario
      const userData = {
        name: formData.role === 'docente' ? 'Juan' : 'Admin',
        lastName: formData.role === 'docente' ? 'Pérez' : 'Sistema',
        email: formData.email,
        role: formData.role
      };
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Usuario guardado en localStorage:', userData);
      
      // 🔥 REDIRECCIÓN DIRECTA - ESTO SIEMPRE FUNCIONA 🔥
      if (formData.role === 'docente') {
        window.location.href = '/docente'; // Redirección directa
      } else if (formData.role === 'admin') {
        window.location.href = '/admin';
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-4">
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
                  Rol de usuario
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
                    <User className={`w-4 h-4 mr-2 ${
                      formData.role === 'docente' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
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
                    <Shield className={`w-4 h-4 mr-2 ${
                      formData.role === 'admin' ? 'text-green-600' : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                </div>
              </div>

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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="correo@institucion.edu.ve"
                    required
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
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-right">
                  <a 
                    href="#" 
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Función de recuperación de contraseña pendiente');
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Botón de inicio de sesión */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl font-medium text-white ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;