import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

const HistorialReservas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Datos de ejemplo de reservas
  const reservas = [
    { 
      id: 1, 
      espacio: 'Sala de Conferencias A', 
      fecha: '2024-01-15', 
      horaInicio: '09:00', 
      horaFin: '11:00', 
      motivo: 'Reunión de Departamento',
      estado: 'aprobada',
      fechaSolicitud: '2024-01-10',
      capacidad: 20,
      participantes: 15
    },
    { 
      id: 2, 
      espacio: 'Laboratorio de Computación', 
      fecha: '2024-01-16', 
      horaInicio: '14:00', 
      horaFin: '16:00', 
      motivo: 'Clase de Programación',
      estado: 'pendiente',
      fechaSolicitud: '2024-01-11',
      capacidad: 30,
      participantes: 25
    },
    { 
      id: 3, 
      espacio: 'Auditorio Principal', 
      fecha: '2024-01-17', 
      horaInicio: '10:00', 
      horaFin: '12:00', 
      motivo: 'Conferencia Académica',
      estado: 'rechazada',
      fechaSolicitud: '2024-01-12',
      capacidad: 100,
      participantes: 80
    },
    { 
      id: 4, 
      espacio: 'Sala de Estudio B', 
      fecha: '2024-01-18', 
      horaInicio: '08:00', 
      horaFin: '10:00', 
      motivo: 'Estudio Grupal',
      estado: 'cancelada',
      fechaSolicitud: '2024-01-13',
      capacidad: 10,
      participantes: 8
    },
    { 
      id: 5, 
      espacio: 'Cancha Deportiva', 
      fecha: '2024-01-19', 
      horaInicio: '16:00', 
      horaFin: '18:00', 
      motivo: 'Torneo de Fútbol',
      estado: 'aprobada',
      fechaSolicitud: '2024-01-14',
      capacidad: 50,
      participantes: 40
    },
  ];

  const estados = [
    { value: '', label: 'Todos', icon: <Filter className="h-3 w-3" /> },
    { value: 'aprobada', label: 'Aprobada', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
    { value: 'rechazada', label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-3 w-3" /> },
  ];

  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = 
      reserva.espacio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || reserva.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.icon : <Clock className="h-3 w-3" />;
  };

  const handleViewDetails = (id) => {
    console.log(`Ver detalles de reserva ${id}`);
    // Aquí iría la lógica para ver detalles
  };

  const handleEditReserva = (id) => {
    console.log(`Editar reserva ${id}`);
    // Aquí iría la lógica para editar
  };

  const handleDeleteReserva = (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      console.log(`Cancelar reserva ${id}`);
      // Aquí iría la lógica para cancelar
    }
  };

  const handleExport = () => {
    console.log('Exportando historial...');
    // Aquí iría la lógica para exportar
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Reservas</h1>
        <p className="text-gray-600">Revise todas sus reservas realizadas</p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 md:mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por espacio o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-800">{reservas.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-800">{reservas.filter(r => r.estado === 'aprobada').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">{reservas.filter(r => r.estado === 'pendiente').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-800">{reservas.filter(r => r.estado === 'rechazada').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservas.length > 0 ? (
                filteredReservas.map(reserva => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reserva.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{reserva.espacio}</div>
                      <div className="text-xs text-gray-500">
                        Capacidad: {reserva.capacidad} personas
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatFecha(reserva.fecha)}</div>
                          <div className="text-xs text-gray-500">
                            {reserva.horaInicio} - {reserva.horaFin}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reserva.motivo}</div>
                      <div className="text-xs text-gray-500">
                        {reserva.participantes} participantes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={getEstadoColor(reserva.estado)}>
                          <span className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center">
                            {getEstadoIcon(reserva.estado)}
                            <span className="ml-1.5">
                              {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(reserva.id)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditReserva(reserva.id)}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar"
                          disabled={reserva.estado === 'aprobada' || reserva.estado === 'rechazada'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReserva(reserva.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancelar"
                          disabled={reserva.estado === 'rechazada' || reserva.estado === 'cancelada'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No se encontraron reservas</p>
                      <p className="text-sm">Intenta con otros criterios de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Mostrando {filteredReservas.length} de {reservas.length} reservas</p>
      </div>
    </div>
  );
};

export default HistorialReservas;