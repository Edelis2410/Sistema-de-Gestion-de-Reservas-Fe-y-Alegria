import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  CalendarDays,
  PlusCircle,
  ChevronRight,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, isSidebarCollapsed }) => {
  const navigate = useNavigate();
  
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

  // Solo 3 reservas próximas del docente
  const upcomingReservations = [
    {
      id: 1,
      espacio: 'CERPA',
      actividad: 'Conferencia de Innovación',
      fecha: '15 Ene',
      dia: 'Lunes',
      hora: '08:00 - 12:00',
      estado: 'confirmed',
      asistentes: 180,
      tipoActividad: 'Conferencia'
    },
    {
      id: 2,
      espacio: 'Salón Múltiple',
      actividad: 'Taller de Capacitación',
      fecha: '15 Ene',
      dia: 'Lunes',
      hora: '14:00 - 18:00',
      estado: 'confirmed',
      asistentes: 150,
      tipoActividad: 'Taller'
    },
    {
      id: 3,
      espacio: 'Sacramento',
      actividad: 'Reunión de Departamento',
      fecha: '16 Ene',
      dia: 'Martes',
      hora: '10:00 - 12:00',
      estado: 'pending',
      asistentes: 80,
      tipoActividad: 'Reunión'
    }
  ];

  // Resumen de la semana (solo con las 3 reservas)
  const weekSummary = {
    totalReservas: upcomingReservations.length,
    asistentesTotales: upcomingReservations.reduce((sum, r) => sum + r.asistentes, 0),
    horasTotales: upcomingReservations.length * 4 // estimado 4 horas por reserva
  };

  // Datos para el gráfico
  const chartData = [
    { 
      name: 'Aprobadas', 
      value: reservationStats.approved, 
      percentage: approvedPercentage, 
      color: '#1D4ED8',
      lightColor: '#DBEAFE',
      icon: CheckCircle
    },
    { 
      name: 'Pendientes', 
      value: reservationStats.pending, 
      percentage: pendingPercentage, 
      color: '#3B82F6',
      lightColor: '#E0F2FE',
      icon: Clock
    },
    { 
      name: 'Canceladas', 
      value: reservationStats.cancelled, 
      percentage: cancelledPercentage, 
      color: '#60A5FA',
      lightColor: '#F0F9FF',
      icon: XCircle
    }
  ];

  // Calcular ángulos para el gráfico de dona
  const total = chartData.reduce((sum, item) => sum + item.percentage, 0);
  let cumulativePercentage = 0;

  const chartSegments = chartData.map(item => {
    const segment = {
      ...item,
      startAngle: cumulativePercentage,
      endAngle: cumulativePercentage + (item.percentage / total) * 360
    };
    cumulativePercentage = segment.endAngle;
    return segment;
  });

  // Función para navegar al formulario de nueva reserva
  const handleNewReservation = () => {
    navigate('/docente/reservas/crear');
  };

  // Función para ver el historial completo de reservas
  const handleViewAllReservations = () => {
    navigate('/docente/reservas/historial');
  };

  // Función para ver detalles de una reserva específica
  const handleViewReservationDetails = (reservationId) => {
    navigate(`/docente/reservas/${reservationId}`);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado simplificado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <button 
            onClick={handleNewReservation}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Reserva
          </button>
        </div>

        {/* Resumen de la semana */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Resumen de esta semana</h2>
              <p className="text-gray-600 text-sm">Tienes {weekSummary.totalReservas} reservas programadas</p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{weekSummary.totalReservas}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Reservas</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{weekSummary.asistentesTotales}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Asistentes</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{weekSummary.horasTotales}h</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Horas reservadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico y Próximas Reservas */}
        <div className={`grid gap-6 ${isSidebarCollapsed ? 'lg:grid-cols-2' : 'lg:grid-cols-2'}`}>
          {/* Gráfico Circular - MEJORADO */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Distribución de reservas</h2>
                <p className="text-sm text-slate-500">Estado actual de tus reservas</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <Calendar className="h-4 w-4" />
                <span>Total: {reservationStats.total}</span>
              </div>
            </div>
            
            {reservationStats.total > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Gráfico de dona mejorado */}
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    {/* Fondo del gráfico */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-slate-50"></div>
                    </div>
                    
                    {/* Gráfico SVG */}
                    <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
                      {chartSegments.map((segment, index) => {
                        const startAngle = segment.startAngle;
                        const endAngle = segment.endAngle;
                        
                        // Convertir ángulos a coordenadas
                        const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                        const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                        const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                        const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                        
                        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                        
                        const pathData = [
                          `M ${startX} ${startY}`,
                          `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                          `L 50 50`
                        ].join(" ");
                        
                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={segment.color}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-300 hover:opacity-90"
                          />
                        );
                      })}
                      
                      {/* Círculo interior */}
                      <circle cx="50" cy="50" r="20" fill="white" />
                    </svg>
                    
                    {/* Texto central mejorado */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-semibold text-slate-900">{reservationStats.total}</span>
                        <div className="text-xs text-slate-500 mt-0.5">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leyenda mejorada */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="space-y-3">
                    {chartData.map((item, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center flex-1 min-w-0">
                            <div 
                              className="w-2 h-8 rounded-full mr-3"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" style={{ color: item.color }} />
                                <h3 className="text-sm font-medium text-slate-900 truncate">{item.name}</h3>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {item.value} reserva{item.value !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-2">
                            <span className="text-base font-semibold text-slate-900">{item.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-blue-200 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No hay reservas aún</h3>
                <p className="text-gray-500 text-xs">Comienza haciendo tu primera reserva de espacio.</p>
              </div>
            )}
          </div>

          {/* Próximas Reservas - SOLO 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Mis Próximas Reservas</h2>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CalendarDays className="h-4 w-4" />
                <span>{upcomingReservations.length} reservas</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {upcomingReservations.map((reserva) => (
                <div key={reserva.id} className="p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{reserva.espacio}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          reserva.estado === 'confirmed' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {reserva.estado === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{reserva.actividad}</p>
                      <p className="text-xs text-blue-600 mt-1">{reserva.tipoActividad}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-600 mb-1">{reserva.dia}</div>
                      <div className="font-bold text-gray-900">{reserva.fecha}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-blue-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        {reserva.hora}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                        {reserva.asistentes} asistentes
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewReservationDetails(reserva.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Detalles
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-blue-100">
                <button 
                  onClick={handleViewAllReservations}
                  className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center justify-center"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Ver Historial de Reservas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        <div className={`grid gap-4 mt-8 ${isSidebarCollapsed ? 'md:grid-cols-4' : 'md:grid-cols-4'}`}>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Aprobadas</p>
                  <p className="text-xs text-gray-600 mt-1">{reservationStats.approved} reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{approvedPercentage}%</p>
              <div className="h-2 w-20 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${approvedPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pendientes</p>
                  <p className="text-xs text-gray-600 mt-1">{reservationStats.pending} reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{pendingPercentage}%</p>
              <div className="h-2 w-20 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${pendingPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <XCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Canceladas</p>
                  <p className="text-xs text-gray-600 mt-1">{reservationStats.cancelled} reservas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{cancelledPercentage}%</p>
              <div className="h-2 w-20 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${cancelledPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tendencia</p>
                  <p className="text-xs text-gray-600 mt-1">Último mes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-green-600">+15%</p>
              <div className="h-2 w-20 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `75%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;