import React, { useState } from 'react';
import { MapPin, Users, Search, Building, Church, Users as UsersIcon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Espacios = ({ user, isSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const espacios = [
    { 
      nombre: 'CERPA', 
      capacidad: 200, 
      tipo: 'Auditorio Principal', 
      disponible: true,
      descripcion: 'Espacio ideal para conferencias, presentaciones y eventos académicos grandes.',
      icon: <Building className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Sacramento', 
      capacidad: 150, 
      tipo: 'Salón de Eventos', 
      disponible: true,
      descripcion: 'Perfecto para talleres, reuniones y actividades culturales.',
      icon: <BookOpen className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Salón Múltiple', 
      capacidad: 300, 
      tipo: 'Espacio Polivalente', 
      disponible: true,
      descripcion: 'El espacio más grande, diseñado para eventos institucionales y celebraciones.',
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Capilla', 
      capacidad: 100, 
      tipo: 'Espacio Espiritual', 
      disponible: true,
      descripcion: 'Ambiente tranquilo para reflexión, oración y actividades espirituales.',
      icon: <Church className="h-5 w-5 text-blue-500" />
    },
  ];

  const filteredEspacios = espacios.filter(espacio =>
    espacio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    espacio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReservarClick = (espacioNombre) => {
    // Guardar el espacio seleccionado en localStorage
    localStorage.setItem('selectedSpace', espacioNombre);
    
    // REDIRIGIR A LA RUTA CORRECTA DEL DASHBOARD DOCENTE
    // Esta es la ruta que debe coincidir con tu configuración
    navigate('/docente/reservas/crear');
    
    // Si no funciona, prueba con estas otras opciones:
    // navigate('/docente/crear-reserva');
    // navigate('/reservas/crear');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Espacios Disponibles</h1>
      <p className="text-gray-600">Explora y conoce los espacios que puedes reservar en el Colegio Fe y Alegría</p>
      
      {/* Búsqueda */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo de espacio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Contador de resultados */}
      <div className="mt-4 text-gray-600">
        Mostrando {filteredEspacios.length} de {espacios.length} espacios
      </div>
      
      {/* Lista de espacios */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEspacios.map((espacio, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-xl">{espacio.nombre}</h3>
                <p className="text-sm text-gray-600">{espacio.tipo}</p>
              </div>
              {espacio.icon}
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700 text-sm mb-3">{espacio.descripcion}</p>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Capacidad: {espacio.capacidad} personas</span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  espacio.disponible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {espacio.disponible ? 'Disponible' : 'No disponible'}
                </span>
                <button 
                  onClick={() => handleReservarClick(espacio.nombre)}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow hover:shadow-md"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredEspacios.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron espacios</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default Espacios;