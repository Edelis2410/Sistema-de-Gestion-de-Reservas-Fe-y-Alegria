// src/components/common/Layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  user, 
  isSidebarCollapsed, 
  onLogout, 
  userType = 'docente'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const navigate = useNavigate();
  
  const basePath = user?.rol === 'administrador' ? '/admin' : '/docente';
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // --- LÓGICA DE NOTIFICACIONES (CONECTADA A TU SCHEMA) ---
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token actual:", token); // VERIFICAR SI HAY TOKen


      const response = await fetch('http://localhost:5000/api/notificaciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      console.log("Respuesta del Backend:", result); // VERIFICAR QUÉ LLEGA

      
      if (result.success) setNotifications(result.data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [user?.id]);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notificaciones/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, leido: true } : n));
    } catch (error) {
      console.error("Error al marcar notificación:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notificaciones/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, leido: true })));
    } catch (error) {
      console.error("Error al marcar todas:", error);
    }
  };

  const formatearTiempo = (fechaRaw) => {
    if (!fechaRaw) return '---';
    const fecha = new Date(fechaRaw);
    if (isNaN(fecha.getTime())) return '---';
    const ahora = new Date();
    const difMinutos = Math.floor((ahora - fecha) / 1000 / 60);
    if (difMinutos < 1) return 'Ahora mismo';
    if (difMinutos < 60) return `Hace ${difMinutos} min`;
    if (difMinutos < 1440) return `Hace ${Math.floor(difMinutos / 60)} horas`;
    return fecha.toLocaleDateString();
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const unreadCount = notifications.filter(n => !n.leido).length;
  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'unread') return !n.leido;
    if (notificationFilter === 'read') return n.leido;
    return true;
  });

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'success': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-rose-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'left-16' : 'left-64'
    } right-0`}>
      <div className="px-6 py-2 h-full">
        <div className="flex items-center h-full">
          
          {/* BARRA DE BÚSQUEDA ORIGINAL */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg">
              <form className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={user?.rol === 'administrador' ? 'Buscar registros...' : 'Buscar espacios...'}
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            
            {/* CAMPANITA DE NOTIFICACIONES */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }} 
                className="relative p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-tighter">
                        Marcar todo
                      </button>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-b border-gray-100 bg-white flex space-x-2">
                    {['all', 'unread', 'read'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setNotificationFilter(f)}
                        className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-colors ${
                          notificationFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {f === 'all' ? 'Todas' : f === 'unread' ? 'Nuevas' : 'Leídas'}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                            !n.leido ? 'border-l-blue-600 bg-blue-50/30' : 'border-l-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${getTypeColor(n.tipo)}`}>
                              <AlertCircle size={14} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-bold ${n.leido ? 'text-slate-600' : 'text-slate-900'}`}>{n.titulo}</p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.mensaje}</p>
                              <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase italic">
                                {formatearTiempo(n.fecha_envio)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center text-slate-400 italic text-xs">No hay notificaciones</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PERFIL */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }} 
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-gray-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {user?.foto ? (
                    <img src={user.foto} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-bold text-slate-900 text-[11px] leading-tight">{user?.nombre || 'Usuario'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user?.rol || 'Personal'}</p>
                </div>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-slate-900 text-xs truncate capitalize">{user?.nombre || 'Usuario'}</p>
                    <p className="text-[10px] text-slate-400 truncate lowercase">{user?.email || 'email@institucion.edu'}</p>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); navigate(`${basePath}/account`); }} className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 capitalize transition-colors">Mi perfil</button>
                  <button onClick={() => { setShowUserMenu(false); navigate(`${basePath}/configuracion`); }} className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 capitalize transition-colors">Configuración</button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 capitalize transition-colors">Cerrar sesión</button>
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