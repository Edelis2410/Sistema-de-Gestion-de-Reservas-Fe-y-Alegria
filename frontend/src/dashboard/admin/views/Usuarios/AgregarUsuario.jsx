import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react';

const AgregarUsuario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: 1, // Por defecto Docente
    activo: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          rol_id: parseInt(formData.rol_id)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo crear el usuario');

      setSuccess('Usuario guardado con éxito');
      setFormData({ nombre: '', email: '', password: '', rol_id: 1, activo: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          
          {/* Título sencillo */}
          <div className="p-6 border-b border-gray-100 text-center">
            <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Alertas cortas */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center text-sm border border-green-100">
                <CheckCircle className="w-4 h-4 mr-2" /> {success}
              </div>
            )}

            {/* Campo: Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
            </div>

            {/* Campo: Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Campo: Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contraseña temporal"
                  required
                />
              </div>
            </div>

            {/* Campo: Rol (Usando tus IDs correctos) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={1}>Docente</option>
                  <option value={2}>Administrador</option>
                </select>
              </div>
            </div>

            {/* Toggle de Activo */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 text-sm text-gray-600">
                Habilitar inicio de sesión
              </label>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Usuario
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarUsuario;