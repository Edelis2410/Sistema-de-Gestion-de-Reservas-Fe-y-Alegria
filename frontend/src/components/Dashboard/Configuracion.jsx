import React, { useState } from 'react';
import { 
  Bell, 
  Palette,
  Globe,
  Save,
  Moon,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const Configuracion = ({ user }) => {
  // Estado para notificaciones
  const [notificaciones, setNotificaciones] = useState({
    email: {
      nuevasReservas: true,
      confirmaciones: true,
      recordatorios: true,
      cambiosEstado: true,
    },
    push: {
      reservasPendientes: false,
      recordatorios: true,
      mensajes: true,
    },
    horario: {
      inicio: '08:00',
      fin: '18:00',
      soloDiasLaborales: true,
    }
  });

  // Estado para preferencias
  const [preferencias, setPreferencias] = useState({
    tema: 'claro',
    idioma: 'es',
    zonaHoraria: 'America/Caracas',
    formatoFecha: 'DD/MM/YYYY',
    formatoHora: '24h',
    mostrarCalendarioMini: true,
    mostrarEstadisticas: true,
    animaciones: true,
  });

  // Estado para reservas
  const [reservasConfig, setReservasConfig] = useState({
    tiempoMinimoReserva: 1, // horas
    tiempoMaximoReserva: 24, // horas
    anticipacionReserva: 24, // horas
    recordatorioAutomatico: true,
    recordatorioHoras: 24,
    permitirCancelacionUltimaHora: true,
    mostrarConflictos: true,
  });

  // Manejar cambios en notificaciones
  const handleNotificacionesChange = (section, key, value) => {
    setNotificaciones(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Manejar cambios en preferencias
  const handlePreferenciasChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencias(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambios en configuración de reservas
  const handleReservasConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReservasConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Guardar configuración
  const handleGuardarConfiguracion = () => {
    const configuracionCompleta = {
      notificaciones,
      preferencias,
      reservasConfig,
      usuario: user?.email || 'usuario@institucion.edu.ve',
      fechaActualizacion: new Date().toISOString()
    };

    // Guardar en localStorage
    localStorage.setItem('configuracionUsuario', JSON.stringify(configuracionCompleta));
    
    console.log('Configuración guardada:', configuracionCompleta);
    alert('Configuración guardada exitosamente');
  };

  // Restablecer configuración por defecto
  const handleRestablecer = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer toda la configuración a los valores predeterminados?')) {
      setNotificaciones({
        email: {
          nuevasReservas: true,
          confirmaciones: true,
          recordatorios: true,
          cambiosEstado: true,
        },
        push: {
          reservasPendientes: false,
          recordatorios: true,
          mensajes: true,
        },
        horario: {
          inicio: '08:00',
          fin: '18:00',
          soloDiasLaborales: true,
        }
      });

      setPreferencias({
        tema: 'claro',
        idioma: 'es',
        zonaHoraria: 'America/Caracas',
        formatoFecha: 'DD/MM/YYYY',
        formatoHora: '24h',
        mostrarCalendarioMini: true,
        mostrarEstadisticas: true,
        animaciones: true,
      });

      setReservasConfig({
        tiempoMinimoReserva: 1,
        tiempoMaximoReserva: 24,
        anticipacionReserva: 24,
        recordatorioAutomatico: true,
        recordatorioHoras: 24,
        permitirCancelacionUltimaHora: true,
        mostrarConflictos: true,
      });

      alert('Configuración restablecida a valores predeterminados');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600">Personaliza tu experiencia en el sistema de reservas</p>
        </div>

        {/* Sección de Notificaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Notificaciones</h2>
                <p className="text-gray-600 text-sm">Configura cómo y cuándo recibir notificaciones</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notificaciones por Email */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nuevas reservas</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.email.nuevasReservas}
                      onChange={(e) => handleNotificacionesChange('email', 'nuevasReservas', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Confirmaciones</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.email.confirmaciones}
                      onChange={(e) => handleNotificacionesChange('email', 'confirmaciones', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Recordatorios</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.email.recordatorios}
                      onChange={(e) => handleNotificacionesChange('email', 'recordatorios', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notificaciones Push */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Notificaciones Push</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reservas pendientes</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.push.reservasPendientes}
                      onChange={(e) => handleNotificacionesChange('push', 'reservasPendientes', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Recordatorios</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.push.recordatorios}
                      onChange={(e) => handleNotificacionesChange('push', 'recordatorios', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Horario de Notificaciones */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Horario de Notificaciones</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Desde</label>
                  <input
                    type="time"
                    value={notificaciones.horario.inicio}
                    onChange={(e) => handleNotificacionesChange('horario', 'inicio', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hasta</label>
                  <input
                    type="time"
                    value={notificaciones.horario.fin}
                    onChange={(e) => handleNotificacionesChange('horario', 'fin', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Solo días laborales</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones.horario.soloDiasLaborales}
                      onChange={(e) => handleNotificacionesChange('horario', 'soloDiasLaborales', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Preferencias */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Preferencias</h2>
                <p className="text-gray-600 text-sm">Personaliza la apariencia y comportamiento</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Moon className="h-4 w-4 inline mr-1" />
                Tema de la Interfaz
              </label>
              <select
                name="tema"
                value={preferencias.tema}
                onChange={handlePreferenciasChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="claro">Tema Claro</option>
                <option value="oscuro">Tema Oscuro</option>
                <option value="auto">Automático (según sistema)</option>
              </select>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Idioma
              </label>
              <select
                name="idioma"
                value={preferencias.idioma}
                onChange={handlePreferenciasChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>

            {/* Formato de Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Formato de Fecha
              </label>
              <select
                name="formatoFecha"
                value={preferencias.formatoFecha}
                onChange={handlePreferenciasChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
              </select>
            </div>

            {/* Formato de Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Formato de Hora
              </label>
              <select
                name="formatoHora"
                value={preferencias.formatoHora}
                onChange={handlePreferenciasChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
          </div>

          {/* Opciones Adicionales */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Mostrar calendario mini</p>
                <p className="text-sm text-gray-600">Mostrar calendario pequeño en el dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="mostrarCalendarioMini"
                  checked={preferencias.mostrarCalendarioMini}
                  onChange={handlePreferenciasChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Mostrar estadísticas</p>
                <p className="text-sm text-gray-600">Mostrar gráficos y estadísticas en el dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="mostrarEstadisticas"
                  checked={preferencias.mostrarEstadisticas}
                  onChange={handlePreferenciasChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Animaciones</p>
                <p className="text-sm text-gray-600">Habilitar animaciones en la interfaz</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="animaciones"
                  checked={preferencias.animaciones}
                  onChange={handlePreferenciasChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Sección de Configuración de Reservas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <AlertCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Configuración de Reservas</h2>
                <p className="text-gray-600 text-sm">Configura reglas y comportamientos para tus reservas</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo mínimo de reserva (horas)
              </label>
              <input
                type="number"
                name="tiempoMinimoReserva"
                value={reservasConfig.tiempoMinimoReserva}
                onChange={handleReservasConfigChange}
                min="0.5"
                max="24"
                step="0.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo máximo de reserva (horas)
              </label>
              <input
                type="number"
                name="tiempoMaximoReserva"
                value={reservasConfig.tiempoMaximoReserva}
                onChange={handleReservasConfigChange}
                min="1"
                max="72"
                step="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anticipación para reservar (horas)
              </label>
              <input
                type="number"
                name="anticipacionReserva"
                value={reservasConfig.anticipacionReserva}
                onChange={handleReservasConfigChange}
                min="1"
                max="168"
                step="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recordatorio automático (horas antes)
              </label>
              <input
                type="number"
                name="recordatorioHoras"
                value={reservasConfig.recordatorioHoras}
                onChange={handleReservasConfigChange}
                min="1"
                max="48"
                step="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Opciones de Reservas */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Recordatorio automático</p>
                <p className="text-sm text-gray-600">Enviar recordatorio antes de cada reserva</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="recordatorioAutomatico"
                  checked={reservasConfig.recordatorioAutomatico}
                  onChange={handleReservasConfigChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Permitir cancelación de última hora</p>
                <p className="text-sm text-gray-600">Permitir cancelar reservas con menos de 1 hora de anticipación</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="permitirCancelacionUltimaHora"
                  checked={reservasConfig.permitirCancelacionUltimaHora}
                  onChange={handleReservasConfigChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Mostrar conflictos de horario</p>
                <p className="text-sm text-gray-600">Advertir sobre posibles conflictos al hacer reservas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="mostrarConflictos"
                  checked={reservasConfig.mostrarConflictos}
                  onChange={handleReservasConfigChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleRestablecer}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restablecer Configuración
            </button>
            
            <button
              onClick={handleGuardarConfiguracion}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;