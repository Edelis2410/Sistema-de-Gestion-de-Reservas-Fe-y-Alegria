// src/components/common/Espacios/EspacioCard.jsx

import React from 'react';
import { Users, Edit3, Trash2, Power } from 'lucide-react';
import { Button } from '../UI/Button';

const EspacioCard = ({ 
  espacio, 
  onReservar, 
  onEdit, 
  onDelete,
  onToggleStatus, 
  userRole = 'teacher'
}) => {
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  return (
    <div className={`relative bg-white shadow-sm border p-8 hover:shadow-md transition-all group flex flex-col justify-between
      rounded-[1.5rem] 
      h-full min-h-[240px] 
      ${!espacio.activo ? 'border-gray-300 bg-gray-50/50' : 'border-gray-200'}
    `}>
      
      {/* Sección Superior: Título e Icono */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={`font-bold text-xl tracking-tight ${!espacio.activo ? 'text-gray-500' : 'text-gray-800'}`}>
              {espacio.nombre}
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mt-1">
              {espacio.tipo}
            </p>
          </div>
          <div className={`${!espacio.activo ? 'text-gray-300' : 'text-blue-500'} bg-blue-50 p-3 rounded-2xl`}>
            {espacio.icon || <Users size={20} />}
          </div>
        </div>
        
        {/* Contenido Central */}
        <div className="space-y-4">
          <p className={`text-sm leading-relaxed line-clamp-3 ${!espacio.activo ? 'text-gray-400' : 'text-gray-600'}`}>
            {espacio.descripcion || "Sin descripción disponible."}
          </p>
          
          <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-100/50 w-fit px-3 py-1.5 rounded-xl">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>Capacidad: {espacio.capacidad}</span>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Estado y Botón de Acción */}
      <div className="mt-6 flex items-center justify-between">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
          espacio.activo 
            ? 'bg-green-100 text-green-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {espacio.activo ? '● Operativo' : '● Inactivo'}
        </span>
        
        {!isAdmin && onReservar && (
          <Button 
            variant="primary" 
            size="sm"
            className="rounded-xl px-6 font-bold"
            disabled={!espacio.activo}
            onClick={() => onReservar(espacio.nombre)}
          >
            Reservar
          </Button>
        )}
      </div>

      {/* ✅ BOTONES DE ADMINISTRACIÓN (Ahora en la parte inferior derecha) */}
      {isAdmin && (
        <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-gray-100">
            {onToggleStatus && (
              <button 
                onClick={() => onToggleStatus(espacio.id)}
                className={`p-2 rounded-xl transition-colors ${
                  espacio.activo ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'
                }`}
                title="Estado"
              >
                <Power size={16} />
              </button>
            )}

            {onEdit && (
              <button 
                onClick={() => onEdit(espacio)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Editar"
              >
                <Edit3 size={16} />
              </button>
            )}

            {onDelete && (
              <button 
                onClick={() => onDelete(espacio.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EspacioCard;