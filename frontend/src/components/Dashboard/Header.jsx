import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = ({ user, isSidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'left-16' : 'left-64'
    } right-0`}>
      <div className="px-6 py-2 h-full">
        <div className="flex items-center h-full">
          {/* Barra de búsqueda centrada */}
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
                  placeholder="Buscar reservas, espacios ..."
                />
              </form>
            </div>
          </div>

          {/* Iconos y perfil a la derecha */}
          <div className="flex items-center space-x-3">
            {/* Notificaciones */}
            <button className="relative p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 block h-1.5 w-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
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
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'docente'}
                  </p>
                </div>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900 text-sm">
                      {user?.name || 'Usuario'} {user?.lastName || 'Docente'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'correo@institucion.edu.ve'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Mi perfil
                  </button>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Configuración
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
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