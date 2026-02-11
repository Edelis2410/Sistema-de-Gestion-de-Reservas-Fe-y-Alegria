// src/components/common/Espacios/EspacioCard.jsx

import React from 'react';
import { Users, Edit3, Trash2, Eye } from 'lucide-react'; // Importamos los iconos
import { Button } from '../UI/Button';

const EspacioCard = ({ 
  espacio, 
  onReservar, 
  onEdit, 
  onDelete,
  onViewDetails,
  userRole = 'teacher'
}) => {
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-xl">{espacio.nombre}</h3>
          <p className="text-sm text-gray-600">{espacio.tipo}</p>
        </div>
        <div className="text-blue-500">
          {espacio.icon}
        </div>
      </div>
      
      {/* Contenido */}
      <div className="space-y-3">
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{espacio.descripcion}</p>
        
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
          
          {/* BOTONES PARA DOCENTE */}
          {!isAdmin && onReservar && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onReservar(espacio.nombre)}
            >
              Reservar
            </Button>
          )}
        </div>
      </div>

      {/* BOTONES DE ADMINISTRACIÓN (Esquina inferior derecha) */}
      {isAdmin && (
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-sm pl-2 py-1 rounded-lg">
          {onViewDetails && (
            <button 
              onClick={() => onViewDetails(espacio)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Ver detalles"
            >
              <Eye size={18} />
            </button>
          )}
          {onEdit && (
            <button 
              onClick={() => onEdit(espacio)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Editar"
            >
              <Edit3 size={18} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(espacio.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EspacioCard;