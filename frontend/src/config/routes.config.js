// src/config/routes.config.js

export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  ESPACIOS: '/espacios',
  GUIA: '/guia-reservas',
  ABOUT: '/acerca-de',
  
  // Dashboard docente
  DOCENTE: {
    ROOT: '/docente',
    DASHBOARD: '/docente/dashboard',
    RESERVAS: '/docente/reservas',
    CREAR_RESERVA: '/docente/reservas/crear',
    HISTORIAL: '/docente/reservas/historial',
    ESTADOS: '/docente/reservas/estados',
    MI_CUENTA: '/docente/mi-cuenta',
    CONFIGURACION: '/docente/configuracion',
    HELP: '/docente/help',
    NOTIFICACIONES: '/docente/notificaciones'
  },
  
  // Dashboard administrador
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    RESERVAS: '/admin/reservas',
    RESERVAS_PENDIENTES: '/admin/reservas/pendientes',
    RESERVAS_CONFIRMADAS: '/admin/reservas/confirmadas',
    RESERVAS_RECHAZADAS: '/admin/reservas/rechazadas',
    RESERVAS_CANCELADAS: '/admin/reservas/canceladas',
    USUARIOS: '/admin/usuarios',
    USUARIOS_LISTA: '/admin/usuarios/lista',
    USUARIOS_CREAR: '/admin/usuarios/crear',
    ESPACIOS: '/admin/espacios',
    ESPACIOS_LISTA: '/admin/espacios/lista',
    ESPACIOS_CREAR: '/admin/espacios/crear',
    REPORTES: '/admin/reportes',
    REPORTES_USO: '/admin/reportes/uso',
    REPORTES_ESTADISTICAS: '/admin/reportes/estadisticas',
    CONFIGURACION: '/admin/configuracion',
    AUDITORIA: '/admin/auditoria'
  }
};

// Rutas protegidas por rol
export const PROTECTED_ROUTES = {
  DOCENTE: [
    ROUTES.DOCENTE.ROOT,
    ROUTES.DOCENTE.DASHBOARD,
    ROUTES.DOCENTE.RESERVAS,
    ROUTES.DOCENTE.CREAR_RESERVA,
    ROUTES.DOCENTE.HISTORIAL,
    ROUTES.DOCENTE.ESTADOS,
    ROUTES.DOCENTE.MI_CUENTA,
    ROUTES.DOCENTE.CONFIGURACION,
    ROUTES.DOCENTE.HELP,
    ROUTES.DOCENTE.NOTIFICACIONES
  ],
  ADMIN: [
    ROUTES.ADMIN.ROOT,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.RESERVAS,
    ROUTES.ADMIN.RESERVAS_PENDIENTES,
    ROUTES.ADMIN.RESERVAS_CONFIRMADAS,
    ROUTES.ADMIN.RESERVAS_RECHAZADAS,
    ROUTES.ADMIN.RESERVAS_CANCELADAS,
    ROUTES.ADMIN.USUARIOS,
    ROUTES.ADMIN.USUARIOS_LISTA,
    ROUTES.ADMIN.USUARIOS_CREAR,
    ROUTES.ADMIN.ESPACIOS,
    ROUTES.ADMIN.ESPACIOS_LISTA,
    ROUTES.ADMIN.ESPACIOS_CREAR,
    ROUTES.ADMIN.REPORTES,
    ROUTES.ADMIN.REPORTES_USO,
    ROUTES.ADMIN.REPORTES_ESTADISTICAS,
    ROUTES.ADMIN.CONFIGURACION,
    ROUTES.ADMIN.AUDITORIA
  ]
};

// Verificar si una ruta es pública
export const isPublicRoute = (pathname) => {
  const publicRoutes = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.ESPACIOS,
    ROUTES.GUIA,
    ROUTES.ABOUT,
    '/',
    ''
  ];
  
  return publicRoutes.includes(pathname) || 
         pathname.startsWith('/public') ||
         pathname.includes('/api/') ||
         pathname === '/favicon.ico';
};

// Obtener ruta de dashboard según rol
export const getDashboardByRole = (role) => {
  if (role === 'administrador') return ROUTES.ADMIN.DASHBOARD;
  if (role === 'docente') return ROUTES.DOCENTE.DASHBOARD;
  return ROUTES.HOME;
};

// Verificar si una ruta requiere un rol específico
export const getRequiredRoleForRoute = (pathname) => {
  // Ignorar rutas públicas
  if (isPublicRoute(pathname)) {
    return null;
  }
  
  // Rutas de administrador
  const adminRoutes = PROTECTED_ROUTES.ADMIN;
  for (const route of adminRoutes) {
    if (pathname.startsWith(route)) {
      return 'administrador';
    }
  }
  
  // Rutas de docente
  const docenteRoutes = PROTECTED_ROUTES.DOCENTE;
  for (const route of docenteRoutes) {
    if (pathname.startsWith(route)) {
      return 'docente';
    }
  }
  
  // Por defecto, requerir autenticación
  return 'authenticated';
};

// Verificar si el usuario puede acceder a una ruta
export const canAccessRoute = (userRole, pathname) => {
  const requiredRole = getRequiredRoleForRoute(pathname);
  
  if (!requiredRole) {
    return true; // Ruta pública
  }
  
  if (requiredRole === 'authenticated') {
    return !!userRole; // Cualquier usuario autenticado
  }
  
  return userRole === requiredRole;
};

// Obtener todas las rutas de navegación para un rol
export const getNavigationRoutes = (userRole) => {
  const baseRoutes = [
    { path: ROUTES.HOME, label: 'Inicio', icon: 'Home', public: true },
    { path: ROUTES.ESPACIOS, label: 'Espacios', icon: 'Building', public: true },
    { path: ROUTES.GUIA, label: 'Guía', icon: 'BookOpen', public: true },
  ];
  
  if (!userRole) {
    return baseRoutes;
  }
  
  if (userRole === 'docente') {
    return [
      ...baseRoutes.filter(r => !r.public), // Solo no públicas
      { path: ROUTES.DOCENTE.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: ROUTES.DOCENTE.RESERVAS, label: 'Mis Reservas', icon: 'Calendar' },
      { path: ROUTES.DOCENTE.CREAR_RESERVA, label: 'Nueva Reserva', icon: 'PlusCircle' },
      { path: ROUTES.DOCENTE.MI_CUENTA, label: 'Mi Cuenta', icon: 'User' },
      { path: ROUTES.DOCENTE.HELP, label: 'Ayuda', icon: 'HelpCircle' },
    ];
  }
  
  if (userRole === 'administrador') {
    return [
      ...baseRoutes.filter(r => !r.public),
      { path: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
      { 
        path: ROUTES.ADMIN.RESERVAS_PENDIENTES, 
        label: 'Solicitudes', 
        icon: 'Clock',
        badge: 'pending' 
      },
      { path: ROUTES.ADMIN.USUARIOS_LISTA, label: 'Usuarios', icon: 'Users' },
      { path: ROUTES.ADMIN.ESPACIOS_LISTA, label: 'Espacios', icon: 'Building' },
      { path: ROUTES.ADMIN.REPORTES, label: 'Reportes', icon: 'BarChart' },
      { path: ROUTES.ADMIN.CONFIGURACION, label: 'Configuración', icon: 'Settings' },
    ];
  }
  
  return baseRoutes;
};

// Mapeo de iconos (para usar con Lucide React)
export const ICON_MAP = {
  Home: 'Home',
  Building: 'Building',
  BookOpen: 'BookOpen',
  LayoutDashboard: 'LayoutDashboard',
  Calendar: 'Calendar',
  PlusCircle: 'PlusCircle',
  User: 'User',
  HelpCircle: 'HelpCircle',
  Clock: 'Clock',
  Users: 'Users',
  BarChart: 'BarChart',
  Settings: 'Settings',
  CheckCircle: 'CheckCircle',
  XCircle: 'XCircle',
  FileText: 'FileText',
  AlertCircle: 'AlertCircle',
  LogOut: 'LogOut',
  Menu: 'Menu',
  ChevronRight: 'ChevronRight',
  ChevronLeft: 'ChevronLeft',
  Search: 'Search',
  Filter: 'Filter',
  Download: 'Download',
  Printer: 'Printer',
  Mail: 'Mail',
  Bell: 'Bell',
  MapPin: 'MapPin',
  Clock: 'Clock'
};

// Función para obtener el componente de icono por nombre
export const getIconComponent = (iconName) => {
  // Esta función sería implementada en tu componente que usa los iconos
  // Por ahora, solo devolvemos el nombre
  return iconName;
};

// Configuración de breadcrumbs para rutas
export const BREADCRUMB_CONFIG = {
  [ROUTES.DOCENTE.DASHBOARD]: ['Dashboard'],
  [ROUTES.DOCENTE.RESERVAS]: ['Dashboard', 'Mis Reservas'],
  [ROUTES.DOCENTE.CREAR_RESERVA]: ['Dashboard', 'Reservas', 'Nueva Reserva'],
  [ROUTES.DOCENTE.HISTORIAL]: ['Dashboard', 'Reservas', 'Historial'],
  [ROUTES.DOCENTE.MI_CUENTA]: ['Dashboard', 'Mi Cuenta'],
  [ROUTES.ADMIN.DASHBOARD]: ['Dashboard'],
  [ROUTES.ADMIN.RESERVAS_PENDIENTES]: ['Dashboard', 'Reservas', 'Solicitudes Pendientes'],
  [ROUTES.ADMIN.USUARIOS_LISTA]: ['Dashboard', 'Usuarios'],
  [ROUTES.ADMIN.ESPACIOS_LISTA]: ['Dashboard', 'Espacios'],
  [ROUTES.ADMIN.REPORTES]: ['Dashboard', 'Reportes'],
  [ROUTES.ADMIN.CONFIGURACION]: ['Dashboard', 'Configuración']
};

// Obtener breadcrumbs para una ruta
export const getBreadcrumbs = (pathname) => {
  return BREADCRUMB_CONFIG[pathname] || ['Dashboard'];
};