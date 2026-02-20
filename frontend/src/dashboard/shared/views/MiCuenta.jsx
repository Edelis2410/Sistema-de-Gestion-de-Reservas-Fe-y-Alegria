// src/dashboard/shared/views/MiCuenta.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  User, Camera, Save, X, CheckCircle, CircleUser, 
  Mail, Phone, GraduationCap
} from 'lucide-react';

const MiCuenta = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [perfil, setPerfil] = useState({
    nombre: '',
    correo: '',
    areaAcademica: '',
    telefono: '',
    foto: null
  });

  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (user && !editando) {
      setPerfil({
        nombre: user.nombre || '',
        correo: user.email || user.correo || '',
        areaAcademica: user.areaAcademica || (user.rol === 'administrador' ? 'Administración' : 'Docencia'),
        telefono: user.telefono || '',
        foto: user.foto || null
      });
    }
  }, [user, editando]);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => { setMensaje(''); setTipoMensaje(''); }, 3000);
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        mostrarMensaje('La imagen debe ser menor a 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPerfil(prev => ({ ...prev, foto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarPerfil = async (e) => {
    if (e) e.preventDefault();
    setCargando(true);
    try {
      const resultado = await updateUser({
        ...user,
        nombre: perfil.nombre,
        email: perfil.correo,
        areaAcademica: perfil.areaAcademica,
        telefono: perfil.telefono,
        foto: perfil.foto
      });
      if (resultado.success) {
        setEditando(false);
        mostrarMensaje('Perfil actualizado con éxito', 'exito');
      } else {
        mostrarMensaje(resultado.error || 'Error al guardar', 'error');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header con Mensajes de Feedback */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona tu información personal y presencia visual
          </p>
        </div>
        {mensaje && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm animate-in slide-in-from-top ${
            tipoMensaje === 'exito' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            {tipoMensaje === 'exito' ? <CheckCircle size={18} /> : <X size={18} />}
            <span className="font-medium text-sm">{mensaje}</span>
          </div>
        )}
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner Decorativo */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              {perfil.foto ? (
                <img 
                  src={perfil.foto} 
                  alt="Perfil" 
                  className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-lg bg-white" 
                />
              ) : (
                <div className="h-32 w-32 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400 shadow-lg">
                  <CircleUser size={64} strokeWidth={1} />
                </div>
              )}
              {editando && (
                <button 
                  onClick={handleIconClick}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xl transition-all hover:scale-110 active:scale-90"
                >
                  <Camera size={18} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFotoChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Contenido interior con padding- card */}
        <div className="pt-20 pb-6 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{perfil.nombre || 'Usuario'}</h2>
              <p className="text-blue-600 font-medium">
                {user?.rol === 'administrador' ? 'Administrador del Sistema' : 'Personal Docente'}
              </p>
            </div>
            <button 
              onClick={() => setEditando(!editando)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                editando 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {editando ? <><X size={18} /> Cancelar</> : <><User size={18} /> Editar Perfil</>}
            </button>
          </div>

          <form onSubmit={handleGuardarPerfil} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Nombre Completo
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  disabled={!editando}
                  value={perfil.nombre}
                  onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-300" size={20} />
                <input 
                  disabled
                  value={perfil.correo}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Teléfono de Contacto
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  disabled={!editando}
                  value={perfil.telefono}
                  onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                  placeholder="No especificado"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Área Académica */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Área / Departamento
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  disabled
                  value={perfil.areaAcademica}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500"
                />
              </div>
            </div>

            {editando && (
              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit"
                  disabled={cargando}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {cargando ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  ) : (
                    <><Save size={20} /> Guardar Cambios</>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;