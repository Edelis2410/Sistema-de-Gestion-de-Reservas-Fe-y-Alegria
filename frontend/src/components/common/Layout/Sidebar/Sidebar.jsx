// src/components/common/Layout/Sidebar/Sidebar.jsx
import React from 'react';
import { Menu, X } from 'lucide-react';
import SidebarMenu from './SidebarMenu';
import SidebarItem from './SidebarItem';

const Sidebar = ({ userRole = 'docente', isCollapsed, onToggle }) => {
  // Obtener configuración del menú según el rol
  const { mainMenu, bottomMenu } = SidebarMenu(userRole);

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transition-all duration-300 flex flex-col`}>
      {/* Botón para contraer/expandir */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold capitalize">{userRole}</h2>
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

      {/* Contenido del sidebar con scroll */}
      <div className="flex-grow overflow-y-auto px-2 py-4 custom-scrollbar">
        {/* Menú principal */}
        <nav className="space-y-2">
          {mainMenu.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              userRole={userRole}
              // REMOVIMOS los props reservasOpen y setReservasOpen
            />
          ))}
        </nav>

        {/* Menú inferior */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Configuración
            </p>
          )}
          <div className="space-y-2">
            {bottomMenu.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                userRole={userRole}
                // TAMPOCO aquí
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;