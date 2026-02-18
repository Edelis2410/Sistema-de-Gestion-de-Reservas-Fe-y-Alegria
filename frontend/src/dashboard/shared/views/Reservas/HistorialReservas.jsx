// src/dashboard/shared/views/Reservas/HistorialReservas.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Importar modales compartidos
import DetallesReservaModal from '../../components/DetallesReservaModal';
import CancelarReservaModal from '../../components/CancelarReservaModal';

// Componente SuccessModal interno
const SuccessModal = ({ isOpen, onClose, mensaje }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 text-center">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Completado!</h3>
        <p className="text-gray-600 mb-6">{mensaje}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

const HistorialReservas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los modales
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Estados para ocultar reservas
  const [hiddenReservations, setHiddenReservations] = useState([]);
  const [showHidden, setShowHidden] = useState(false);

  const isAdmin = localStorage.getItem('rol') === 'admin'; 
  
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', capacidad: 8, tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'CAPILLA', capacidad: 12, tipo: 'Espacio Espiritual' },
    { id: 3, nombre: 'SACRAMENTO', capacidad: 6, tipo: 'Salón de Eventos' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', capacidad: 20, tipo: 'Espacio Polivalente' },
  ];

  // Cargar IDs ocultos desde localStorage al iniciar
  useEffect(() => {
    const storedHidden = localStorage.getItem('hiddenReservations');
    if (storedHidden) {
      try {
        setHiddenReservations(JSON.parse(storedHidden));
      } catch (e) {
        console.error('Error parsing hidden reservations', e);
      }
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        const ordenadasPorCreacion = result.data.sort((a, b) => a.id - b.id);

        const reservasMapeadas = ordenadasPorCreacion.map((res, index) => {
          const hInicio = new Date(res.hora_inicio);
          const hFin = new Date(res.hora_fin);
          const horaInicioFormateada = `${hInicio.getUTCHours().toString().padStart(2, '0')}:${hInicio.getUTCMinutes().toString().padStart(2, '0')}`;
          const horaFinFormateada = `${hFin.getUTCHours().toString().padStart(2, '0')}:${hFin.getUTCMinutes().toString().padStart(2, '0')}`;

          return {
            id: res.id,
            numeroVisual: index + 1,
            usuarioId: res.usuario_id,
            espacio: res.espacio_id,
            espacioNombre: res.espacio.nombre,
            fecha: res.fecha,
            horaInicio: horaInicioFormateada, 
            horaFin: horaFinFormateada,       
            motivo: res.titulo,
            estado: res.estado, 
            participantes: res.participantes || 1
          };
        });
        
        setReservas(reservasMapeadas);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const estados = [
    { value: '', label: 'Todos', icon: <Filter className="h-3 w-3" /> },
    { value: 'confirmada', label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
    { value: 'rechazada', label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-3 w-3" /> },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-3 w-3" /> },
  ];

  const obtenerNombreEspacio = (idEspacio) => {
    const espacio = espaciosDisponibles.find(e => e.id === idEspacio);
    return espacio ? espacio.nombre : 'Espacio Reservado';
  };

  // Filtrar según búsqueda, estado y visibilidad (ocultas/no ocultas)
  const filteredReservas = reservas.filter(reserva => {
    const espacioNombre = (reserva.espacioNombre || obtenerNombreEspacio(reserva.espacio)).toLowerCase();
    const motivo = (reserva.motivo || '').toLowerCase();
    const busqueda = searchTerm.toLowerCase();
    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchesSearch = normalizar(espacioNombre).includes(normalizar(busqueda)) || normalizar(motivo).includes(normalizar(busqueda));
    const matchesFilter = !filterStatus || reserva.estado === filterStatus;
    
    // Filtro de ocultas
    const isHidden = hiddenReservations.includes(reserva.id);
    if (showHidden) {
      return isHidden && matchesSearch && matchesFilter;
    } else {
      return !isHidden && matchesSearch && matchesFilter;
    }
  });

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.icon : <Clock className="h-3 w-3" />;
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  const handleViewDetails = (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) { setReservaSeleccionada({ ...reserva, displayId: reserva.numeroVisual }); setShowDetallesModal(true); }
  };

  const handleDeleteClick = (id) => {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) { setReservaSeleccionada({ ...reserva, displayId: reserva.numeroVisual }); setShowCancelarModal(true); }
  };

  const confirmDeleteReserva = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservas/${reservaSeleccionada.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        // Eliminar también de la lista de ocultas si estaba
        setHiddenReservations(prev => {
          const newHidden = prev.filter(id => id !== reservaSeleccionada.id);
          localStorage.setItem('hiddenReservations', JSON.stringify(newHidden));
          return newHidden;
        });
        setShowCancelarModal(false);
        setShowSuccessModal(true);
        loadReservations(); 
      }
    } catch (error) { alert('❌ Error de conexión'); }
  };

  // Función para ocultar/restaurar reserva
  const toggleHideReservation = (id) => {
    setHiddenReservations(prev => {
      let newHidden;
      if (prev.includes(id)) {
        newHidden = prev.filter(h => h !== id);
      } else {
        newHidden = [...prev, id];
      }
      localStorage.setItem('hiddenReservations', JSON.stringify(newHidden));
      return newHidden;
    });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className="p-6">
      <div className="mb-6 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Historial de Reservas</h1>
            <p className="text-gray-600">Gestión en tiempo real de sus espacios</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Botón para alternar vista ocultas - MÁS PEQUEÑO Y SIN ÍCONO */}
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                showHidden 
                  ? 'bg-purple-100 text-purple-700 border-purple-300' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {showHidden ? 'Ver todas' : 'Ver ocultas'}
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por espacio o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 w-full md:w-96"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 min-w-[150px]"
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-left">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando historial...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservas.map(reserva => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {reserva.numeroVisual.toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{reserva.espacioNombre}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatFecha(reserva.fecha)}</div>
                      <div className="text-xs text-gray-500">{reserva.horaInicio} - {reserva.horaFin}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{reserva.motivo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoIcon(reserva.estado)}
                        <span className="ml-1.5 capitalize">{getEstadoLabel(reserva.estado)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleViewDetails(reserva.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {/* Botón para ocultar/restaurar */}
                        <button
                          onClick={() => toggleHideReservation(reserva.id)}
                          className={`p-1.5 rounded-lg ${
                            hiddenReservations.includes(reserva.id)
                              ? 'text-purple-600 hover:bg-purple-50'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={hiddenReservations.includes(reserva.id) ? 'Restaurar' : 'Ocultar'}
                        >
                          {hiddenReservations.includes(reserva.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>

                        <button 
                          onClick={() => handleDeleteClick(reserva.id)} 
                          disabled={!isAdmin && reserva.estado !== 'pendiente'} 
                          className={`p-1.5 rounded-lg ${isAdmin || reserva.estado === 'pendiente' ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetallesModal && (
        <DetallesReservaModal 
          reservaSeleccionada={reservaSeleccionada} 
          setShowDetallesModal={setShowDetallesModal} 
          obtenerNombreEspacio={obtenerNombreEspacio} 
          formatFecha={formatFecha} 
        />
      )}
      
      {showCancelarModal && (
        <CancelarReservaModal 
          reservaSeleccionada={reservaSeleccionada} 
          setShowCancelarModal={setShowCancelarModal} 
          obtenerNombreEspacio={obtenerNombreEspacio} 
          formatFecha={formatFecha} 
          confirmDeleteReserva={confirmDeleteReserva} 
        />
      )}

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        mensaje="La reserva ha sido procesada correctamente."
      />
    </div>
  );
};

export default HistorialReservas;