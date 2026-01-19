import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Church, Users as UsersIcon, Search, X, Filter } from 'lucide-react';

const Espacios = ({ user, isSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
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
      icon: <Church className="h-5 w-5 text-blue-500" />
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

  // Función para normalizar texto (quitar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Opciones de filtro
  const filtros = [
    { value: 'todos', label: 'Todos' },
    { value: 'capacidad-alta', label: 'Capacidad alta (200+)' },
    { value: 'capacidad-media', label: 'Capacidad media (100-200)' },
    { value: 'disponibles', label: 'Solo disponibles' },
  ];

  // Filtrar espacios basados en el término de búsqueda y filtro seleccionado
  const espaciosFiltrados = espacios.filter(espacio => {
    // Primero aplicar el filtro de categoría
    if (selectedFilter !== 'todos') {
      switch (selectedFilter) {
        case 'capacidad-alta':
          if (espacio.capacidad < 200) return false;
          break;
        case 'capacidad-media':
          if (espacio.capacidad < 100 || espacio.capacidad > 200) return false;
          break;
        case 'disponibles':
          if (!espacio.disponible) return false;
          break;
        default:
          break;
      }
    }

    // Luego aplicar la búsqueda por texto
    if (!searchTerm.trim()) return true;
    
    const termino = normalizeText(searchTerm);
    
    // Normalizar cada campo para comparar
    const nombreNormalizado = normalizeText(espacio.nombre);
    const tipoNormalizado = normalizeText(espacio.tipo);
    const descripcionNormalizada = normalizeText(espacio.descripcion);
    
    return (
      nombreNormalizado.includes(termino) ||
      tipoNormalizado.includes(termino) ||
      descripcionNormalizada.includes(termino)
    );
  });

  const handleReservar = (espacioNombre) => {
    localStorage.setItem('selectedSpace', espacioNombre);
    navigate('/docente/reservas/crear');
  };

  return (
    <div className="p-6">
      {/* Encabezado con barra de búsqueda y filtro */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Título */}
          <div className="mb-6 md:mb-0 md:flex-1 md:min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Espacios Disponibles</h1>
            <p className="text-gray-600">Explora y conoce los espacios que puedes reservar en el Colegio Fe y Alegría</p>
          </div>
          
          {/* Barra de búsqueda con filtro */}
          <div className="w-full md:w-auto md:ml-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Barra de búsqueda */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar espacios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 md:w-96"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Filtro */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-48"
                >
                  {filtros.map(filtro => (
                    <option key={filtro.value} value={filtro.value}>
                      {filtro.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de espacios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espaciosFiltrados.map((espacio, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {espacio.icon}
                  <h3 className="text-lg font-semibold text-gray-900">{espacio.nombre}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${espacio.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {espacio.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              
              <p className="mt-4 text-gray-600">{espacio.descripcion}</p>
              
              {/* Solo muestra la capacidad, sin el tipo */}
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>Capacidad: {espacio.capacidad} personas</span>
              </div>
              
              <button
                onClick={() => handleReservar(espacio.nombre)}
                disabled={!espacio.disponible}
                className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${espacio.disponible ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <Church className="h-4 w-4" />
                <span>Reservar este espacio</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Estado vacío */}
      {espaciosFiltrados.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center py-12">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron espacios</h3>
          <p className="text-gray-500">
            {searchTerm || selectedFilter !== 'todos' 
              ? 'Intenta con otros términos de búsqueda o cambia el filtro'
              : 'No hay espacios disponibles en este momento'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Espacios;