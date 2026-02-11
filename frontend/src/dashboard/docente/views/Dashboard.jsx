// src/dashboard/docente/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  CalendarDays,
  PlusCircle,
  ChevronRight,
  Users,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocenteStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/docente/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Error cargando dashboard docente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocenteStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600 font-bold">Cargando...</div>
      </div>
    );
  }

  const { stats, proximas } = data;
  const getPercentage = (val) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  // --- ESCALA DE AZULES CON ALTO CONTRASTE ---
  const chartData = [
    { name: 'Confirmadas', value: stats.confirmadas, percentage: getPercentage(stats.confirmadas), color: '#1E3A8A' }, // Azul Marino
    { name: 'Pendientes', value: stats.pendientes, percentage: getPercentage(stats.pendientes), color: '#3B82F6' },  // Azul Rey
    { name: 'Rechazadas', value: stats.rechazadas, percentage: getPercentage(stats.rechazadas), color: '#93C5FD' },  // Azul Cielo
    { name: 'Canceladas', value: stats.canceladas || 0, percentage: getPercentage(stats.canceladas || 0), color: '#DBEAFE' } // Azul Hielo
  ];

  let cumulativePercentage = 0;
  const chartSegments = chartData.map(item => {
    const startAngle = cumulativePercentage;
    const endAngle = cumulativePercentage + (item.percentage / 100) * 360;
    cumulativePercentage = endAngle;
    return { ...item, startAngle, endAngle };
  });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={() => navigate('/docente/reservas/crear')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Reserva
          </button>
        </div>

        {/* RESUMEN SEMANAL */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
             <LayoutGrid size={200} className="text-blue-600" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Resumen de esta semana</h2>
              <p className="text-gray-600 text-sm">Tienes {proximas.length} reservas programadas</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="h-5 w-5 text-blue-600" /></div>
                  <span className="text-2xl font-bold text-gray-900">{proximas.length}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Reservas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                  <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Total Histórico</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* GRÁFICO DE DISTRIBUCIÓN */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Distribución de reservas</h2>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                  {chartSegments.map((segment, index) => {
                    if (segment.startAngle === segment.endAngle) return null;
                    const startX = 50 + 40 * Math.cos((segment.startAngle * Math.PI) / 180);
                    const startY = 50 + 40 * Math.sin((segment.startAngle * Math.PI) / 180);
                    const endX = 50 + 40 * Math.cos((segment.endAngle * Math.PI) / 180);
                    const endY = 50 + 40 * Math.sin((segment.endAngle * Math.PI) / 180);
                    const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";
                    return (
                      <path key={index} d={`M ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} L 50 50`} 
                            fill={segment.color} stroke="white" strokeWidth="2" />
                    );
                  })}
                  <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                   <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-8 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRÓXIMAS RESERVAS */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Mis Próximas Reservas</h2>
            <div className="space-y-4">
              {proximas.map((reserva) => (
                <div key={reserva.id} className="p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{reserva.espacio.nombre}</h3>
                      <span className="text-xs text-blue-600 font-medium uppercase">{reserva.estado}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {(() => {
                          const datePart = reserva.fecha.split('T')[0];
                          const [year, month, day] = datePart.split('-');
                          const fechaAjustada = new Date(year, month - 1, day);
                          return fechaAjustada.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-blue-100">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        {reserva.hora_inicio.includes('T') ? reserva.hora_inicio.split('T')[1].substring(0, 5) : reserva.hora_inicio} - 
                        {reserva.hora_fin.includes('T') ? reserva.hora_fin.split('T')[1].substring(0, 5) : reserva.hora_fin}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/docente/reservas/historial')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Detalles
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS INFERIORES */}
        <div className="grid gap-4 mt-8 md:grid-cols-5">
          {chartData.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900">{item.percentage}%</p>
                <div className="h-2 w-16 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="font-medium text-gray-900 text-sm">Tendencia</p>
            <p className="text-2xl font-bold text-green-600 mt-2">+15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;