// src/config/menu.config.js
import { ROUTES } from './routes.config';

// Importaciones de iconos (Lucide React)
import {
  Home,
  Calendar,
  Clock,
  Building,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  CheckCircle,
  XCircle,
  User,
  PlusCircle,
  LayoutDashboard,
  BookOpen,
  Filter,
  Download,
  Printer,
  Bell,
  Mail,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Search,
  MapPin,
  AlertCircle,
  Ban,
  Music,
  Dumbbell,
  Briefcase,
  Church,
  Gamepad2,
  FlaskConical,
  List,
  Grid,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Save,
  Upload,
  Lock,
  Unlock,
  Star,
  Heart,
  Share2,
  Copy,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const MENU_ITEMS = {
  DOCENTE: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.DOCENTE.DASHBOARD,
      exact: true,
      description: 'Resumen y estadísticas'
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: Calendar,
      path: ROUTES.DOCENTE.RESERVAS,
      children: [
        {
          id: 'crear-reserva',
          label: 'Nueva Reserva',
          icon: PlusCircle,
          path: ROUTES.DOCENTE.CREAR_RESERVA,
          description: 'Crear nueva reserva de espacio'
        },
        {
          id: 'mis-reservas',
          label: 'Mis Reservas',
          icon: List,
          path: ROUTES.DOCENTE.RESERVAS,
          description: 'Ver todas mis reservas'
        },
        {
          id: 'historial',
          label: 'Historial',
          icon: FileText,
          path: ROUTES.DOCENTE.HISTORIAL,
          description: 'Historial completo de reservas'
        },
        {
          id: 'estados',
          label: 'Estados',
          icon: Filter,
          path: ROUTES.DOCENTE.ESTADOS,
          description: 'Ver reservas por estado'
        }
      ]
    },
    {
      id: 'espacios',
      label: 'Espacios',
      icon: Building,
      path: ROUTES.ESPACIOS,
      description: 'Ver espacios disponibles'
    },
    {
      id: 'mi-cuenta',
      label: 'Mi Cuenta',
      icon: User,
      path: ROUTES.DOCENTE.MI_CUENTA,
      description: 'Gestión de mi perfil'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      path: ROUTES.DOCENTE.NOTIFICACIONES,
      badge: true,
      description: 'Ver notificaciones del sistema'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      path: ROUTES.DOCENTE.CONFIGURACION,
      description: 'Configuración personal'
    },
    {
      id: 'ayuda',
      label: 'Ayuda',
      icon: HelpCircle,
      path: ROUTES.DOCENTE.HELP,
      description: 'Ayuda y soporte'
    }
  ],
  
  ADMIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.ADMIN.DASHBOARD,
      exact: true,
      description: 'Panel de control administrativo'
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: Calendar,
      path: ROUTES.ADMIN.RESERVAS,
      children: [
        {
          id: 'pendientes',
          label: 'Solicitudes Pendientes',
          icon: Clock,
          path: ROUTES.ADMIN.RESERVAS_PENDIENTES,
          badge: 'pending',
          description: 'Reservas pendientes de aprobación'
        },
        {
          id: 'confirmadas',
          label: 'Confirmadas',
          icon: CheckCircle,
          path: ROUTES.ADMIN.RESERVAS_CONFIRMADAS,
          description: 'Reservas aprobadas'
        },
        {
          id: 'rechazadas',
          label: 'Rechazadas',
          icon: XCircle,
          path: ROUTES.ADMIN.RESERVAS_RECHAZADAS,
          description: 'Reservas rechazadas'
        },
        {
          id: 'canceladas',
          label: 'Canceladas',
          icon: Ban,
          path: ROUTES.ADMIN.RESERVAS_CANCELADAS,
          description: 'Reservas canceladas'
        },
        {
          id: 'todas',
          label: 'Todas las Reservas',
          icon: List,
          path: ROUTES.ADMIN.RESERVAS,
          description: 'Ver todas las reservas'
        }
      ]
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      path: ROUTES.ADMIN.USUARIOS,
      children: [
        {
          id: 'lista-usuarios',
          label: 'Lista de Usuarios',
          icon: List,
          path: ROUTES.ADMIN.USUARIOS_LISTA,
          description: 'Ver todos los usuarios'
        },
        {
          id: 'crear-usuario',
          label: 'Crear Usuario',
          icon: PlusCircle,
          path: ROUTES.ADMIN.USUARIOS_CREAR,
          description: 'Crear nuevo usuario'
        },
        {
          id: 'roles-permisos',
          label: 'Roles y Permisos',
          icon: Lock,
          path: '/admin/usuarios/roles',
          description: 'Gestionar roles y permisos'
        }
      ]
    },
    {
      id: 'espacios',
      label: 'Espacios',
      icon: Building,
      path: ROUTES.ADMIN.ESPACIOS,
      children: [
        {
          id: 'lista-espacios',
          label: 'Lista de Espacios',
          icon: List,
          path: ROUTES.ADMIN.ESPACIOS_LISTA,
          description: 'Ver todos los espacios'
        },
        {
          id: 'crear-espacio',
          label: 'Crear Espacio',
          icon: PlusCircle,
          path: ROUTES.ADMIN.ESPACIOS_CREAR,
          description: 'Crear nuevo espacio'
        },
        {
          id: 'categorias',
          label: 'Categorías',
          icon: Grid,
          path: '/admin/espacios/categorias',
          description: 'Gestionar categorías'
        }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      path: ROUTES.ADMIN.REPORTES,
      children: [
        {
          id: 'uso-espacios',
          label: 'Uso de Espacios',
          icon: Building,
          path: ROUTES.ADMIN.REPORTES_USO,
          description: 'Reporte de uso de espacios'
        },
        {
          id: 'estadisticas',
          label: 'Estadísticas',
          icon: BarChart3,
          path: ROUTES.ADMIN.REPORTES_ESTADISTICAS,
          description: 'Estadísticas del sistema'
        },
        {
          id: 'exportar',
          label: 'Exportar Datos',
          icon: Download,
          path: '/admin/reportes/exportar',
          description: 'Exportar datos del sistema'
        }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      path: ROUTES.ADMIN.CONFIGURACION,
      description: 'Configuración del sistema'
    },
    {
      id: 'auditoria',
      label: 'Auditoría',
      icon: FileText,
      path: ROUTES.ADMIN.AUDITORIA,
      description: 'Registros de auditoría'
    }
  ]
};

// Menú público (sin autenticación)
export const PUBLIC_MENU_ITEMS = [
  {
    id: 'home',
    label: 'Inicio',
    icon: Home,
    path: ROUTES.HOME,
    exact: true
  },
  {
    id: 'espacios',
    label: 'Espacios',
    icon: Building,
    path: ROUTES.ESPACIOS
  },
  {
    id: 'guia',
    label: 'Guía de Reservas',
    icon: BookOpen,
    path: ROUTES.GUIA
  },
  {
    id: 'login',
    label: 'Iniciar Sesión',
    icon: LogIn,
    path: ROUTES.LOGIN,
    highlight: true
  }
];

// Menú de usuario (dropdown)
export const USER_MENU_ITEMS = [
  {
    id: 'profile',
    label: 'Mi Perfil',
    icon: User,
    path: '/profile',
    roles: ['docente', 'administrador']
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    path: '/settings',
    roles: ['docente', 'administrador']
  },
  {
    id: 'notifications',
    label: 'Notificaciones',
    icon: Bell,
    path: '/notifications',
    badge: true,
    roles: ['docente', 'administrador']
  },
  {
    id: 'divider-1',
    type: 'divider',
    roles: ['docente', 'administrador']
  },
  {
    id: 'help',
    label: 'Ayuda',
    icon: HelpCircle,
    path: '/help',
    roles: ['docente', 'administrador']
  },
  {
    id: 'feedback',
    label: 'Enviar Feedback',
    icon: Mail,
    path: '/feedback',
    roles: ['docente', 'administrador']
  },
  {
    id: 'divider-2',
    type: 'divider',
    roles: ['docente', 'administrador']
  },
  {
    id: 'logout',
    label: 'Cerrar Sesión',
    icon: LogOut,
    action: 'logout',
    roles: ['docente', 'administrador']
  }
];

// Menú de acciones rápidas
export const QUICK_ACTIONS = {
  DOCENTE: [
    {
      id: 'new-reservation',
      label: 'Nueva Reserva',
      icon: PlusCircle,
      path: ROUTES.DOCENTE.CREAR_RESERVA,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'view-spaces',
      label: 'Ver Espacios',
      icon: Building,
      path: ROUTES.ESPACIOS,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'my-reservations',
      label: 'Mis Reservas',
      icon: Calendar,
      path: ROUTES.DOCENTE.RESERVAS,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ],
  ADMIN: [
    {
      id: 'pending-requests',
      label: 'Solicitudes Pendientes',
      icon: Clock,
      path: ROUTES.ADMIN.RESERVAS_PENDIENTES,
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      id: 'create-user',
      label: 'Crear Usuario',
      icon: UserPlus,
      path: ROUTES.ADMIN.USUARIOS_CREAR,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'create-space',
      label: 'Crear Espacio',
      icon: Building,
      path: ROUTES.ADMIN.ESPACIOS_CREAR,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'generate-report',
      label: 'Generar Reporte',
      icon: BarChart3,
      path: ROUTES.ADMIN.REPORTES,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]
};

// Función para obtener menú según rol
export const getMenuByRole = (role) => {
  switch (role) {
    case 'administrador':
      return MENU_ITEMS.ADMIN;
    case 'docente':
      return MENU_ITEMS.DOCENTE;
    default:
      return PUBLIC_MENU_ITEMS;
  }
};

// Función para obtener icono por nombre
export const getIconByName = (iconName) => {
  const icons = {
    Home, Calendar, Clock, Building, Users, BarChart3, Settings, HelpCircle,
    FileText, CheckCircle, XCircle, User, PlusCircle, LayoutDashboard, BookOpen,
    Filter, Download, Printer, Bell, Mail, LogOut, ChevronRight, ChevronLeft,
    Search, MapPin, AlertCircle, Ban, Music, Dumbbell, Briefcase, Church,
    Gamepad2, FlaskConical, List, Grid, Eye, Edit, Trash2, RefreshCw, Save,
    Upload, Lock, Unlock, Star, Heart, Share2, Copy, ExternalLink, Menu, X
  };
  
  return icons[iconName] || HelpCircle;
};

// Función para obtener acciones rápidas según rol
export const getQuickActionsByRole = (role) => {
  return QUICK_ACTIONS[role?.toUpperCase()] || QUICK_ACTIONS.DOCENTE;
};

// Configuración de breadcrumbs
export const getBreadcrumbForPath = (pathname) => {
  const breadcrumbs = [];
  
  // Buscar en todos los menús
  const allMenuItems = [...MENU_ITEMS.DOCENTE, ...MENU_ITEMS.ADMIN, ...PUBLIC_MENU_ITEMS];
  
  const findInMenu = (items, path) => {
    for (const item of items) {
      if (item.path === path || (item.exact && item.path === pathname)) {
        breadcrumbs.unshift(item.label);
        return true;
      }
      
      if (item.children) {
        if (findInMenu(item.children, path)) {
          breadcrumbs.unshift(item.label);
          return true;
        }
      }
    }
    return false;
  };
  
  findInMenu(allMenuItems, pathname);
  
  // Si no se encontró, usar la ruta como breadcrumb
  if (breadcrumbs.length === 0) {
    const parts = pathname.split('/').filter(part => part);
    breadcrumbs.push(...parts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ));
  }
  
  return breadcrumbs;
};

// Configuración del sidebar
export const SIDEBAR_CONFIG = {
  WIDTH: {
    EXPANDED: '16rem', // 256px
    COLLAPSED: '4rem', // 64px
  },
  TRANSITION: 'transition-all duration-300 ease-in-out',
  BREAKPOINT: 'lg', // A partir de este breakpoint se puede colapsar
  DEFAULT_COLLAPSED: false,
  SHOW_USER_INFO: true,
  SHOW_LOGO: true,
  LOGO_SIZE: {
    EXPANDED: 'w-32',
    COLLAPSED: 'w-10'
  }
};

export default {
  MENU_ITEMS,
  PUBLIC_MENU_ITEMS,
  USER_MENU_ITEMS,
  QUICK_ACTIONS,
  getMenuByRole,
  getIconByName,
  getQuickActionsByRole,
  getBreadcrumbForPath,
  SIDEBAR_CONFIG
};