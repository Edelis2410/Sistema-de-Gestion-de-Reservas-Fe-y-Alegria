import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo/Institución */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Fe y Alegría</h3>
              <p className="text-gray-400 text-sm mt-1">Colegio Puerto Ordaz</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistema de gestión de espacios educativos para optimizar el uso de nuestras instalaciones.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-3 md:mb-4 text-white">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm block py-1 hover:translate-x-1 transition-all duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/espacios" className="text-gray-400 hover:text-white text-sm block py-1 hover:translate-x-1 transition-all duration-200">
                  Espacios
                </Link>
              </li>
              <li>
                <Link to="/guia" className="text-gray-400 hover:text-white text-sm block py-1 hover:translate-x-1 transition-all duration-200">
                  Guía de Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-3 md:mb-4 text-white">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-gray-400 text-sm pt-1 break-words">
                  U.E Colegio Fé y Alegría, Puerto Ordaz
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-gray-400 text-sm">+58 123-456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-gray-400 text-sm">reservas@feyalegria.edu.ve</span>
              </div>
            </div>
          </div>

          {/* Redes Sociales y Botón de Iniciar Sesión */}
          <div>
            <h4 className="text-lg font-semibold mb-3 md:mb-4 text-white">Síguenos</h4>
            <p className="text-gray-400 text-sm mb-4">
              Mantente informado sobre nuestras actividades y novedades.
            </p>
            
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
            
            <Link to="/login" className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-0 md:mt-2 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Sistema de Gestión de Reservas - Colegio Fe y Alegría
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;