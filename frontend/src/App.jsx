import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Espacios from './pages/Espacios';
import GuiaReservas from './pages/GuiaReservas';
import ScrollToTop from './components/common/ScrollToTop';
import Login from './pages/Login';
import DocenteDashboard from './components/Dashboard/DocenteDashboard';

// Hook personalizado para verificar autenticación
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Redirección directa
  };

  return { user, login, logout, loading };
};

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout para páginas públicas
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Layout para dashboard
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

// Componente principal
function App() {
  return (
    <Router>
      <ScrollToTop />
      
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />
        
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
        
        <Route path="/login" element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        } />
        
        {/* Ruta del Dashboard del Docente - PROTEGIDA */}
        <Route path="/docente/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DocenteDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Ruta del Dashboard del Admin - PROTEGIDA */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
                  <p className="text-gray-600">En construcción</p>
                </div>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;