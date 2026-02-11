// src/services/reservationService.js
import { authFetch } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';

// ======================
// FUNCIONES DE RESERVAS (API REAL)
// ======================

/**
 * Obtiene todas las reservas (según rol del usuario)
 */
export const getReservations = async () => {
  try {
    const response = await authFetch(`${API_URL}/reservas`);
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener reservas');
    }

    return data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    throw new Error(error.message || 'No se pudieron cargar las reservas');
  }
};

/**
 * Obtiene reservas pendientes (solo para administradores)
 */
export const getPendingReservations = async () => {
  try {
    const response = await authFetch(`${API_URL}/reservas/pendientes`);
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener reservas pendientes');
    }

    return data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener reservas pendientes:', error);
    throw new Error(error.message || 'No se pudieron cargar las reservas pendientes');
  }
};

/**
 * Crea una nueva reserva
 */
export const createReservation = async (reservationData) => {
  try {
    // Validaciones básicas
    if (!reservationData.espacio_id || !reservationData.titulo || 
        !reservationData.fecha || !reservationData.hora_inicio || !reservationData.hora_fin) {
      throw new Error('Todos los campos obligatorios deben ser completados');
    }

    if (reservationData.hora_inicio >= reservationData.hora_fin) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin');
    }

    const response = await authFetch(`${API_URL}/reservas`, {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al crear reserva');
    }

    return {
      success: true,
      reservation: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cancela una reserva
 */
export const cancelReservation = async (id) => {
  try {
    const response = await authFetch(`${API_URL}/reservas/${id}`, {
      method: 'DELETE'
    });
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al cancelar reserva');
    }

    return {
      success: true,
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('❌ Error al cancelar reserva:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Aprueba una reserva (solo administrador)
 */
export const approveReservation = async (id) => {
  try {
    const response = await authFetch(`${API_URL}/reservas/${id}/aprobar`, {
      method: 'PUT'
    });
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al aprobar reserva');
    }

    return {
      success: true,
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('❌ Error al aprobar reserva:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Rechaza una reserva (solo administrador)
 */
export const rejectReservation = async (id, motivo) => {
  try {
    if (!motivo || motivo.trim().length < 5) {
      throw new Error('El motivo del rechazo debe tener al menos 5 caracteres');
    }

    const response = await authFetch(`${API_URL}/reservas/${id}/rechazar`, {
      method: 'PUT',
      body: JSON.stringify({ motivo: motivo.trim() })
    });
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al rechazar reserva');
    }

    return {
      success: true,
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('❌ Error al rechazar reserva:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ======================
// FUNCIONES DE ESPACIOS (API REAL)
// ======================

/**
 * Obtiene todos los espacios
 */
export const getSpaces = async () => {
  try {
    const response = await authFetch(`${API_URL}/espacios`);
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener espacios');
    }

    return data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener espacios:', error);
    throw new Error(error.message || 'No se pudieron cargar los espacios');
  }
};

/**
 * Obtiene un espacio por ID
 */
export const getSpaceById = async (id) => {
  try {
    const response = await authFetch(`${API_URL}/espacios/${id}`);
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener espacio');
    }

    return data.data || null;
  } catch (error) {
    console.error('❌ Error al obtener espacio:', error);
    throw new Error(error.message || 'No se pudo cargar el espacio');
  }
};

/**
 * Crea un nuevo espacio (solo administrador)
 */
export const createSpace = async (spaceData) => {
  try {
    const response = await authFetch(`${API_URL}/espacios`, {
      method: 'POST',
      body: JSON.stringify(spaceData)
    });
    
    if (!response) {
      throw new Error('Sesión expirada o no autenticado');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al crear espacio');
    }

    return {
      success: true,
      space: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('❌ Error al crear espacio:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ======================
// FUNCIONES DE UTILIDAD
// ======================

/**
 * Verifica disponibilidad de espacio
 */
export const checkSpaceAvailability = async (espacioId, fecha, hora_inicio, hora_fin) => {
  try {
    const response = await authFetch(
      `${API_URL}/espacios/${espacioId}/disponibilidad?fecha=${fecha}&hora_inicio=${hora_inicio}&hora_fin=${hora_fin}`
    );
    
    if (!response) {
      return { disponible: false, conflictos: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error verificando disponibilidad:', error);
    return { disponible: false, conflictos: [], error: error.message };
  }
};

/**
 * Formatea fecha para mostrar
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea fecha corta
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

/**
 * Formatea hora
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch (error) {
    return timeString;
  }
};

/**
 * Calcula duración en horas
 */
export const calculateDuration = (horaInicio, horaFin) => {
  try {
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFin.split(':').map(Number);
    
    const startMinutes = h1 * 60 + m1;
    const endMinutes = h2 * 60 + m2;
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, totalMinutes: durationMinutes };
  } catch (error) {
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }
};

/**
 * Obtiene el color del estado
 */
export const getStatusColor = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmada':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rechazada':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelada':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Obtiene el texto del estado
 */
export const getStatusText = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente de aprobación';
    case 'confirmada':
      return 'Confirmada';
    case 'rechazada':
      return 'Rechazada';
    case 'cancelada':
      return 'Cancelada';
    default:
      return estado;
  }
};

// Exportar constantes para compatibilidad
export const RESERVATION_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmada',
  REJECTED: 'rechazada',
  CANCELLED: 'cancelada'
};

/**
 * Verifica si una reserva puede ser cancelada
 */
export const canCancelReservation = (reservation, user) => {
  if (!reservation || !user) return false;
  
  // Administradores pueden cancelar cualquier reserva
  if (user.rol === 'administrador') return true;
  
  // Docentes solo pueden cancelar sus propias reservas pendientes o confirmadas dentro de 24h
  if (user.rol === 'docente' && reservation.usuario_id === user.id) {
    if (reservation.estado === 'cancelada' || reservation.estado === 'rechazada') {
      return false;
    }
    
    // Verificar 24 horas desde creación
    const createdDate = new Date(reservation.fecha_creacion);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  }
  
  return false;
};