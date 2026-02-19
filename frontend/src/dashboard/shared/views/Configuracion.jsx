import React, { useState, useEffect } from 'react';
import { Bell, Mail, Save, RefreshCw, User } from 'lucide-react';

const Configuracion = () => {
  const [config, setConfig] = useState({
    notificacionesEmail: true,
    notificacionesPush: true
    
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    const cargarPreferencias = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/verify-token', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.user && data.user.preferencias) {
          // Solo actualizamos las claves que existen en el estado
          setConfig(prev => ({
            notificacionesEmail: data.user.preferencias.notificacionesEmail ?? prev.notificacionesEmail,
            notificacionesPush: data.user.preferencias.notificacionesPush ?? prev.notificacionesPush
          }));
        }
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoadingPrefs(false);
      }
    };
    cargarPreferencias();
  }, []);

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const guardarConfiguracion = async () => {
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/usuarios/preferencias', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMensaje({ texto: '¡Configuración guardada correctamente!', tipo: 'success' });
        localStorage.setItem('configuracionSistema', JSON.stringify(config));
      } else {
        setMensaje({ 
          texto: `Error ${response.status}: ${data.error || 'No se pudo guardar'}`, 
          tipo: 'error' 
        });
      }
    } catch (error) {
      setMensaje({ texto: 'Error: No hay conexión con el servidor backend', tipo: 'error' });
    } finally {
      setCargando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
    }
  };

  const restablecerConfiguracion = () => {
    if (window.confirm('¿Deseas restablecer los valores por defecto?')) {
      setConfig({
        notificacionesEmail: true,
        notificacionesPush: true
      });
      setMensaje({ texto: 'Valores restablecidos. Haz clic en Guardar.', tipo: 'success' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    }
  };

  const SwitchRow = ({ icon: Icon, label, desc, configKey }) => (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors text-left">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="rounded-full bg-white p-2 shadow-sm">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={config[configKey] || false}
          onChange={(e) => handleChange(configKey, e.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
      </label>
    </div>
  );

  const SkeletonSwitch = () => (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-200 p-2">
          <div className="h-4 w-4 bg-slate-300 rounded"></div>
        </div>
        <div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-1"></div>
          <div className="h-3 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-11 bg-slate-200 rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-left">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Configuración</h1>
          <p className="mt-1 text-sm text-slate-500">Ajusta tus preferencias de notificaciones.</p>
        </header>

        {mensaje.texto && (
          <div className={`rounded-lg border px-4 py-3 text-sm animate-in fade-in duration-300 ${
            mensaje.tipo === 'success' ? 'border-blue-100 bg-blue-50 text-blue-800' : 'border-red-100 bg-red-50 text-red-800'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="space-y-6">
          {/* Sección: Canales de comunicación */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="rounded-lg bg-blue-50 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Canales de comunicación</h2>
                <p className="text-xs text-slate-500">¿Por dónde quieres recibir alertas?</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {loadingPrefs ? (
                <>
                  <SkeletonSwitch />
                  <SkeletonSwitch />
                </>
              ) : (
                <>
                  <SwitchRow icon={Mail} label="Notificaciones por correo" desc="Alertas al email." configKey="notificacionesEmail" />
                  <SwitchRow icon={Bell} label="Notificaciones push" desc="Avisos en el sistema." configKey="notificacionesPush" />
                </>
              )}
            </div>
          </section>

          {/* Botones centrados */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
            <button
              onClick={restablecerConfiguracion}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Restablecer
            </button>
            <button
              onClick={guardarConfiguracion}
              disabled={cargando}
              className={`flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors ${cargando ? 'opacity-50' : ''}`}
            >
              <Save className="h-4 w-4" />
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuracion;