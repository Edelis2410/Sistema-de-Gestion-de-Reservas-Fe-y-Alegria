// src/components/common/Layout/Sidebar/SidebarItem.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarItem = ({ item, isCollapsed, userRole }) => {
  const location = useLocation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  
  // Verificar si la ruta está activa
  const isActive = (path) => {
    if (!path) return false;
    
    // Manejar rutas base (como /admin o /docente)
    if (path === `/admin` || path === `/docente`) {
      return location.pathname === path;
    }
    
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const active = isActive(item.path);

  // Manejar logout
  const handleLogout = (e) => {
    if (item.isLogout) {
      e.preventDefault();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  // Si el item tiene submenú
  if (item.hasSubmenu) {
    const hasActiveSubItem = item.submenu?.some(subItem => isActive(subItem.path));

    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-200 ${
            hasActiveSubItem || isSubmenuOpen
              ? 'bg-gray-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {/* Submenú */}
        {!isCollapsed && isSubmenuOpen && (
          <div className="ml-6 space-y-1 border-l border-gray-700 pl-2">
            {item.submenu.map((subItem) => {
              const subActive = isActive(subItem.path);
              return (
                <NavLink
                  key={subItem.id}
                  to={subItem.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    subActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <subItem.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{subItem.label}</span>
                  </div>
                  {subActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Item normal (sin submenú)
  return (
    <NavLink
      to={item.path}
      onClick={handleLogout}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${
        active
          ? 'bg-gray-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
      title={isCollapsed ? item.label : ''}
      end={item.path === `/admin` || item.path === `/docente`}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="h-5 w-5" />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </div>
      {!isCollapsed && active && (
        <ChevronRight className="h-4 w-4" />
      )}
    </NavLink>
  );
};

export default SidebarItem;