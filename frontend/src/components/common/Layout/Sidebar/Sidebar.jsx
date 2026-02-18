// src/components/common/Layout/Sidebar/Sidebar.jsx
import React from 'react';
import { Menu, X } from 'lucide-react';
import SidebarMenu from './SidebarMenu';
import SidebarItem from './SidebarItem';

const Sidebar = ({ 
  userRole = 'docente', 
  isCollapsed, 
  onToggle,
  isMobileOpen = false,
  onMobileToggle
}) => {
  const { mainMenu, bottomMenu } = SidebarMenu(userRole);
  const effectiveCollapsed = window.innerWidth < 768 && isMobileOpen ? false : isCollapsed;

  return (
    <>
      <style>
        {`
          /* Forzamos que la barra sea visible y tenga color */
          .sidebar-scroll::-webkit-scrollbar {
            width: 6px !important;
            display: block !important;
          }
          .sidebar-scroll::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2) !important;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3) !important;
            border-radius: 10px !important;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style>

      <aside className={`
        ${effectiveCollapsed ? 'w-16' : 'w-64'}
        fixed left-0 top-0 h-screen max-h-screen
        bg-gradient-to-b from-gray-900 to-gray-800 text-white
        z-50 transition-all duration-300
        flex flex-col 
        ${!isMobileOpen ? 'hidden' : 'flex'} 
        md:flex
      `}>
        
        {/* CABECERA - Altura fija para que no interfiera con el scroll */}
        <div className="h-16 flex-shrink-0 border-b border-white/5 flex items-center px-4">
          {(!effectiveCollapsed || (window.innerWidth < 768 && isMobileOpen)) && (
            <h2 className="text-lg font-semibold capitalize truncate">{userRole}</h2>
          )}
          <button
            onClick={window.innerWidth < 768 ? onMobileToggle : onToggle}
            className="p-1.5 hover:bg-white/10 rounded-lg ml-auto"
          >
            {effectiveCollapsed && window.innerWidth >= 768 ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* CONTENEDOR DE SCROLL - Calculamos el alto restante */}
        <div className="flex-1 overflow-y-auto sidebar-scroll" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="px-3 py-4">
            <nav className="space-y-1.5">
              {mainMenu.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isCollapsed={effectiveCollapsed}
                  userRole={userRole}
                />
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5">
              {!effectiveCollapsed && (
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Configuración
                </p>
              )}
              <div className="space-y-1.5">
                {bottomMenu.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isCollapsed={effectiveCollapsed}
                    userRole={userRole}
                  />
                ))}
              </div>
              
              {/* Espacio extra al final para asegurar que el último item suba */}
              <div className="h-12" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;