// src/dashboard/shared/views/MiCuenta.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  User, Mail, Camera, Lock, Save, 
  Edit2, X, Eye, EyeOff, CheckCircle, CircleUser
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

  // Sincronización: Solo actualiza si NO estamos editando para evitar el "pestañeo"
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
        const base64 = event.target.result;
        // Actualizamos solo el estado local para que se vea la foto de inmediato
        setPerfil(prev => ({ ...prev, foto: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarPerfil = async (e) => {
    if (e) e.preventDefault(); // Evita que la página se recargue
    setCargando(true);
    
    try {
      const datosParaEnviar = {
        ...user, // Mantenemos datos existentes del context
        nombre: perfil.nombre,
        email: perfil.correo,
        areaAcademica: perfil.areaAcademica,
        telefono: perfil.telefono,
        foto: perfil.foto // Aquí va el Base64 de la nueva foto
      };
      
      const resultado = await updateUser(datosParaEnviar);
      
      if (resultado.success) {
        setEditando(false);
        mostrarMensaje('Perfil actualizado exitosamente', 'exito');
      } else {
        mostrarMensaje(resultado.error || 'Error al guardar', 'error');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Mi cuenta</h1>
          {mensaje && (
            <div className={`mt-4 rounded-lg border ${tipoMensaje === 'exito' ? 'border-green-100 bg-green-50 text-green-800' : 'border-red-100 bg-red-50 text-red-800'} px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in`}>
              {tipoMensaje === 'exito' ? <CheckCircle size={16}/> : <X size={16}/>}
              {mensaje}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><User className="text-blue-600" size={20} /></div>
                  <h2 className="font-semibold text-slate-900">Datos de perfil</h2>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditando(!editando)} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  {editando ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>

              <div className="p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    {perfil.foto ? (
                      <img src={perfil.foto} alt="Perfil" className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md" />
                    ) : (
                      <div className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400 shadow-md">
                        <CircleUser size={80} strokeWidth={1} />
                      </div>
                    )}
                    {editando && (
                      <button 
                        type="button"
                        onClick={handleIconClick}
                        className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-transform active:scale-95"
                      >
                        <Camera size={18} />
                      </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFotoChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <form onSubmit={handleGuardarPerfil} className="grid gap-4 max-w-xl mx-auto text-left">
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Nombre Completo</label>
                    <input 
                      disabled={!editando}
                      value={perfil.nombre}
                      onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
                    <input 
                      disabled
                      value={perfil.correo}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400"
                    />
                  </div>
                  
                  {editando && (
                    <button 
                      type="submit"
                      disabled={cargando}
                      className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {cargando ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={18} />}
                      Guardar todos los cambios
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg"><Lock className="text-slate-600" size={20} /></div>
              <h2 className="font-semibold text-slate-900">Seguridad</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Gestiona el acceso a tu cuenta.</p>
            <button disabled className="w-full py-2.5 border border-slate-200 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;