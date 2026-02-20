import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Contenedor principal: logo - nav - login */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Izquierda */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Logo Fe y Alegría" 
                className="h-11 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Fe y Alegría</h1>
                <p className="text-xs text-gray-600">Gestión de Espacios</p>
              </div>
            </Link>
          </div>

          {/* Navegación Desktop - Centro (ocupa espacio flexible) */}
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 text-base">
              Inicio
            </Link>
            <Link to="/espacios" className="text-gray-700 hover:text-blue-600 text-base">
              Espacios
            </Link>
            <Link to="/guia" className="text-gray-700 hover:text-blue-600 text-base">
              Guía de Reservas
            </Link>
          </nav>

          {/* Botón login + menú móvil - Derecha */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            {/* Botón Iniciar Sesión Desktop */}
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>

            {/* Botón Menú Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/espacios"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Espacios
              </Link>
              <Link
                to="/guia"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Guía de Reservas
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
