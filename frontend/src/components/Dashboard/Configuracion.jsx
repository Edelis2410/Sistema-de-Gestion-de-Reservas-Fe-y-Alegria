import React, { useState } from 'react';
import { Globe, Moon, Sun, Bell, Mail, Save, User, Shield, RefreshCw } from 'lucide-react';

const Configuracion = () => {
  const [preferencias, setPreferencias] = useState({
    idioma: 'es',
    modoOscuro: false,
    notificacionesEmail: true,
    notificacionesPush: false,
    tema: 'azul',
  });

  const [alertas, setAlertas] = useState({
    recordatorioReserva: true,
    confirmacionReserva: true,
    notificarCambios: true,
    notificarCancelaciones: true,
  });

  const [ajustes, setAjustes] = useState({
    autoGuardado: true,
    mostrarTutorial: true,
    privacidadPerfil: 'publico',
    exportarDatos: false,
  });

  const [mensaje, setMensaje] = useState('');

  const handlePreferenciaChange = (key, value) => {
    setPreferencias(prev => ({ ...prev, [key]: value }));
  };

  const handleAlertaChange = (key, value) => {
    setAlertas(prev => ({ ...prev, [key]: value }));
  };

  const handleAjusteChange = (key, value) => {
    setAjustes(prev => ({ ...prev, [key]: value }));
  };

  const guardarConfiguracion = () => {
    const configuracionCompleta = { preferencias, alertas, ajustes };
    localStorage.setItem('configuracionSistema', JSON.stringify(configuracionCompleta));

    setMensaje('Configuración guardada exitosamente');
    setTimeout(() => setMensaje(''), 3000);

    if (preferencias.modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const restablecerConfiguracion = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer la configuración a valores por defecto?')) {
      setPreferencias({
        idioma: 'es',
        modoOscuro: false,
        notificacionesEmail: true,
        notificacionesPush: false,
        tema: 'azul',
      });

      setAlertas({
        recordatorioReserva: true,
        confirmacionReserva: true,
        notificarCambios: true,
        notificarCancelaciones: true,
      });

      setAjustes({
        autoGuardado: true,
        mostrarTutorial: true,
        privacidadPerfil: 'publico',
        exportarDatos: false,
      });

      setMensaje('Configuración restablecida a valores por defecto');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header - Sin botones */}
        <header>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Configuración</h1>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta tus preferencias de idioma, tema y notificaciones para este sistema de reservas.
            </p>
          </div>
        </header>

        {mensaje && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {mensaje}
          </div>
        )}

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Izquierda */}
          <div className="space-y-6">
            {/* Preferencias personales */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Preferencias personales</h2>
                  <p className="text-xs text-slate-500">
                    Idioma, modo de color y canales de comunicación.
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {/* Idioma - Con interruptor */}
                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Idioma del sistema</p>
                      <p className="text-xs text-slate-500">
                        {preferencias.idioma === 'es' ? 'Español' : 'English'}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={preferencias.idioma === 'es'}
                      onChange={(e) => handlePreferenciaChange('idioma', e.target.checked ? 'es' : 'en')}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
                  </label>
                </div>

                {/* Tema de la interfaz - Con interruptor */}
                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      {preferencias.modoOscuro ? (
                        <Moon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Sun className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Tema de la interfaz</p>
                      <p className="text-xs text-slate-500">
                        {preferencias.modoOscuro ? 'Modo oscuro' : 'Modo claro'}
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={preferencias.modoOscuro}
                      onChange={(e) => handlePreferenciaChange('modoOscuro', e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
                  </label>
                </div>

                {/* Notificaciones */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-600">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <span>Canales de notificación</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'notificacionesEmail',
                        label: 'Notificaciones por correo',
                        icon: Mail,
                        desc: 'Confirmaciones y cambios de reservas por email.',
                      },
                      {
                        key: 'notificacionesPush',
                        label: 'Notificaciones en el navegador',
                        icon: Bell,
                        desc: 'Avisos cuando estés conectado al sistema.',
                      },
                    ].map(notif => (
                      <div
                        key={notif.key}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-white p-2 shadow-sm">
                            <notif.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{notif.label}</p>
                            <p className="text-xs text-slate-500">{notif.desc}</p>
                          </div>
                        </div>

                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={preferencias[notif.key]}
                            onChange={e => handlePreferenciaChange(notif.key, e.target.checked)}
                          />
                          <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Ajustes del sistema */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Shield className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Ajustes del sistema</h2>
                  <p className="text-xs text-slate-500">
                    Opciones de uso general dentro de la plataforma.
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {[
                  {
                    key: 'autoGuardado',
                    label: 'Auto-guardado',
                    desc: 'Guardar automáticamente cambios en formularios.',
                  },
                  {
                    key: 'mostrarTutorial',
                    label: 'Mostrar tutorial',
                    desc: 'Ver ayudas cuando ingresas al sistema.',
                  },
                  {
                    key: 'exportarDatos',
                    label: 'Exportar datos automáticamente',
                    desc: 'Crear copias de respaldo de tus reservas.',
                  },
                ].map(ajuste => (
                  <div
                    key={ajuste.key}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ajuste.label}</p>
                      <p className="text-xs text-slate-500">{ajuste.desc}</p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={ajustes[ajuste.key]}
                        onChange={e => handleAjusteChange(ajuste.key, e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
                    </label>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Botones fuera del recuadro, centrados */}
            <div className="flex justify-center pt-2">
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={restablecerConfiguracion}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restablecer valores
                </button>
                <button
                  onClick={guardarConfiguracion}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>

          {/* Derecha: alertas */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-20">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Bell className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Alertas de reservas</h2>
                  <p className="text-xs text-slate-500">
                    Define cuándo quieres que el sistema te avise.
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {[
                  {
                    key: 'recordatorioReserva',
                    label: 'Recordatorio de reserva',
                    desc: 'Recibir un aviso antes de cada reserva.',
                  },
                  {
                    key: 'confirmacionReserva',
                    label: 'Confirmación de reserva',
                    desc: 'Aviso cuando una reserva se crea o aprueba.',
                  },
                  {
                    key: 'notificarCambios',
                    label: 'Notificar cambios',
                    desc: 'Alertas si se modifica la hora o el espacio.',
                  },
                  {
                    key: 'notificarCancelaciones',
                    label: 'Notificar cancelaciones',
                    desc: 'Aviso cuando una reserva se cancela.',
                  },
                ].map(alerta => (
                  <div
                    key={alerta.key}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{alerta.label}</p>
                      <p className="text-xs text-slate-500">{alerta.desc}</p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={alertas[alerta.key]}
                        onChange={e => handleAlertaChange(alerta.key, e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-300 transition-all duration-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300" />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;