// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword'; // 
import DashboardLayout from './layouts/DashboardLayout';

// ========== PÁGINAS PÚBLICAS ==========
import Home from './pages/Home';
import Espacios from './pages/Espacios';
import GuiaReservas from './pages/GuiaReservas';

// ========== COMPONENTES DE LAYOUT PÚBLICO ==========
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// ========== VISTAS COMPARTIDAS ==========
import Inicio from './dashboard/shared/views/Inicio';
import EspaciosDashboard from './dashboard/shared/views/Espacios';
import CrearReserva from './dashboard/shared/views/Reservas/CrearReserva';
import HistorialReservas from './dashboard/shared/views/Reservas/HistorialReservas';
// SE ELIMINÓ: EstadosReserva de aquí
import Configuracion from './dashboard/shared/views/Configuracion';
import MiCuenta from './dashboard/shared/views/MiCuenta';
import Help from './dashboard/shared/views/Help';

// ========== VISTAS DOCENTE ==========
import DocenteDashboard from './dashboard/docente/views/Dashboard';

// ========== VISTAS ADMIN ==========
import AdminDashboard from './dashboard/admin/views/AdminDashboard';
import ListarReservas from './dashboard/admin/views/AdminReservas/ListarReservas';
import AgregarUsuario from './dashboard/admin/views/Usuarios/AgregarUsuario';
import ListarUsuarios from './dashboard/admin/views/Usuarios/ListarUsuarios';
import Reportes from './dashboard/admin/views/Reportes';

// Layout para páginas públicas
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* ========== RUTAS PÚBLICAS ========== */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/espacios" element={
            <PublicLayout>
              <Espacios />
            </PublicLayout>
          } />
          
          <Route path="/guia" element={
            <PublicLayout>
              <GuiaReservas />
            </PublicLayout>
          } />
          
          <Route path="/login" element={<Login />} />

          {/* ========== RUTAS PROTEGIDAS DEL DOCENTE ========== */}
          <Route path="/docente" element={
            <ProtectedRoute allowedRoles={['docente', 'administrador']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DocenteDashboard />} />
            <Route path="dashboard" element={<DocenteDashboard />} />
            <Route path="inicio" element={<Inicio />} />
            <Route path="espacios" element={<EspaciosDashboard />} />
            
            {/* Subrutas de reservas */}
            <Route path="reservas">
              <Route path="crear" element={<CrearReserva />} />
              <Route path="historial" element={<HistorialReservas />} />
              {/* SE ELIMINÓ: La ruta "estados" del docente */}
            </Route>
            
            {/* Configuración común */}
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="account" element={<MiCuenta />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* ========== RUTAS PROTEGIDAS DEL ADMIN ========== */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inicio" element={<Inicio />} />
            <Route path="espacios" element={<EspaciosDashboard />} />
            
            {/* Subrutas de reservas (comunes) */}
            <Route path="reservas">
              <Route path="crear" element={<CrearReserva />} />
              <Route path="historial" element={<HistorialReservas />} />
              {/* SE ELIMINÓ: La ruta "estados" del admin */}
            </Route>
            
            {/* RUTAS ESPECÍFICAS DE ADMIN */}
            <Route path="reservas-listar" element={<ListarReservas />} />
            <Route path="usuarios-agregar" element={<AgregarUsuario />} />
            <Route path="usuarios-listar" element={<ListarUsuarios />} />
            <Route path="reportes" element={<Reportes />} />
            
            {/* Configuración común */}
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="account" element={<MiCuenta />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;