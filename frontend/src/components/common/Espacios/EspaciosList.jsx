// src/components/common/Espacios/EspaciosList.jsx
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../UI/Button';
import EspacioCard from './EspacioCard';

const EspaciosList = ({
  espacios,
  searchTerm,
  onSearchChange,
  userRole = 'teacher',
  onReservar,
  onEdit,
  onDelete,
  onViewDetails,
  onAddSpace,
  showAddButton = false,
  emptyStateTitle = "No se encontraron espacios",
  emptyStateDescription = "Intenta con otros términos de búsqueda"
}) => {
  const filteredEspacios = espacios.filter(espacio =>
    espacio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    espacio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo de espacio..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-600">
          Mostrando {filteredEspacios.length} de {espacios.length} espacios
        </div>
        
        {showAddButton && onAddSpace && (
          <Button 
            variant="primary" 
            onClick={onAddSpace}
          >
            Agregar Espacio
          </Button>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEspacios.map((espacio, index) => (
          <EspacioCard
            key={index}
            espacio={espacio}
            userRole={userRole}
            onReservar={onReservar}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {filteredEspacios.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{emptyStateTitle}</h3>
          <p className="text-gray-500">{emptyStateDescription}</p>
        </div>
      )}
    </div>
  );
};

export default EspaciosList; 