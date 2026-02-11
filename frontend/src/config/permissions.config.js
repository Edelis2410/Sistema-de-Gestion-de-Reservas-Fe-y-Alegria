// src/config/permissions.config.js

export const PERMISSIONS = {
  DOCENTE: {
    RESERVAS: {
      CREATE: true,
      VIEW_OWN: true,
      CANCEL_WITHIN_24H: true,
      EDIT: false,
      VIEW_ALL: false,
      APPROVE_REJECT: false,
      EXPORT: false
    },
    ESPACIOS: {
      VIEW: true,
      CREATE: false,
      EDIT: false,
      DELETE: false,
      MANAGE: false
    },
    USUARIOS: {
      VIEW_OWN: true,
      EDIT_OWN: true,
      VIEW_ALL: false,
      CREATE: false,
      EDIT_ANY: false,
      DELETE: false,
      ACTIVATE_DEACTIVATE: false
    },
    REPORTES: {
      VIEW: false,
      GENERATE: false,
      EXPORT: false
    },
    CONFIGURACION: {
      VIEW: false,
      EDIT: false
    }
  },
  
  ADMIN: {
    RESERVAS: {
      CREATE: true,
      VIEW_OWN: true,
      VIEW_ALL: true,
      APPROVE_REJECT: true,
      CANCEL_ANY: true,
      EDIT_ANY: true,
      EXPORT: true
    },
    ESPACIOS: {
      VIEW: true,
      CREATE: true,
      EDIT: true,
      DELETE: true,
      MANAGE: true
    },
    USUARIOS: {
      VIEW_OWN: true,
      VIEW_ALL: true,
      CREATE: true,
      EDIT_ANY: true,
      DELETE: true,
      ACTIVATE_DEACTIVATE: true
    },
    REPORTES: {
      VIEW: true,
      GENERATE: true,
      EXPORT: true
    },
    CONFIGURACION: {
      VIEW: true,
      EDIT: true
    }
  }
};

// Funciones de utilidad para verificar permisos
export const hasPermission = (userRole, module, action) => {
  if (!userRole) return false;
  
  const rolePermissions = PERMISSIONS[userRole.toUpperCase()];
  if (!rolePermissions) return false;
  
  const modulePermissions = rolePermissions[module];
  if (!modulePermissions) return false;
  
  return modulePermissions[action] || false;
};

// Helper específico para cancelar reservas
export const canCancelReservation = (userRole, reservation, userId) => {
  if (userRole === 'administrador') return true;
  
  if (userRole === 'docente' && reservation.usuario_id === userId) {
    // Verificar 24 horas
    const createdDate = new Date(reservation.fecha_creacion);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    return hoursDiff <= 24 && reservation.estado !== 'rechazada' && reservation.estado !== 'cancelada';
  }
  
  return false;
};

// Helper para verificar si puede aprobar/rechazar reservas
export const canApproveReject = (userRole) => {
  return userRole === 'administrador';
};

// Helper para verificar si puede ver todas las reservas
export const canViewAllReservations = (userRole) => {
  return userRole === 'administrador';
};

// Helper para verificar si puede crear espacios
export const canCreateSpace = (userRole) => {
  return userRole === 'administrador';
};

// Helper para verificar si puede gestionar usuarios
export const canManageUsers = (userRole) => {
  return userRole === 'administrador';
};

// Helper para verificar si puede generar reportes
export const canGenerateReports = (userRole) => {
  return userRole === 'administrador';
};

// Helper para verificar si puede ver la configuración del sistema
export const canViewConfiguration = (userRole) => {
  return userRole === 'administrador';
};

// Función para obtener todos los permisos de un rol
export const getUserPermissions = (userRole) => {
  return PERMISSIONS[userRole?.toUpperCase()] || PERMISSIONS.DOCENTE;
};

// Función para verificar múltiples permisos
export const checkPermissions = (userRole, permissionsArray) => {
  return permissionsArray.every(({ module, action }) => 
    hasPermission(userRole, module, action)
  );
};

// Permisos específicos por módulo (para componentes)
export const MODULE_PERMISSIONS = {
  // Módulo de Reservas
  RESERVATIONS_MODULE: {
    CREATE_RESERVATION: ['RESERVAS', 'CREATE'],
    VIEW_OWN_RESERVATIONS: ['RESERVAS', 'VIEW_OWN'],
    VIEW_ALL_RESERVATIONS: ['RESERVAS', 'VIEW_ALL'],
    APPROVE_RESERVATION: ['RESERVAS', 'APPROVE_REJECT'],
    CANCEL_RESERVATION: ['RESERVAS', 'CANCEL_WITHIN_24H'],
    EXPORT_RESERVATIONS: ['RESERVAS', 'EXPORT']
  },
  
  // Módulo de Espacios
  SPACES_MODULE: {
    VIEW_SPACES: ['ESPACIOS', 'VIEW'],
    CREATE_SPACE: ['ESPACIOS', 'CREATE'],
    EDIT_SPACE: ['ESPACIOS', 'EDIT'],
    DELETE_SPACE: ['ESPACIOS', 'DELETE'],
    MANAGE_SPACES: ['ESPACIOS', 'MANAGE']
  },
  
  // Módulo de Usuarios
  USERS_MODULE: {
    VIEW_OWN_PROFILE: ['USUARIOS', 'VIEW_OWN'],
    VIEW_ALL_USERS: ['USUARIOS', 'VIEW_ALL'],
    CREATE_USER: ['USUARIOS', 'CREATE'],
    EDIT_USER: ['USUARIOS', 'EDIT_ANY'],
    DELETE_USER: ['USUARIOS', 'DELETE'],
    ACTIVATE_USER: ['USUARIOS', 'ACTIVATE_DEACTIVATE']
  },
  
  // Módulo de Reportes
  REPORTS_MODULE: {
    VIEW_REPORTS: ['REPORTES', 'VIEW'],
    GENERATE_REPORTS: ['REPORTES', 'GENERATE'],
    EXPORT_REPORTS: ['REPORTES', 'EXPORT']
  },
  
  // Módulo de Configuración
  CONFIG_MODULE: {
    VIEW_CONFIG: ['CONFIGURACION', 'VIEW'],
    EDIT_CONFIG: ['CONFIGURACION', 'EDIT']
  }
};

// Función para verificar permisos de módulo
export const hasModulePermission = (userRole, moduleKey, actionKey) => {
  const module = MODULE_PERMISSIONS[moduleKey];
  if (!module) return false;
  
  const permission = module[actionKey];
  if (!permission) return false;
  
  return hasPermission(userRole, permission[0], permission[1]);
};

// Función para obtener todas las acciones permitidas para un módulo
export const getAllowedActions = (userRole, moduleKey) => {
  const module = MODULE_PERMISSIONS[moduleKey];
  if (!module) return [];
  
  const allowedActions = [];
  
  Object.keys(module).forEach(actionKey => {
    const permission = module[actionKey];
    if (hasPermission(userRole, permission[0], permission[1])) {
      allowedActions.push(actionKey);
    }
  });
  
  return allowedActions;
};