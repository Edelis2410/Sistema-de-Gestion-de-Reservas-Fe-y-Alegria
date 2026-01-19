import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Save
} from 'lucide-react';

const HistorialReservas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los modales
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  
  // Estado para los datos de edición
  const [edicionData, setEdicionData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    espacio: '',
    motivo: ''
  });

  // Espacios disponibles del colegio - estos deben coincidir con CrearReserva
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', capacidad: 8, tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'CAPILLA', capacidad: 12, tipo: 'Espacio Espiritual' },
    { id: 3, nombre: 'SACRAMENTO', capacidad: 6, tipo: 'Salón de Eventos' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', capacidad: 20, tipo: 'Espacio Polivalente' },
  ];

  // Cargar reservas del localStorage al montar el componente
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    try {
      setLoading(true);
      const storedReservations = JSON.parse(localStorage.getItem('reservas')) || [];
      const sortedReservations = [...storedReservations].sort((a, b) => a.id - b.id);
      setReservas(sortedReservations);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const estados = [
    { value: '', label: 'Todos', icon: <Filter className="h-3 w-3" /> },
    { value: 'aprobada', label: 'Aprobada', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
    { value: 'rechazada', label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-3 w-3" /> },
  ];

  const obtenerInfoEspacio = (idEspacio) => {
    return espaciosDisponibles.find(e => e.id === idEspacio) || { nombre: 'Desconocido', capacidad: 0, tipo: '' };
  };

  const obtenerNombreEspacio = (idEspacio) => {
    const espacio = espaciosDisponibles.find(e => e.id === idEspacio);
    return espacio ? espacio.nombre : 'Espacio no encontrado';
  };

  const filteredReservas = reservas.filter(reserva => {
    const espacioNombre = obtenerNombreEspacio(reserva.espacio);
    const matchesSearch = 
      espacioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reserva.motivo || '').toLowerCase().includes(searchTerm.toLowerCase());
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

  // Modal: Ver Detalles
  const handleViewDetails = (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      setShowDetallesModal(true);
    }
  };

  // Modal: Editar
  const handleEditReserva = (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      // Preparar datos para edición
      setEdicionData({
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        espacio: reserva.espacio,
        motivo: reserva.motivo
      });
      setShowEditarModal(true);
    }
  };

  // Guardar cambios de edición
  const handleSaveEdit = () => {
    try {
      const updatedReservas = reservas.map(reserva => {
        if (reserva.id === reservaSeleccionada.id) {
          return {
            ...reserva,
            ...edicionData
          };
        }
        return reserva;
      });
      
      setReservas(updatedReservas);
      localStorage.setItem('reservas', JSON.stringify(updatedReservas));
      setShowEditarModal(false);
      alert('Reserva actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      alert('Error al actualizar la reserva');
    }
  };

  // Modal: Cancelar
  const handleDeleteClick = (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      setShowCancelarModal(true);
    }
  };

  // Confirmar cancelación
  const confirmDeleteReserva = () => {
    try {
      const updatedReservas = reservas.filter(reserva => reserva.id !== reservaSeleccionada.id);
      setReservas(updatedReservas);
      localStorage.setItem('reservas', JSON.stringify(updatedReservas));
      setShowCancelarModal(false);
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva');
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Convertir fecha para input type="date"
  const formatFechaForInput = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6">
      {/* Encabezado con barra de búsqueda y filtro a la derecha */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Historial de Reservas</h1>
            <p className="text-gray-600">Revise todas sus reservas realizadas</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por espacio o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-96"
              />
            </div>
            
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
          </div>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        ) : (
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
                  filteredReservas.map(reserva => {
                    const espacioInfo = obtenerInfoEspacio(reserva.espacio);
                    return (
                      <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{reserva.id.toString().padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{espacioInfo.nombre}</div>
                          <div className="text-xs text-gray-500">
                            {espacioInfo.tipo} • Capacidad: {espacioInfo.capacidad} personas
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
                            {reserva.participantes || 1} participante(s)
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
                              disabled={reserva.estado === 'aprobada' || reserva.estado === 'rechazada' || reserva.estado === 'cancelada'}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(reserva.id)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancelar"
                              disabled={reserva.estado === 'rechazada' || reserva.estado === 'cancelada'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No hay reservas</p>
                        <p className="text-sm mb-4">Cuando realices una reserva, aparecerá aquí</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Mostrando {filteredReservas.length} de {reservas.length} reservas</p>
        <p className="mt-1 text-xs text-gray-500">
          Las reservas se guardan localmente en tu navegador.
        </p>
      </div>

      {/* Modal: Ver Detalles */}
      {showDetallesModal && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Detalles de la Reserva</h3>
              <button
                onClick={() => setShowDetallesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">ID</h4>
                <p className="text-lg font-semibold">#{reservaSeleccionada.id.toString().padStart(2, '0')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Espacio</h4>
                <p className="text-gray-800">{obtenerNombreEspacio(reservaSeleccionada.espacio)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha</h4>
                <p className="text-gray-800">{formatFecha(reservaSeleccionada.fecha)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Horario</h4>
                <p className="text-gray-800">{reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Título/Motivo</h4>
                <p className="text-gray-800">{reservaSeleccionada.motivo}</p>
              </div>
            </div>
            
            <div className="p-6 border-t">
              <button
                onClick={() => setShowDetallesModal(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Reserva */}
      {showEditarModal && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Editar Reserva</h3>
              <button
                onClick={() => setShowEditarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espacio
                </label>
                <select
                  value={edicionData.espacio}
                  onChange={(e) => setEdicionData({...edicionData, espacio: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {espaciosDisponibles.map(espacio => (
                    <option key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formatFechaForInput(edicionData.fecha)}
                  onChange={(e) => setEdicionData({...edicionData, fecha: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={edicionData.horaInicio}
                    onChange={(e) => setEdicionData({...edicionData, horaInicio: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={edicionData.horaFin}
                    onChange={(e) => setEdicionData({...edicionData, horaFin: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título/Motivo
                </label>
                <input
                  type="text"
                  value={edicionData.motivo}
                  onChange={(e) => setEdicionData({...edicionData, motivo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el motivo de la reserva"
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex space-x-3">
              <button
                onClick={() => setShowEditarModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cancelar Reserva */}
      {showCancelarModal && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Cancelar Reserva</h3>
              <button
                onClick={() => setShowCancelarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              
              <p className="text-center text-gray-700 mb-2">
                ¿Estás seguro de que deseas cancelar la reserva?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-medium text-gray-800">#{reservaSeleccionada.id.toString().padStart(2, '0')} - {reservaSeleccionada.motivo}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {obtenerNombreEspacio(reservaSeleccionada.espacio)} • {formatFecha(reservaSeleccionada.fecha)}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelarModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No, mantener
                </button>
                <button
                  onClick={confirmDeleteReserva}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialReservas;