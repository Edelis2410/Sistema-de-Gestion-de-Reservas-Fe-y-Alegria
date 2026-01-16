import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  Filter,
  Building,
  BookOpen,
  Users,
  Church,
  Search,
  X
} from 'lucide-react';

const EstadosReserva = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [reservasReales, setReservasReales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Espacios disponibles del colegio (deben coincidir con CrearReserva)
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', icon: <Building className="h-4 w-4" />, tipo: 'Auditorio Principal', capacidad: 8 },
    { id: 2, nombre: 'CAPILLA', icon: <Church className="h-4 w-4" />, tipo: 'Espacio Espiritual', capacidad: 12 },
    { id: 3, nombre: 'SACRAMENTO', icon: <BookOpen className="h-4 w-4" />, tipo: 'Salón de Eventos', capacidad: 6 },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', icon: <Users className="h-4 w-4" />, tipo: 'Espacio Polivalente', capacidad: 20 },
  ];

  // Reservas de ejemplo con IDs 1-4 (orden ascendente)
  const reservasEjemplo = [
    { 
      id: 1, 
      espacio: 1, // CERPA
      fecha: '2026-01-15', 
      horaInicio: '10:00',
      horaFin: '12:00',
      motivo: 'Reunión de Directores',
      descripcion: 'Reunión mensual del equipo directivo',
      estado: 'aprobada',
      fechaSolicitud: '2026-01-10',
      participantes: 6,
      capacidad: 8
    },
    { 
      id: 2, 
      espacio: 2, // CAPILLA
      fecha: '2026-01-20', 
      horaInicio: '08:00',
      horaFin: '10:00',
      motivo: 'Retiro Espiritual',
      descripcion: 'Retiro para el personal administrativo',
      estado: 'rechazada',
      fechaSolicitud: '2026-01-12',
      participantes: 10,
      capacidad: 12
    },
    { 
      id: 3, 
      espacio: 3, // SACRAMENTO
      fecha: '2026-02-01', 
      horaInicio: '14:00',
      horaFin: '16:00',
      motivo: 'Taller de Innovación',
      descripcion: 'Taller sobre nuevas metodologías educativas',
      estado: 'aprobada',
      fechaSolicitud: '2026-01-25',
      participantes: 5,
      capacidad: 6
    },
    { 
      id: 4, 
      espacio: 4, // SALÓN MÚLTIPLE
      fecha: '2026-02-05', 
      horaInicio: '09:00',
      horaFin: '13:00',
      motivo: 'Feria de Ciencias',
      descripcion: 'Presentación de proyectos científicos estudiantiles',
      estado: 'pendiente',
      fechaSolicitud: '2026-01-30',
      participantes: 15,
      capacidad: 20
    },
  ];

  // Cargar reservas reales del localStorage
  useEffect(() => {
    const loadReservations = () => {
      try {
        setLoading(true);
        const storedReservations = JSON.parse(localStorage.getItem('reservas')) || [];
        
        // Asignar IDs consecutivos a partir del 5 para las reservas reales
        const reservasConIdsConsecutivos = storedReservations.map((reserva, index) => ({
          ...reserva,
          id: 5 + index, // Empiezan en 5 porque 1-4 son de ejemplo
        }));
        
        setReservasReales(reservasConIdsConsecutivos);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
        setReservasReales([]);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', loadReservations);
    
    return () => {
      window.removeEventListener('storage', loadReservations);
    };
  }, []);

  // Combinar reservas: ejemplo + reales y ordenar por ID ascendente
  const allReservations = [...reservasEjemplo, ...reservasReales].sort((a, b) => a.id - b.id);

  // Calcular estadísticas basadas en todas las reservas (solo aprobada, pendiente, rechazada)
  const calcularEstadisticas = () => {
    const total = allReservations.length;
    const aprobadas = allReservations.filter(r => r.estado === 'aprobada').length;
    const pendientes = allReservations.filter(r => r.estado === 'pendiente').length;
    const rechazadas = allReservations.filter(r => r.estado === 'rechazada').length;

    return {
      total,
      aprobadas,
      pendientes,
      rechazadas
    };
  };

  const estadisticas = calcularEstadisticas();

  // Solo tres estados: aprobada, pendiente, rechazada
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
      porcentaje: estadisticas.total > 0 ? Math.round((estadisticas.aprobadas / estadisticas.total) * 100) : 0,
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
      porcentaje: estadisticas.total > 0 ? Math.round((estadisticas.pendientes / estadisticas.total) * 100) : 0,
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
      porcentaje: estadisticas.total > 0 ? Math.round((estadisticas.rechazadas / estadisticas.total) * 100) : 0,
    },
  ];

  // Filtrar reservas según búsqueda - VERSIÓN SIMPLIFICADA
  const filtrarReservas = () => {
    if (!searchTerm.trim()) {
      return allReservations.slice(0, 10); // Mostrar las primeras 10 si no hay búsqueda
    }

    const termino = searchTerm.toLowerCase().trim();
    
    return allReservations.filter(reserva => {
      try {
        // Buscar en campos seguros
        const nombreEspacio = obtenerNombreEspacio(reserva.espacio).toLowerCase();
        const motivo = (reserva.motivo || '').toLowerCase();
        const estado = (reserva.estado || '').toLowerCase();
        const idStr = reserva.id.toString();
        
        return nombreEspacio.includes(termino) ||
               motivo.includes(termino) ||
               estado.includes(termino) ||
               idStr.includes(termino);
      } catch (error) {
        console.error('Error en filtro para reserva:', reserva, error);
        return false;
      }
    });
  };

  const reservasFiltradas = filtrarReservas();

  const periodos = [
    { value: 'dia', label: 'Hoy' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mes' },
    { value: 'año', label: 'Este año' },
  ];

  // Función para obtener el nombre del espacio por ID
  const obtenerNombreEspacio = (idEspacio) => {
    const espacio = espaciosDisponibles.find(e => e.id === idEspacio);
    return espacio ? espacio.nombre : 'Espacio no encontrado';
  };

  // Función para obtener el icono del espacio por ID
  const obtenerIconoEspacio = (idEspacio) => {
    const espacio = espaciosDisponibles.find(e => e.id === idEspacio);
    return espacio ? espacio.icon : <Building className="h-4 w-4" />;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
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
            <p className="text-gray-600">
              {estadisticas.total === 0 
                ? 'No hay reservas aún' 
                : `Monitoree el estado de ${estadisticas.total} reservas`}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar reservas por ID, espacio, motivo o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-96"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filtro de período */}
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

      {/* Tabla de Reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Reservas</h2>
          <div className="text-sm text-gray-500">
            {searchTerm 
              ? `Mostrando ${reservasFiltradas.length} resultados`
              : `Mostrando ${Math.min(allReservations.length, 10)} reservas`}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm
                ? 'No se encontraron reservas con tu búsqueda'
                : 'No hay reservas'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primera reserva'}
            </p>
          </div>
        ) : (
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
                {reservasFiltradas.map((reserva) => {
                  return (
                    <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{reserva.id.toString().padStart(2, '0')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-blue-500">
                            {obtenerIconoEspacio(reserva.espacio)}
                          </div>
                          <span className="text-sm text-gray-900">
                            {obtenerNombreEspacio(reserva.espacio)}
                          </span>
                        </div>
                      </td>
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
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => {
                            const espacioInfo = espaciosDisponibles.find(e => e.id === reserva.espacio);
                            alert(
                              `📋 DETALLES DE LA RESERVA\n\n` +
                              `ID: #${reserva.id.toString().padStart(2, '0')}\n` +
                              `Espacio: ${espacioInfo?.nombre || 'Desconocido'}\n` +
                              `Ubicación: ${espacioInfo?.tipo || 'No especificado'}\n` +
                              `Capacidad: ${espacioInfo?.capacidad || 'N/A'} personas\n` +
                              `Fecha: ${formatFecha(reserva.fecha)}\n` +
                              `Horario: ${reserva.horaInicio || '--:--'} - ${reserva.horaFin || '--:--'}\n` +
                              `Motivo: ${reserva.motivo || 'No especificado'}\n` +
                              `Participantes: ${reserva.participantes || 1}\n` +
                              `Estado: ${reserva.estado.toUpperCase()}\n` +
                              `Descripción: ${reserva.descripcion || 'Sin descripción adicional'}`
                            );
                          }}
                        >
                          Ver detalles →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadosReserva;