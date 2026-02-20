// src/dashboard/admin/views/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, Clock, XCircle, TrendingUp,
  Users, Building, ChevronRight, AlertCircle, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-bold">Cargando panel...</p>
        </div>
      </div>
    );
  }

  // --- PALETA DE ALTO CONTRASTE ---
  const chartData = [
    { name: 'Confirmadas', value: data.confirmadas, color: '#1E3A8A' }, // Azul Marino
    { name: 'Pendientes', value: data.pendientes, color: '#3B82F6' },   // Azul Rey
    { name: 'Rechazadas', value: data.rechazadas, color: '#93C5FD' },   // Azul Cielo
  ];

  // Cálculo del total real (evitamos el || 1 para que muestre 0 si no hay nada)
  const totalRelevant = data.confirmadas + data.pendientes + data.rechazadas;

  // Función para porcentajes segura
  const getPercentage = (val) => totalRelevant > 0 ? Math.round((val / totalRelevant) * 100) : 0;

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
      {/* ENCABEZADO (igual que en Inicio/Dashboard) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrador</h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualiza el estado global de la institución.
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/reservas-listar')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap mt-4 md:mt-0"
        >
          <Clock className="h-4 w-4" />
          Ver Solicitudes
        </button>
      </div>

      {/* BANNER GLOBAL */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
           <LayoutGrid size={200} className="text-blue-600" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Estado Global de la Institución</h2>
            <p className="text-gray-600 text-sm">Resumen de activos y solicitudes actuales.</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="bg-blue-200/50 p-2 rounded-lg"><Users className="h-5 w-5 text-blue-700" /></div>
                <span className="text-2xl font-bold text-gray-900">{data.usuariosCount}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">Usuarios</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="bg-blue-200/50 p-2 rounded-lg"><Building className="h-5 w-5 text-blue-700" /></div>
                <span className="text-2xl font-bold text-gray-900">{data.espaciosCount}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">Espacios</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dona de Distribución */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Distribución de Reservas</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative flex-shrink-0">
              <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                {chartSegments.map((segment, index) => {
                  if (segment.endAngle === segment.startAngle) return null;
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
                <span className="text-2xl font-bold text-slate-900">{totalRelevant}</span>
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
                  {/* Número real para el Administrador */}
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Uso por Espacios */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Uso por Espacios</h2>
          <div className="space-y-4">
            {data.topEspacios.map((esp, i) => {
              const percentage = totalRelevant > 0 ? Math.round((esp.cantidad / totalRelevant) * 100) : 0;
              return (
                <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-lg mr-3 text-blue-600"><TrendingUp className="h-4 w-4" /></div>
                      <span className="font-bold text-gray-900 text-sm">{esp.nombre}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-700">{esp.cantidad} res.</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 h-2 bg-blue-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-lg font-black text-blue-900">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS INFERIORES */}
      <div className="grid gap-4 mt-8 md:grid-cols-5">
        {chartData.map((item, i) => {
          const percentage = getPercentage(item.value);
          return (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
                <div className="h-2 w-16 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* TARJETA DE TENDENCIA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="font-medium text-gray-900 text-sm">Tendencia</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-green-600">+15%</p>
            <div className="bg-green-100 p-1 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ALERTA DE SOLICITUDES PENDIENTES */}
      {data.pendientes > 0 && (
        <div className="mt-8 p-6 bg-blue-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 group">
          <div className="flex items-center gap-5 mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <AlertCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Solicitudes Pendientes</h3>
              <p className="text-blue-100 text-sm opacity-90">Hay {data.pendientes} reservas esperando respuesta.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/reservas-listar')}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black flex items-center gap-2 group-hover:scale-105 transition-transform"
          >
            GESTIONAR AHORA
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;