// src/components/common/Layout/Sidebar/SidebarMenu.jsx
import {
  LayoutDashboard, 
  Home, 
  Calendar, 
  MapPin, 
  Settings, 
  UserCircle, 
  HelpCircle,
  LogOut,
  PlusCircle,
  History,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';

const SidebarMenu = (userRole) => {
  // Definir el prefijo de ruta según el rol
  const getRoutePrefix = () => {
    if (userRole === 'administrador') return '/admin';
    if (userRole === 'docente') return '/docente';
    return '/docente'; // por defecto
  };

  const routePrefix = getRoutePrefix();

  // Configuración común para ambos roles
  const commonMainMenu = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: `${routePrefix}/dashboard` 
    },
    { 
      id: 'inicio', 
      label: 'Inicio', 
      icon: Home, 
      path: `${routePrefix}/inicio` 
    },
    { 
      id: 'espacios', 
      label: 'Espacios', 
      icon: MapPin, 
      path: `${routePrefix}/espacios` 
    },
  ];

  const commonBottomMenu = [
    { 
      id: 'configuracion', 
      label: 'Configuración', 
      icon: Settings, 
      path: `${routePrefix}/configuracion` 
    },
    { 
      id: 'account', 
      label: 'Mi cuenta', 
      icon: UserCircle, 
      path: `${routePrefix}/account` 
    },
    { 
      id: 'help', 
      label: 'Ayuda', 
      icon: HelpCircle, 
      path: `${routePrefix}/help` 
    },
    { 
      id: 'logout', 
      label: 'Salir', 
      icon: LogOut, 
      path: '/login', 
      isLogout: true 
    },
  ];

  // Configuración específica por rol
  const roleSpecificMenu = {
    docente: {
      mainMenu: [
        ...commonMainMenu,
        {
          id: 'reservas',
          label: 'Reservas',
          icon: Calendar,
          path: `${routePrefix}/reservas`,
          hasSubmenu: true,
          submenu: [
            { 
              id: 'crear-reserva', 
              label: 'Crear reserva', 
              icon: PlusCircle, 
              path: `${routePrefix}/reservas/crear` 
            },
            { 
              id: 'historial-reservas', 
              label: 'Historial de reservas', 
              icon: History, 
              path: `${routePrefix}/reservas/historial` 
            }
            // SE ELIMINÓ: Estados de reserva
          ]
        }
      ],
      bottomMenu: commonBottomMenu
    },
    administrador: {
      mainMenu: [
        ...commonMainMenu,
        {
          id: 'reservas',
          label: 'Reservas',
          icon: Calendar,
          path: `${routePrefix}/reservas`,
          hasSubmenu: true,
          submenu: [
            { 
              id: 'crear-reserva', 
              label: 'Crear reserva', 
              icon: PlusCircle, 
              path: `${routePrefix}/reservas/crear` 
            },
            { 
              id: 'historial-reservas', 
              label: 'Historial de reservas', 
              icon: History, 
              path: `${routePrefix}/reservas/historial` 
            }
            // SE ELIMINÓ: Estados de reserva
          ]
        },
        {
          id: 'administrar-reservas',
          label: 'Solicitudes',
          icon: Shield,
          path: `${routePrefix}/reservas-listar`,
          hasSubmenu: false
        },
        {
          id: 'administrar-usuarios',
          label: 'Usuarios',
          icon: Users,
          path: `${routePrefix}/usuarios`,
          hasSubmenu: true,
          submenu: [
            { 
              id: 'agregar-usuario', 
              label: 'Agregar usuario', 
              icon: PlusCircle, 
              path: `${routePrefix}/usuarios-agregar` 
            },
            { 
              id: 'listar-usuarios', 
              label: 'Listar usuarios', 
              icon: Users, 
              path: `${routePrefix}/usuarios-listar` 
            },
          ]
        },
        { 
          id: 'reportes', 
          label: 'Reportes', 
          icon: BarChart3, 
          path: `${routePrefix}/reportes`, 
          hasSubmenu: false 
        },
      ],
      bottomMenu: commonBottomMenu
    }
  };

  return roleSpecificMenu[userRole] || roleSpecificMenu.docente;
};

export default SidebarMenu;