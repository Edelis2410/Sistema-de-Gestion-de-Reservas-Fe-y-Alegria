import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Check, Clock, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  user, 
  isSidebarCollapsed, 
  onLogout, 
  userType = 'docente' // Prop nueva: 'docente' o 'admin'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const navigate = useNavigate();
  
  // Ruta base según el tipo de usuario
  const basePath = userType === 'admin' ? '/admin' : '/docente';
  
  // Referencias para detectar clics fuera de los menús
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Notificaciones personalizadas por tipo de usuario
  const getInitialNotifications = () => {
    const commonNotifications = [
      {
        id: 1,
        title: userType === 'admin' ? 'Nueva solicitud de reserva' : 'Reserva confirmada',
        message: userType === 'admin' 
          ? 'Un docente ha solicitado reservar el Aula 101' 
          : 'Tu reserva del Aula 101 ha sido confirmada',
        time: 'Hace 10 minutos',
        type: userType === 'admin' ? 'warning' : 'success',
        read: false
      },
      {
        id: 2,
        title: userType === 'admin' ? 'Espacio requiere aprobación' : 'Recordatorio de clase',
        message: userType === 'admin' 
          ? 'El Laboratorio 3 necesita aprobación para mantenimiento'
          : 'Tienes una clase en el Laboratorio 3 en 30 minutos',
        time: 'Hace 1 hora',
        type: 'warning',
        read: false
      },
      {
        id: 3,
        title: 'Sistema actualizado',
        message: 'Se ha actualizado la plataforma con nuevas funcionalidades',
        time: 'Hace 2 horas',
        type: 'info',
        read: true
      }
    ];

    // Agregar notificaciones específicas para admin
    if (userType === 'admin') {
      commonNotifications.push(
        {
          id: 4,
          title: 'Nuevo usuario registrado',
          message: 'Un nuevo docente se ha registrado en el sistema',
          time: 'Ayer, 15:30',
          type: 'info',
          read: true
        },
        {
          id: 5,
          title: 'Reporte generado',
          message: 'El reporte mensual de reservas está listo',
          time: '2 días atrás',
          type: 'success',
          read: true
        }
      );
    } else {
      // Notificaciones específicas para docente
      commonNotifications.push(
        {
          id: 4,
          title: 'Cambio de horario',
          message: 'El horario del Taller de Robótica ha sido modificado',
          time: 'Ayer, 10:15',
          type: 'warning',
          read: true
        },
        {
          id: 5,
          title: 'Encuesta de satisfacción',
          message: 'Ayúdanos mejorando el sistema completando nuestra encuesta',
          time: '3 días atrás',
          type: 'info',
          read: true
        }
      );
    }

    return commonNotifications;
  };

  useEffect(() => {
    // Cargar notificaciones según el tipo de usuario
    setNotifications(getInitialNotifications());
    
    // Detectar clics fuera de los menús
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userType]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`${userType} buscando:`, searchQuery);
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Navegación con rutas dinámicas
  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate(`${basePath}/account`);
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate(`${basePath}/configuracion`);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalNotifications = notifications.length;

  const filteredNotifications = notifications.filter(notification => {
    if (notificationFilter === 'unread') return !notification.read;
    if (notificationFilter === 'read') return notification.read;
    return true;
  });

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  // Placeholder dinámico para búsqueda
  const getSearchPlaceholder = () => {
    if (userType === 'admin') {
      return 'Buscar reservas, docentes, espacios, reportes...';
    }
    return 'Buscar reservas, espacios, horarios...';
  };

  // Rol mostrado dinámicamente
  const getUserRoleText = () => {
    if (user?.role) return user.role;
    return userType === 'admin' ? 'administrador' : 'docente';
  };

  // Nombre completo dinámico
  const getUserFullName = () => {
    if (user?.name && user?.lastName) return `${user.name} ${user.lastName}`;
    return user?.name || (userType === 'admin' ? 'Administrador' : 'Docente');
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'left-16' : 'left-64'
    } right-0`}>
      <div className="px-6 py-2 h-full">
        <div className="flex items-center h-full">
          {/* Barra de búsqueda */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder={getSearchPlaceholder()}
                />
              </form>
            </div>
          </div>

          {/* Iconos y perfil */}
          <div className="flex items-center space-x-3">
            {/* Notificaciones */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Menú de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-0 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Notificaciones</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {totalNotifications}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Marcar todas</span>
                      </button>
                    )}
                  </div>

                  {/* Filtros */}
                  <div className="px-4 py-2 border-b border-gray-100 bg-white">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setNotificationFilter('all')}
                          className={`px-3 py-1 text-sm rounded-lg ${notificationFilter === 'all' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Todas
                        </button>
                        <button
                          onClick={() => setNotificationFilter('unread')}
                          className={`px-3 py-1 text-sm rounded-lg ${notificationFilter === 'unread' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          No leídas
                        </button>
                        <button
                          onClick={() => setNotificationFilter('read')}
                          className={`px-3 py-1 text-sm rounded-lg ${notificationFilter === 'read' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Leídas
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lista de notificaciones */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                            notification.read 
                              ? 'border-l-transparent' 
                              : 'border-l-blue-500 bg-blue-50'
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 mt-0.5 ${getTypeColor(notification.type)}`}>
                              {notification.type === 'success' && <Check className="h-4 w-4" />}
                              {notification.type === 'warning' && <Clock className="h-4 w-4" />}
                              {notification.type === 'error' && <AlertCircle className="h-4 w-4" />}
                              {notification.type === 'info' && <AlertCircle className="h-4 w-4" />}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={`text-sm font-medium ${
                                    notification.read ? 'text-gray-700' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="flex-shrink-0 ml-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-400">
                                  {notification.time}
                                </p>
                                {notification.read ? (
                                  <span className="text-xs text-gray-400">
                                    ✓ Leída
                                  </span>
                                ) : (
                                  <span className="text-xs text-blue-600 font-medium">
                                    Nueva
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-10 w-10 text-gray-300 mx-auto" />
                        <p className="text-gray-500 mt-2">
                          {notificationFilter === 'unread' 
                            ? 'No tienes notificaciones no leídas' 
                            : 'No hay notificaciones'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {unreadCount > 0 
                          ? `${unreadCount} sin leer`
                          : 'Todas leídas'
                        }
                      </p>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil de usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                    alt={`${user?.name || 'Usuario'}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-medium text-gray-900 text-xs">
                    {user?.name || (userType === 'admin' ? 'Admin' : 'Docente')}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {getUserRoleText()}
                  </p>
                </div>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900 text-sm">
                      {getUserFullName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || `${userType}@institucion.edu.ve`}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Mi perfil
                  </button>
                  
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Configuración
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogoutClick();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;