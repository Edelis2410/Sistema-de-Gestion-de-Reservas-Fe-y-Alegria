import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  TrendingUp,
  PieChart,
  Calendar,
  Filter
} from 'lucide-react';

const EstadosReserva = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  // Datos de ejemplo
  const estadisticas = {
    total: 24,
    aprobadas: 16,
    pendientes: 5,
    rechazadas: 2,
    canceladas: 1,
  };

  const reservasPorEstado = [
    {
      estado: 'aprobada',
      nombre: 'Aprobada',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      cantidad: estadisticas.aprobadas,
      porcentaje: Math.round((estadisticas.aprobadas / estadisticas.total) * 100),
      tendencia: '+2%',
    },
    {
      estado: 'pendiente',
      nombre: 'Pendiente',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      cantidad: estadisticas.pendientes,
      porcentaje: Math.round((estadisticas.pendientes / estadisticas.total) * 100),
      tendencia: '-1%',
    },
    {
      estado: 'rechazada',
      nombre: 'Rechazada',
      icon: <XCircle className="h-5 w-5" />,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      cantidad: estadisticas.rechazadas,
      porcentaje: Math.round((estadisticas.rechazadas / estadisticas.total) * 100),
      tendencia: '0%',
    },
    {
      estado: 'cancelada',
      nombre: 'Cancelada',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      cantidad: estadisticas.canceladas,
      porcentaje: Math.round((estadisticas.canceladas / estadisticas.total) * 100),
      tendencia: '-3%',
    },
  ];

  const reservasRecientes = [
    { id: 1, espacio: 'Sala de Conferencias A', fecha: '2024-01-15', estado: 'aprobada' },
    { id: 2, espacio: 'Laboratorio de Computación', fecha: '2024-01-16', estado: 'pendiente' },
    { id: 3, espacio: 'Auditorio Principal', fecha: '2024-01-17', estado: 'rechazada' },
    { id: 4, espacio: 'Sala de Estudio B', fecha: '2024-01-18', estado: 'aprobada' },
    { id: 5, espacio: 'Cancha Deportiva', fecha: '2024-01-19', estado: 'cancelada' },
  ];

  const periodos = [
    { value: 'dia', label: 'Hoy' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mes' },
    { value: 'año', label: 'Este año' },
  ];

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEstadoColor = (estado) => {
    const estadoObj = reservasPorEstado.find(e => e.estado === estado);
    return estadoObj ? estadoObj.bgColor : 'bg-gray-100';
  };

  const getEstadoTextColor = (estado) => {
    const estadoObj = reservasPorEstado.find(e => e.estado === estado);
    return estadoObj ? estadoObj.textColor : 'text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estados de Reserva</h1>
            <p className="text-gray-600">Monitoree el estado de todas sus reservas</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              >
                {periodos.map(periodo => (
                  <option key={periodo.value} value={periodo.value}>
                    {periodo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reservasPorEstado.map((estado, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-xl shadow-sm border ${estado.borderColor} p-6 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${estado.bgColor}`}>
                <div className={estado.textColor}>
                  {estado.icon}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className={`text-sm font-medium ${estado.textColor}`}>
                  {estado.tendencia}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {estado.cantidad}
            </h3>
            <p className={`font-medium ${estado.textColor} mb-2`}>
              {estado.nombre}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${estado.color}`}
                style={{ width: `${estado.porcentaje}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">{estado.porcentaje}% del total</span>
              <span className="text-xs font-medium text-gray-700">{estado.cantidad} reservas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos y detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico circular */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Distribución de Estados</h2>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-48 h-48 mb-8">
              {/* Gráfico circular con CSS */}
              <div className="absolute inset-0">
                <div className="w-full h-full rounded-full border-8 border-transparent"
                     style={{
                       borderTopColor: '#10B981',
                       borderRightColor: '#F59E0B',
                       borderBottomColor: '#EF4444',
                       borderLeftColor: '#6B7280',
                       transform: 'rotate(45deg)',
                       clipPath: `circle(50% at 50% 50%)`,
                     }}>
                </div>
              </div>
              
              {/* Porcentajes dentro del círculo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{estadisticas.total}</div>
                  <div className="text-sm text-gray-600">Total Reservas</div>
                </div>
              </div>
            </div>
            
            {/* Leyenda */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {reservasPorEstado.map((estado, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${estado.color}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{estado.nombre}</div>
                    <div className="text-xs text-gray-500">{estado.porcentaje}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalles por estado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Detalles por Estado</h2>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {reservasPorEstado.map((estado, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 ${estado.bgColor} border ${estado.borderColor} rounded-lg hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${estado.bgColor}`}>
                    <div className={estado.textColor}>
                      {estado.icon}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{estado.nombre}</div>
                    <div className="text-sm text-gray-600">{estado.cantidad} reservas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{estado.porcentaje}%</div>
                  <div className={`text-sm font-medium ${estado.textColor}`}>
                    {estado.tendencia}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reservas recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Reservas Recientes</h2>
          <div className="text-sm text-gray-500">
            Últimas 5 reservas
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservasRecientes.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    #{reserva.id.toString().padStart(3, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reserva.espacio}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatFecha(reserva.fecha)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center ${getEstadoColor(reserva.estado)} ${getEstadoTextColor(reserva.estado)}`}>
                      {reservasPorEstado.find(e => e.estado === reserva.estado)?.icon}
                      <span className="ml-1.5">
                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver detalles →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen general */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">Reservas Aprobadas</h3>
          <p className="text-blue-600 text-sm">
            La mayoría de tus reservas han sido aprobadas. Esto indica un buen uso del sistema.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Reservas Pendientes</h3>
          <p className="text-yellow-600 text-sm">
            Tienes algunas reservas pendientes de aprobación. Revisa su estado regularmente.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Tasa de Éxito</h3>
          <p className="text-gray-600 text-sm">
            <span className="font-bold text-green-600">
              {Math.round((estadisticas.aprobadas / estadisticas.total) * 100)}%
            </span> de tus reservas han sido exitosas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EstadosReserva;