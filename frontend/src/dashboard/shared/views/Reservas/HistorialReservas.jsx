// src/dashboard/shared/views/Reservas/HistorialReservas.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  ChevronDown
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

  // Estado para el dropdown de filtro
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = localStorage.getItem('rol') === 'admin'; 
  
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', capacidad: 8, tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'CAPILLA', capacidad: 12, tipo: 'Espacio Espiritual' },
    { id: 3, nombre: 'SACRAMENTO', capacidad: 6, tipo: 'Salón de Eventos' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', capacidad: 20, tipo: 'Espacio Polivalente' },
  ];

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const response = await fetch('http://192.168.0.191:5000/api/reservas', {
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
            participantes: res.participantes || 1,
            fechaCreacion: res.fecha_creacion,
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
    { value: '', label: 'Todos' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'cancelada', label: 'Cancelada' },
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
    
    const isHidden = hiddenReservations.includes(reserva.id);
    if (showHidden) {
      return isHidden && matchesSearch && matchesFilter;
    } else {
      return !isHidden && matchesSearch && matchesFilter;
    }
  });

  const getEstadoColor = (estado) => {
    const colores = {
      confirmada: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      rechazada: 'bg-red-100 text-red-800',
      cancelada: 'bg-gray-100 text-gray-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      confirmada: <CheckCircle className="h-3 w-3" />,
      pendiente: <Clock className="h-3 w-3" />,
      rechazada: <XCircle className="h-3 w-3" />,
      cancelada: <AlertCircle className="h-3 w-3" />,
    };
    return iconos[estado] || <Clock className="h-3 w-3" />;
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      confirmada: 'Confirmada',
      pendiente: 'Pendiente',
      rechazada: 'Rechazada',
      cancelada: 'Cancelada',
    };
    return labels[estado] || estado;
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
      const response = await fetch(`http://192.168.0.191:5000/api/reservas/${reservaSeleccionada.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
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
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Historial de Reservas</h1>
            <p className="mt-1 text-sm text-slate-500">Gestión en tiempo real de sus espacios</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por espacio o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm bg-white transition-all"
              />
            </div>

            {/* Botón de filtro (estado) */}
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full sm:w-auto border rounded-lg px-4 py-2 bg-white outline-none shadow-sm flex items-center justify-between gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <span>{estados.find(e => e.value === filterStatus)?.label || 'Todos'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
                  {estados.map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => { setFilterStatus(estado.value); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        filterStatus === estado.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {estado.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón para alternar vista ocultas */}
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showHidden 
                  ? 'bg-purple-100 text-purple-700 border-purple-300' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {showHidden ? 'Ver todas' : 'Ver ocultas'}
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
        mensaje="La reserva ha sido cancelada correctamente."
      />
    </div>
  );
};

export default HistorialReservas;