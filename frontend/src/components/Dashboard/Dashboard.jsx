import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Home,
  Bell,
  FileText
} from 'lucide-react';

// CAMBIA ESTO: Cambia Main por Dashboard
const Dashboard = ({ user, isSidebarCollapsed }) => {
  // Datos de ejemplo para gráficos de torta
  const reservationStats = {
    approved: 8,
    pending: 2,
    cancelled: 1,
    total: 11
  };

  // Calcular porcentajes
  const approvedPercentage = reservationStats.total > 0 ? 
    Math.round((reservationStats.approved / reservationStats.total) * 100) : 0;
  const pendingPercentage = reservationStats.total > 0 ? 
    Math.round((reservationStats.pending / reservationStats.total) * 100) : 0;
  const cancelledPercentage = reservationStats.total > 0 ? 
    Math.round((reservationStats.cancelled / reservationStats.total) * 100) : 0;

  // Espacios disponibles con sus capacidades
  const spaces = [
    { 
      name: 'Capilla', 
      description: 'Espacio Espiritual',
      capacity: 100,
      type: 'Religioso',
      icon: <Home className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      name: 'CERPA', 
      description: 'Auditorio Principal',
      capacity: 200,
      type: 'Auditorio',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      name: 'Sacramento', 
      description: 'Salón de Eventos',
      capacity: 150,
      type: 'Eventos',
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-green-100 text-green-600'
    },
    { 
      name: 'Salón Múltiple', 
      description: 'Espacio Polivalente',
      capacity: 300,
      type: 'Polivalente',
      icon: <MapPin className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-600'
    },
  ];

  // Recordatorios importantes
  const reminders = [
    {
      type: 'importante',
      title: 'Reserva Recurrente',
      message: 'Tu reserva semanal en la Capilla está activa hasta fin de semestre.',
      icon: <Bell className="h-4 w-4" />
    },
    {
      type: 'info',
      title: 'Capacidad Máxima',
      message: 'Recuerda respetar la capacidad máxima de cada espacio.',
      icon: <Users className="h-4 w-4" />
    },
    {
      type: 'advertencia',
      title: 'Cancelaciones',
      message: 'Cancela con 24h de anticipación para evitar penalizaciones.',
      icon: <AlertCircle className="h-4 w-4" />
    }
  ];

  // Calcular porcentaje de reservas (basado en un objetivo de 20 reservas)
  const totalReservasPercentage = Math.min((reservationStats.total / 20) * 100, 100);
  const espaciosActivosPercentage = 100; // 4 de 4 espacios activos
  const tasaAprobacionPercentage = approvedPercentage;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mensaje de Bienvenida Centrado - más pequeño */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, <span className="text-blue-600">{user?.name || 'Docente'}!</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Sistema de Gestión de Espacios Académicos y Eventos
          </p>
        </div>

        {/* Estadísticas Principales con medidores */}
        <div className={`grid grid-cols-1 ${isSidebarCollapsed ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8 mb-8`}>
          {/* Medidor de Total Reservas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {/* Semicírculo de fondo */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 50" className="overflow-visible">
                  {/* Fondo del semicírculo */}
                  <path 
                    d="M 10,45 A 40,40 0 0,1 90,45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Arco de progreso */}
                  <path 
                    d="M 10,45 A 40,40 0 0,1 90,45" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${totalReservasPercentage * 1.25} 125`}
                    strokeDashoffset="0"
                  />
                </svg>
              </div>
              
              {/* Número en el centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{reservationStats.total}</span>
                <span className="text-xs text-gray-500 mt-1">Reservas</span>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1">Total Reservas</h3>
              <div className="flex items-center justify-center text-green-500 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+15% este mes</span>
              </div>
            </div>
          </div>

          {/* Medidor de Espacios Activos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {/* Línea circular con puntos */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                  {/* Círculo de fondo */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  
                  {/* Puntos a lo largo de la línea (4 puntos para 4 espacios) */}
                  {[0, 90, 180, 270].map((angle, index) => {
                    const radian = (angle * Math.PI) / 180;
                    const x = 50 + 40 * Math.cos(radian);
                    const y = 50 + 40 * Math.sin(radian);
                    
                    return (
                      <circle 
                        key={index}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>
              
              {/* Número en el centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">4</span>
                <span className="text-xs text-gray-500 mt-1">Activos</span>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1">Espacios Activos</h3>
              <p className="text-xs text-gray-500">Capacidad: 750 pers.</p>
            </div>
          </div>

          {/* Medidor de Tasa de Aprobación */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {/* Arco circular completo */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                  {/* Fondo del círculo */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  
                  {/* Arco de progreso */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${tasaAprobacionPercentage * 2.513} 251.3`}
                    strokeDashoffset="251.3"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              
              {/* Número en el centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{tasaAprobacionPercentage}%</span>
                <span className="text-xs text-gray-500 mt-1">Aprobación</span>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-1">Tasa de Aprobación</h3>
              <p className="text-xs text-gray-500">{reservationStats.approved} reservas aprobadas</p>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${isSidebarCollapsed ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}`}>
          {/* Gráfico de Estado de Reservas - más pequeño */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${
            isSidebarCollapsed ? 'lg:col-span-2' : 'lg:col-span-2'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Estado de Reservas</h2>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            
            {reservationStats.total > 0 ? (
              <div className={`grid gap-4 ${isSidebarCollapsed ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
                {/* Gráfico circular simplificado - más pequeño */}
                <div className="flex flex-col items-center">
                  <div className={`relative ${isSidebarCollapsed ? 'w-40 h-40' : 'w-40 h-40'} mb-2`}>
                    {/* Círculo de fondo */}
                    <div className="absolute inset-0 rounded-full border-6 border-gray-200"></div>
                    
                    {/* Sección Aprobadas */}
                    <div 
                      className="absolute inset-0 rounded-full border-6 border-green-500"
                      style={{ clipPath: `inset(0 ${100 - approvedPercentage}% 0 0)` }}
                    ></div>
                    
                    {/* Sección Pendientes */}
                    <div 
                      className="absolute inset-0 rounded-full border-6 border-yellow-500"
                      style={{ clipPath: `inset(0 ${100 - (approvedPercentage + pendingPercentage)}% 0 0)` }}
                    ></div>
                    
                    {/* Sección Canceladas */}
                    <div 
                      className="absolute inset-0 rounded-full border-6 border-red-500"
                      style={{ clipPath: `inset(0 ${100 - (approvedPercentage + pendingPercentage + cancelledPercentage)}% 0 0)` }}
                    ></div>
                    
                    {/* Centro del gráfico */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{reservationStats.total}</p>
                        <p className="text-xs text-gray-500">Reservas</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leyenda - más compacta */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">Aprobadas</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{reservationStats.approved} ({approvedPercentage}%)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">En Espera</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{reservationStats.pending} ({pendingPercentage}%)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">Canceladas</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{reservationStats.cancelled} ({cancelledPercentage}%)</p>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-xs text-gray-600">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span>Tendencia: +15% este mes</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No hay reservas aún</h3>
                <p className="text-gray-500 text-xs">Comienza haciendo tu primera reserva.</p>
              </div>
            )}
          </div>

          {/* Espacios Disponibles - más compacto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Espacios</h2>
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="space-y-2">
              {spaces.map((space, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${space.color} p-1.5 rounded mr-3`}>
                        {space.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{space.name}</h3>
                        <p className="text-xs text-gray-600">{space.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{space.capacity}</p>
                      <p className="text-xs text-gray-500">pers.</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center">
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {space.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recordatorios Importantes - ocupando todo el ancho */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Información Importante</h2>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className={`grid gap-3 ${isSidebarCollapsed ? 'md:grid-cols-3' : 'md:grid-cols-3'}`}>
              {reminders.map((reminder, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  reminder.type === 'importante' 
                    ? 'bg-blue-50 border-blue-200' 
                    : reminder.type === 'advertencia'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center mb-1">
                    <div className={`p-1 rounded mr-2 ${
                      reminder.type === 'importante' 
                        ? 'bg-blue-100 text-blue-600' 
                        : reminder.type === 'advertencia'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {reminder.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{reminder.title}</h3>
                  </div>
                  <p className="text-gray-600 text-xs">{reminder.message}</p>
                </div>
              ))}
            </div>
            
            {/* Información del Sistema - más compacta */}
            <div className="pt-3 border-t border-gray-200">
              <div className={`grid gap-3 text-xs text-gray-600 ${
                isSidebarCollapsed ? 'md:grid-cols-3' : 'md:grid-cols-3'
              }`}>
                <div>
                  <p className="font-medium mb-1">Horario de Atención</p>
                  <p>Lunes a Viernes<br/>8:00 a 18:00</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Tiempo de Aprobación</p>
                  <p>24-48 horas<br/>para reservas</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Contacto Soporte</p>
                  <p>soporte@institucion.edu.ve<br/>Ext. 1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Detalladas - más compactas */}
        <div className={`grid gap-4 mt-6 ${isSidebarCollapsed ? 'md:grid-cols-3' : 'md:grid-cols-3'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Reservas Aprobadas</p>
                <p className="text-xl font-bold text-gray-900">{reservationStats.approved}</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${approvedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">En Espera</p>
                <p className="text-xl font-bold text-gray-900">{reservationStats.pending}</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Canceladas</p>
                <p className="text-xl font-bold text-gray-900">{reservationStats.cancelled}</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${cancelledPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;