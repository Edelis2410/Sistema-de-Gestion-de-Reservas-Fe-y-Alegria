// src/components/common/Espacios/EspacioCard.jsx
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../UI/Button';

const EspacioCard = ({ 
  espacio, 
  onReservar, 
  onEdit, 
  onDelete,
  onViewDetails,
  userRole = 'teacher'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
          
          <div className="flex gap-2">
            {userRole === 'teacher' && onReservar && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => onReservar(espacio.nombre)}
              >
                Reservar
              </Button>
            )}
            
            {userRole === 'admin' && (
              <>
                {onViewDetails && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDetails(espacio)}
                  >
                    Ver
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onEdit(espacio)}
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => onDelete(espacio.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspacioCard; // ¡IMPORTANTE! Debe terminar con esto