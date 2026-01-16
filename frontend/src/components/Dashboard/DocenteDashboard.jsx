import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Inicio from './Inicio';
import Espacios from './Espacios';

// Importa los componentes de reservas desde tu carpeta Reservasd
import CrearReserva from './Reservasd/CrearReserva';
import HistorialReservas from './Reservasd/HistorialReservas';
import EstadosReserva from './Reservasd/EstadosReserva';

// Importa el componente de Configuración
import Configuracion from './Configuracion';

// Importa el componente de Mi Cuenta
import MiCuenta from './MiCuenta';

// Importa el componente de Ayuda
import Help from './Help';

const DocenteDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Dashboard - Usuario:', user);
    
    if (!user) {
      console.log('No hay usuario, redirigiendo...');
      window.location.href = '/login';
    }
  }, []);

  const user = JSON.parse(localStorage.getItem('user')) || { 
    name: 'Usuario', 
    lastName: 'Docente',
    role: 'docente',
    email: 'correo@institucion.edu.ve'
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      
      {/* Contenido principal */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      } min-w-0`}>
        
        {/* Header fijo en la parte superior */}
        <Header 
          user={user} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        
        {/* Contenido con padding superior reducido para que aparezca más arriba */}
        <div className="pt-12">
          <div className="p-4 md:p-6">
            <Routes>
              {/* Ruta por defecto redirige a /docente/inicio */}
              <Route path="/" element={<Navigate to="inicio" replace />} />
              
              {/* Ruta de Inicio */}
              <Route path="inicio" element={
                <Inicio user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              {/* Ruta del Dashboard */}
              <Route path="dashboard" element={
                <Dashboard user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              {/* Ruta de Espacios */}
              <Route path="espacios" element={
                <Espacios user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              {/* Rutas de Reservas */}
              <Route path="reservas/crear" element={
                <CrearReserva user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              <Route path="reservas/historial" element={
                <HistorialReservas user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              <Route path="reservas/estados" element={
                <EstadosReserva user={user} isSidebarCollapsed={isSidebarCollapsed} />
              } />
              
              {/* Ruta para Configuración */}
              <Route path="configuracion" element={
                <Configuracion />
              } />
              
              {/* Ruta para Mi Cuenta */}
              <Route path="account" element={
                <MiCuenta />
              } />
              
              {/* Ruta para Ayuda - ACTUALIZADA con el componente Help */}
              <Route path="help" element={
                <Help />
              } />
              
              {/* Ruta para cualquier otra ruta no definida - muestra error 404 */}
              <Route path="*" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">404 - Página no encontrada</h1>
                  <p className="text-gray-600">La página que buscas no existe.</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocenteDashboard;