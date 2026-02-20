// src/dashboard/docente/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp,
  PlusCircle,
  ChevronRight,
  Users,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-slate-500 font-medium">Cargando dashboard...</p>
      </div>
    );
  }

  const { stats, proximas } = data;
  const getPercentage = (val) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  const chartData = [
    { name: 'Confirmadas', value: stats.confirmadas, color: '#1E3A8A' },
    { name: 'Pendientes', value: stats.pendientes, color: '#3B82F6' },
    { name: 'Rechazadas', value: stats.rechazadas, color: '#93C5FD' },
    { name: 'Canceladas', value: stats.canceladas || 0, color: '#DBEAFE' }
  ];

  let cumulativePercentage = 0;
  const chartSegments = chartData.map(item => {
    const itemPercentage = getPercentage(item.value);
    const startAngle = cumulativePercentage;
    const endAngle = cumulativePercentage + (itemPercentage / 100) * 360;
    cumulativePercentage = endAngle;
    return { ...item, startAngle, endAngle, itemPercentage };
  });

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Visualiza el estado de tus solicitudes y próximas reservas.
          </p>
        </div>
        <button 
          onClick={() => navigate('/docente/reservas/crear')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95 whitespace-nowrap text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva Reserva
        </button>
      </div>

      {/* RESUMEN SEMANAL */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
           <LayoutGrid size={240} className="text-blue-600" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Resumen de esta semana</h2>
            <p className="text-gray-600 text-sm font-medium">Tienes {proximas.length} reservas programadas para los próximos días.</p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div className="text-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/50 p-2 rounded-lg shadow-sm"><Calendar className="h-5 w-5 text-blue-600" /></div>
                <span className="text-2xl font-bold text-gray-900">{proximas.length}</span>
              </div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mt-1 text-left">Esta semana</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/50 p-2 rounded-lg shadow-sm"><Users className="h-5 w-5 text-blue-600" /></div>
                <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              </div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mt-1 text-left">Total histórico</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* GRÁFICO DE DISTRIBUCIÓN */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Distribución de reservas</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative flex-shrink-0">
              <svg width="170" height="170" viewBox="0 0 100 100" className="transform -rotate-90">
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
                <circle cx="50" cy="50" r="22" fill="white" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                 <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-2">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* BARRA VERTICAL en lugar de círculo */}
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIS PRÓXIMAS RESERVAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Mis Próximas Reservas</h2>
          <div className="space-y-3">
            {proximas.length > 0 ? proximas.map((reserva) => (
              <div key={reserva.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl hover:bg-blue-50 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{reserva.espacio.nombre}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      reserva.estado === 'confirmada' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {reserva.estado}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600 text-xs">
                      {(() => {
                        const datePart = reserva.fecha.split('T')[0];
                        const [year, month, day] = datePart.split('-');
                        const fechaAjustada = new Date(year, month - 1, day);
                        return fechaAjustada.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                      })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div className="flex items-center text-[10px] font-bold text-slate-500">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    {reserva.hora_inicio.split('T')[1]?.substring(0, 5) || reserva.hora_inicio.substring(0, 5)} - 
                    {reserva.hora_fin.split('T')[1]?.substring(0, 5) || reserva.hora_fin.substring(0, 5)}
                  </div>
                  <button 
                    onClick={() => navigate('/docente/reservas/historial')}
                    className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-0.5"
                  >
                    Ver
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <p className="text-xs italic">No hay reservas próximas.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TARJETAS INFERIORES */}
      <div className="grid gap-4 mt-6 md:grid-cols-5">
        {chartData.map((item, i) => {
          const percentage = getPercentage(item.value);
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-slate-900">{percentage}%</p>
                <div className="h-1 w-10 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Tendencia</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl font-bold text-green-600">+15%</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;