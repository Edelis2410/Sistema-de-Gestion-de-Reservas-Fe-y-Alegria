import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  MapPin, 
  Settings, 
  UserCircle, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Menu,
  X,
  PlusCircle,
  History,
  FileText,
  ChevronDown
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [reservasOpen, setReservasOpen] = useState(false);
  const sidebarContentRef = useRef(null);

  // Menú principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/docente/dashboard' },
    { id: 'inicio', label: 'Inicio', icon: <Home className="h-5 w-5" />, path: '/docente/inicio' },
    { id: 'espacios', label: 'Espacios', icon: <MapPin className="h-5 w-5" />, path: '/docente/espacios' },
  ];

  // Submenú de reservas
  const subMenuItems = [
    { id: 'crear-reserva', label: 'Crear reserva', icon: <PlusCircle className="h-4 w-4" />, path: '/docente/reservas/crear' },
    { id: 'historial-reservas', label: 'Historial de reservas', icon: <History className="h-4 w-4" />, path: '/docente/reservas/historial' },
    { id: 'estados-reserva', label: 'Estados de reserva', icon: <FileText className="h-4 w-4" />, path: '/docente/reservas/estados' },
  ];

  // Menú inferior - ACTUALIZADO: Cambiado de 'settings' a 'configuracion'
  const bottomItems = [
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="h-5 w-5" />, path: '/docente/configuracion' },
    { id: 'account', label: 'Mi cuenta', icon: <UserCircle className="h-5 w-5" />, path: '/docente/account' },
    { id: 'help', label: 'Ayuda', icon: <HelpCircle className="h-5 w-5" />, path: '/docente/help' },
    { id: 'logout', label: 'Salir', icon: <LogOut className="h-5 w-5" />, path: '/login' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Función mejorada para verificar si una ruta está activa
  const isActive = (path) => {
    if (path === '/docente') {
      return location.pathname === '/docente';
    }
    
    if (location.pathname === path) {
      return true;
    }
    
    // Para subrutas como '/docente/reservas/crear'
    if (path !== '/docente' && location.pathname.startsWith(path + '/')) {
      return true;
    }
    
    // Para verificar rutas exactas (evita que /docente active /docente/dashboard)
    if (location.pathname.startsWith(path) && path !== '/docente') {
      // Verificamos que sea exacto o subruta
      if (location.pathname === path || location.pathname.startsWith(path + '/')) {
        return true;
      }
    }
    
    return false;
  };

  // Verificar si estamos en alguna página de reservas para abrir automáticamente el submenú
  useEffect(() => {
    if (location.pathname.startsWith('/docente/reservas')) {
      setReservasOpen(true);
    }
  }, [location.pathname]);

  // Determinar si alguna subruta de reservas está activa
  const isReservaActive = subMenuItems.some(item => isActive(item.path));

  // Función para hacer scroll al top del contenido del sidebar
  const scrollToTop = () => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función para hacer scroll a un elemento específico
  const scrollToElement = (elementId) => {
    if (sidebarContentRef.current) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Función para hacer scroll al final del contenido
  const scrollToBottom = () => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ 
        top: sidebarContentRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Efecto para hacer scroll automáticamente al elemento activo cuando se abre un submenú
  useEffect(() => {
    if (reservasOpen && isReservaActive) {
      // Esperar un momento para que el DOM se actualice con el submenú abierto
      setTimeout(() => {
        const activeSubItem = subMenuItems.find(item => isActive(item.path));
        if (activeSubItem) {
          scrollToElement(activeSubItem.id);
        }
      }, 100);
    }
  }, [reservasOpen, isReservaActive, location.pathname]);

  // Efecto para hacer scroll al top cuando cambia la ruta
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transition-all duration-300 flex flex-col`}>
      {/* Botón para contraer/expandir - Parte superior fija */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold">Docente</h2>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-0.5 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Contenido del sidebar con scroll - Barra personalizada */}
      <div 
        ref={sidebarContentRef}
        className="flex-grow overflow-y-auto px-2 py-4 custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        {/* Estilos para la barra de scroll personalizada */}
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #1f2937;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937; /* gray-800 */
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563; /* gray-600 */
            border-radius: 3px;
            border: 1px solid #374151; /* gray-700 */
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280; /* gray-500 */
          }
          
          /* Para Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #1f2937;
          }
        `}</style>
        
        <nav className="space-y-2">
          {/* Menú principal */}
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gray-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
                end={item.path === '/docente'}
                onClick={scrollToTop}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!isCollapsed && active && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </NavLink>
            );
          })}

          {/* Módulo Reservas con submenú desplegable - SOLO CUANDO NO ESTÁ COLAPSADO */}
          {!isCollapsed ? (
            <div className="space-y-1">
              <button
                onClick={() => setReservasOpen(!reservasOpen)}
                className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-200 ${
                  isReservaActive
                    ? 'bg-gray-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Reservas</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${reservasOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Submenú de Reservas */}
              {reservasOpen && (
                <div className="ml-6 space-y-1 border-l border-gray-700 pl-2">
                  {subMenuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <NavLink
                        key={item.id}
                        id={item.id}
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                        onClick={() => scrollToElement(item.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {active && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Versión colapsada - solo icono que lleva a Crear Reserva
            <NavLink
              to="/docente/reservas/crear"
              className={`flex items-center justify-center px-3 py-3 rounded-xl transition-all duration-200 ${
                isReservaActive
                  ? 'bg-gray-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title="Reservas"
              onClick={scrollToTop}
            >
              <Calendar className="h-5 w-5" />
            </NavLink>
          )}
        </nav>

        {/* Menú inferior */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Configuración
            </p>
          )}
          <div className="space-y-2">
            {bottomItems.map((item) => {
              if (item.id === 'logout') {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full px-3 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-800 hover:text-white`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                  </button>
                );
              }
              
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                  onClick={scrollToBottom}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!isCollapsed && active && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;