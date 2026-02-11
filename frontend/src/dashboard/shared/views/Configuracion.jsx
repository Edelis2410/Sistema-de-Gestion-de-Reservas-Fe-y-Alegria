import React, { useState, useEffect } from 'react';
import { Bell, Mail, Save, Shield, RefreshCw, User } from 'lucide-react';

const Configuracion = () => {
  // 1. Estado único enfocado en Notificaciones y Sistema
  const [config, setConfig] = useState({
    notificacionesEmail: true,
    notificacionesPush: true,
    recordatorioReserva: true,
    confirmacionReserva: true,
    notificarCambios: true,
    notificarCancelaciones: true,
    autoGuardado: true,
  });

  const [mensaje, setMensaje] = useState('');

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem('configuracionSistema');
    if (guardado) {
      setConfig(JSON.parse(guardado));
    }
  }, []);

  // Función universal para cambios
  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const guardarConfiguracion = () => {
    localStorage.setItem('configuracionSistema', JSON.stringify(config));
    setMensaje('Configuración guardada exitosamente');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setMensaje(''), 3000);
  };

  const restablecerConfiguracion = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer la configuración a valores por defecto?')) {
      const deFecto = {
        notificacionesEmail: true,
        notificacionesPush: true,
        recordatorioReserva: true,
        confirmacionReserva: true,
        notificarCambios: true,
        notificarCancelaciones: true,
        autoGuardado: true,
      };
      setConfig(deFecto);
      setMensaje('Configuración restablecida a valores por defecto');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  // Componente Reutilizable de Fila con Switch (Respetando tamaños originales)
  const SwitchRow = ({ icon: Icon, label, desc, configKey }) => (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors">
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
          checked={config[configKey]}
          onChange={(e) => handleChange(configKey, e.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header - Tamaños Originales */}
        <header>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Configuración</h1>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta tus preferencias de notificaciones para este sistema de reservas.
            </p>
          </div>
        </header>

        {/* Mensaje de éxito - Tamaño Original */}
        {mensaje && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          
          <div className="space-y-6">
            {/* SECCIÓN 1: CANALES (Preferencias personales) */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Canales de comunicación</h2>
                  <p className="text-xs text-slate-500">Define por dónde quieres recibir tus alertas.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <SwitchRow 
                  icon={Mail} 
                  label="Notificaciones por correo" 
                  desc="Confirmaciones y cambios de reservas por email."
                  configKey="notificacionesEmail" 
                />
                <SwitchRow 
                  icon={Bell} 
                  label="Notificaciones en el navegador" 
                  desc="Avisos cuando estés conectado al sistema."
                  configKey="notificacionesPush" 
                />
              </div>
            </section>

            {/* SECCIÓN 2: SISTEMA */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Shield className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Ajustes del sistema</h2>
                  <p className="text-xs text-slate-500">Opciones de uso general.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <SwitchRow 
                  label="Auto-guardado" 
                  desc="Guardar automáticamente cambios en formularios." 
                  configKey="autoGuardado" 
                />
              </div>
            </section>
          </div>

          {/* DERECHA: ALERTAS ESPECÍFICAS */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-20">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Bell className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Alertas de reservas</h2>
                  <p className="text-xs text-slate-500">Define los eventos que disparan avisos.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <SwitchRow label="Recordatorio de reserva" desc="Aviso antes de cada reserva." configKey="recordatorioReserva" />
                <SwitchRow label="Confirmación de reserva" desc="Aviso al crear o aprobar." configKey="confirmacionReserva" />
                <SwitchRow label="Notificar cambios" desc="Alertas por edición." configKey="notificarCambios" />
                <SwitchRow label="Notificar cancelaciones" desc="Aviso por cancelación." configKey="notificarCancelaciones" />
              </div>
            </section>
          </aside>

        </div>

        {/* BOTONES DE ACCIÓN - Tamaños Originales */}
        <div className="flex justify-center pt-2">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={restablecerConfiguracion}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Restablecer valores
            </button>
            <button
              onClick={guardarConfiguracion}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuracion;