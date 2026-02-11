// src/components/common/Selectors/SpaceSelector.jsx
import React from 'react';

const SpaceSelector = ({ 
  espacios = [], // Valor por defecto para evitar errores si llega null
  selectedSpace, 
  onSelectSpace,
  title = "Seleccionar Espacio",
  subtitle = "Elige el espacio disponible"
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-xs mb-4">{subtitle}</p>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {espacios.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm italic">
            No hay espacios disponibles en este momento.
          </div>
        ) : (
          espacios.map((espacio) => (
            <button
              key={espacio.id}
              type="button"
              onClick={() => onSelectSpace(espacio.id.toString())}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                ${selectedSpace === espacio.id.toString()
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                  : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{espacio.nombre}</h3>
                  {/* CAMBIO: Usamos 'tipo' o 'capacidad' porque 'edificio' no existe en tu SQL */}
                  <p className="text-gray-600 text-xs mt-1">Capacidad: {espacio.capacidad} personas</p>
                </div>
                {espacio.tipo && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {espacio.tipo}
                  </span>
                )}
              </div>
              {/* Mostramos la descripción si existe */}
              {espacio.descripcion && (
                <p className="text-gray-500 text-[11px] mt-2 line-clamp-1">{espacio.descripcion}</p>
              )}
            </button>
          ))
        )}
      </div>
      
      {selectedSpace && espacios.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-700">
            ✅ Seleccionado: {espacios.find(e => e.id.toString() === selectedSpace)?.nombre}
          </p>
        </div>
      )}
    </div>
  );
};

export default SpaceSelector;