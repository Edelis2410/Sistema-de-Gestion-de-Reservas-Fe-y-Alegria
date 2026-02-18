// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Layout/Sidebar/Sidebar';
import Header from '../components/common/Layout/Header';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Subir scroll automáticamente al cambiar de página
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Cambia a 'smooth' si quieres animación suave
    });
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-white-90 flex">
      <Sidebar 
        userRole={user.rol}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div className={`
        flex-1 flex flex-col min-w-0
        transition-all duration-300
        ml-0
        ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
      `}>
        <Header 
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          userType={user.rol}
          onMobileMenuToggle={toggleMobileMenu}   // ← nueva
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 pt-14 px-6 pb-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;