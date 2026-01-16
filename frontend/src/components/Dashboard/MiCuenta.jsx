import React, { useState } from 'react';
import { 
  User, Mail, BookOpen, Camera, Lock, Save, 
  Edit2, X, Eye, EyeOff, CheckCircle, Phone
} from 'lucide-react';

const MiCuenta = () => {
  // Estado para los datos del perfil
  const [perfil, setPerfil] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@colegio.edu',
    areaAcademica: 'Matemáticas',
    telefono: '+51 987 654 321',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  });

  // Estado para modo edición
  const [editando, setEditando] = useState(false);
  
  // Estado para el cambio de contraseña
  const [cambioContrasena, setCambioContrasena] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  // Estados para mostrar/ocultar contraseñas
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Estados para mensajes y loading
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estado para subida de foto
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // Manejar cambios en el perfil
  const handlePerfilChange = (campo, valor) => {
    setPerfil(prev => ({ ...prev, [campo]: valor }));
  };

  // Manejar cambios en la contraseña
  const handleContrasenaChange = (campo, valor) => {
    setCambioContrasena(prev => ({ ...prev, [campo]: valor }));
  };

  // Subir nueva foto de perfil
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        mostrarMensaje('La imagen debe ser menor a 5MB', 'error');
        return;
      }

      setSubiendoFoto(true);
      
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPerfil(prev => ({ ...prev, foto: reader.result }));
          setSubiendoFoto(false);
          mostrarMensaje('Foto de perfil actualizada', 'exito');
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  // Mostrar mensajes
  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  // Guardar cambios del perfil
  const guardarPerfil = () => {
    if (!perfil.nombre.trim() || !perfil.correo.trim()) {
      mostrarMensaje('Nombre y correo son obligatorios', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.correo)) {
      mostrarMensaje('Ingrese un correo válido', 'error');
      return;
    }

    setCargando(true);
    
    setTimeout(() => {
      setCargando(false);
      setEditando(false);
      mostrarMensaje('Perfil actualizado exitosamente', 'exito');
      
      localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
    }, 1500);
  };

  // Cambiar contraseña
  const cambiarContrasena = () => {
    if (!cambioContrasena.actual || !cambioContrasena.nueva || !cambioContrasena.confirmar) {
      mostrarMensaje('Todos los campos son obligatorios', 'error');
      return;
    }

    if (cambioContrasena.nueva !== cambioContrasena.confirmar) {
      mostrarMensaje('Las contraseñas no coinciden', 'error');
      return;
    }

    if (cambioContrasena.nueva.length < 6) {
      mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      setCambioContrasena({
        actual: '',
        nueva: '',
        confirmar: ''
      });
      mostrarMensaje('Contraseña cambiada exitosamente', 'exito');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-slate-900">Mi cuenta</h1>
            <p className="mt-2 text-sm text-slate-600">
              Administra tu información personal y preferencias
            </p>
          </div>
          
          {mensaje && (
            <div className={`mt-4 rounded-lg border ${
              tipoMensaje === 'exito' 
                ? 'border-green-100 bg-green-50' 
                : 'border-red-100 bg-red-50'
            } px-4 py-3 text-sm`}>
              <div className="flex items-center gap-3">
                {tipoMensaje === 'exito' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {tipoMensaje === 'error' && (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className={
                  tipoMensaje === 'exito' 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }>
                  {mensaje}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sección izquierda: Datos de perfil */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Datos de perfil</h2>
                      <p className="text-sm text-slate-500">Información personal y académica</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditando(!editando)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center gap-2">
                      {editando ? (
                        <>
                          <X className="h-4 w-4" />
                          Cancelar
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-4 w-4" />
                          Editar perfil
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Foto de perfil */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={perfil.foto}
                      alt="Foto de perfil"
                      className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    {editando && (
                      <>
                        <input
                          type="file"
                          id="foto-perfil"
                          accept="image/*"
                          onChange={handleFotoChange}
                          className="hidden"
                          disabled={subiendoFoto}
                        />
                        <label
                          htmlFor="foto-perfil"
                          className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700"
                        >
                          {subiendoFoto ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </label>
                      </>
                    )}
                  </div>
                  {subiendoFoto && (
                    <p className="mt-2 text-sm text-blue-600">Subiendo foto...</p>
                  )}
                </div>

                {/* Formulario de datos */}
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Nombre completo
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        value={perfil.nombre}
                        onChange={(e) => handlePerfilChange('nombre', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Ingrese su nombre"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <p className="text-sm text-slate-900">{perfil.nombre}</p>
                      </div>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Correo electrónico
                    </label>
                    {editando ? (
                      <input
                        type="email"
                        value={perfil.correo}
                        onChange={(e) => handlePerfilChange('correo', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="correo@ejemplo.com"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <p className="text-sm text-slate-900">{perfil.correo}</p>
                      </div>
                    )}
                  </div>

                  {/* Área académica */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Área académica
                    </label>
                    {editando ? (
                      <select
                        value={perfil.areaAcademica}
                        onChange={(e) => handlePerfilChange('areaAcademica', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none bg-white"
                      >
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Lenguaje">Lenguaje</option>
                        <option value="Ciencias">Ciencias</option>
                        <option value="Historia">Historia</option>
                        <option value="Inglés">Inglés</option>
                        <option value="Arte">Arte</option>
                        <option value="Educación Física">Educación Física</option>
                        <option value="Tecnología">Tecnología</option>
                      </select>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <p className="text-sm text-slate-900">{perfil.areaAcademica}</p>
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Teléfono
                    </label>
                    {editando ? (
                      <input
                        type="tel"
                        value={perfil.telefono}
                        onChange={(e) => handlePerfilChange('telefono', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="+51 987 654 321"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <p className="text-sm text-slate-900">{perfil.telefono}</p>
                      </div>
                    )}
                  </div>

                  {/* Botón de guardar (solo en modo edición) */}
                  {editando && (
                    <div className="pt-4">
                      <button
                        onClick={guardarPerfil}
                        disabled={cargando}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cargando ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Guardando...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Save className="h-4 w-4" />
                            Guardar cambios
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha: Cambio de contraseña */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Seguridad</h2>
                    <p className="text-sm text-slate-500">Cambio de contraseña</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* Contraseña actual */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarActual ? "text" : "password"}
                        value={cambioContrasena.actual}
                        onChange={(e) => handleContrasenaChange('actual', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                        placeholder="Ingrese su contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarActual(!mostrarActual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {mostrarActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarNueva ? "text" : "password"}
                        value={cambioContrasena.nueva}
                        onChange={(e) => handleContrasenaChange('nueva', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                        placeholder="Ingrese la nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarNueva(!mostrarNueva)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {mostrarNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Mínimo 6 caracteres</p>
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarConfirmar ? "text" : "password"}
                        value={cambioContrasena.confirmar}
                        onChange={(e) => handleContrasenaChange('confirmar', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                        placeholder="Confirme la nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {mostrarConfirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Botón para cambiar contraseña */}
                  <button
                    onClick={cambiarContrasena}
                    disabled={cargando}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cargando ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Cambiando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        Cambiar contraseña
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;