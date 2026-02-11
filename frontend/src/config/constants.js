// src/config/constants.js

// URL del backend
export const API_BASE_URL = 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api`;

// Estados de reserva
export const RESERVATION_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmada',
  REJECTED: 'rechazada',
  CANCELLED: 'cancelada'
};

export const RESERVATION_STATUS_LABELS = {
  pendiente: { 
    text: 'Pendiente', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: 'Clock'
  },
  confirmada: { 
    text: 'Confirmada', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'CheckCircle'
  },
  rechazada: { 
    text: 'Rechazada', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'XCircle'
  },
  cancelada: { 
    text: 'Cancelada', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: 'Ban'
  }
};

// Tipos de espacios
export const SPACE_TYPES = [
  { id: 'academico', name: 'Académico', icon: 'BookOpen' },
  { id: 'cultural', name: 'Cultural', icon: 'Music' },
  { id: 'deportivo', name: 'Deportivo', icon: 'Dumbbell' },
  { id: 'administrativo', name: 'Administrativo', icon: 'Briefcase' },
  { id: 'espiritual', name: 'Espiritual', icon: 'Church' },
  { id: 'recreativo', name: 'Recreativo', icon: 'Gamepad2' },
  { id: 'auditorio', name: 'Auditorio', icon: 'Users' },
  { id: 'laboratorio', name: 'Laboratorio', icon: 'FlaskConical' }
];

// Horarios disponibles
export const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00'
];

// Configuración del sistema
export const SYSTEM_CONFIG = {
  MAX_RESERVATION_HOURS: 4,
  CANCEL_WINDOW_HOURS: 24,
  MAX_RESERVATIONS_PER_DAY: 2,
  MIN_RESERVATION_NOTICE_HOURS: 2,
  MAX_FUTURE_RESERVATION_DAYS: 30,
  DEFAULT_WORKING_HOURS: {
    start: '07:00',
    end: '20:00'
  }
};

// Roles del sistema
export const ROLES = {
  DOCENTE: 'docente',
  ADMINISTRADOR: 'administrador'
};

export const ROLE_LABELS = {
  docente: { text: 'Docente', color: 'bg-blue-100 text-blue-800' },
  administrador: { text: 'Administrador', color: 'bg-purple-100 text-purple-800' }
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  RESERVATION_APPROVED: 'reserva_aprobada',
  RESERVATION_REJECTED: 'reserva_rechazada',
  RESERVATION_CANCELLED: 'reserva_cancelada',
  RESERVATION_REMINDER: 'recordatorio_reserva',
  SYSTEM_ANNOUNCEMENT: 'anuncio_sistema',
  MAINTENANCE_NOTICE: 'mantenimiento'
};

// Formatos de fecha y hora
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_FULL: 'DD de MMMM de YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
  DATETIME_FULL: 'DD de MMMM de YYYY, HH:mm'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
  MAX_PAGE_BUTTONS: 5
};

// Configuración de exportación
export const EXPORT_CONFIG = {
  FORMATS: ['pdf', 'excel', 'csv'],
  DEFAULT_FORMAT: 'pdf'
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  RESERVATION_CREATED: 'Reserva creada exitosamente',
  RESERVATION_UPDATED: 'Reserva actualizada exitosamente',
  RESERVATION_DELETED: 'Reserva cancelada exitosamente',
  RESERVATION_APPROVED: 'Reserva aprobada exitosamente',
  RESERVATION_REJECTED: 'Reserva rechazada exitosamente',
  ERROR_GENERIC: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
  ERROR_NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  ERROR_UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  ERROR_NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  ERROR_VALIDATION: 'Por favor, corrige los errores en el formulario.',
  CONFIRM_DELETE: '¿Estás seguro de que deseas eliminar este elemento?',
  CONFIRM_CANCEL: '¿Estás seguro de que deseas cancelar esta reserva?',
  CONFIRM_LOGOUT: '¿Estás seguro de que deseas cerrar sesión?'
};

// Configuración de validación
export const VALIDATION_RULES = {
  EMAIL: {
    required: 'El email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  },
  PASSWORD: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  },
  NAME: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    },
    maxLength: {
      value: 100,
      message: 'El nombre no puede exceder 100 caracteres'
    }
  },
  TITLE: {
    required: 'El título es requerido',
    minLength: {
      value: 5,
      message: 'El título debe tener al menos 5 caracteres'
    },
    maxLength: {
      value: 200,
      message: 'El título no puede exceder 200 caracteres'
    }
  },
  DESCRIPTION: {
    maxLength: {
      value: 1000,
      message: 'La descripción no puede exceder 1000 caracteres'
    }
  },
  CAPACITY: {
    required: 'La capacidad es requerida',
    min: {
      value: 1,
      message: 'La capacidad mínima es 1'
    },
    max: {
      value: 1000,
      message: 'La capacidad máxima es 1000'
    }
  }
};

// Colores del sistema
export const COLORS = {
  PRIMARY: '#3B82F6', // blue-500
  SECONDARY: '#10B981', // emerald-500
  SUCCESS: '#10B981', // emerald-500
  WARNING: '#F59E0B', // amber-500
  ERROR: '#EF4444', // red-500
  INFO: '#3B82F6', // blue-500
  DARK: '#1F2937', // gray-800
  LIGHT: '#F9FAFB', // gray-50
  WHITE: '#FFFFFF',
  BLACK: '#000000'
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Configuración de temas
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
};

// Configuración de idioma
export const LANGUAGE_CONFIG = {
  SUPPORTED: ['es', 'en'],
  DEFAULT: 'es'
};

// Exportar todo como objeto único para fácil importación
export default {
  API_BASE_URL,
  API_URL,
  RESERVATION_STATUS,
  RESERVATION_STATUS_LABELS,
  SPACE_TYPES,
  TIME_SLOTS,
  SYSTEM_CONFIG,
  ROLES,
  ROLE_LABELS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  PAGINATION_CONFIG,
  EXPORT_CONFIG,
  SYSTEM_MESSAGES,
  VALIDATION_RULES,
  COLORS,
  BREAKPOINTS,
  THEME_CONFIG,
  STORAGE_KEYS,
  LANGUAGE_CONFIG
};