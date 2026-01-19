// src/components/common/Selectors/SpaceSelector.jsx
import React from 'react';

const SpaceSelector = ({ 
  espacios, 
  selectedSpace, 
  onSelectSpace,
  title = "Seleccionar Espacio",
  subtitle = "Elige el espacio disponible"
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-xs mb-4">{subtitle}</p>
      
      <div className="space-y-3">
        {espacios.map((espacio) => (
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
                <p className="text-gray-600 text-xs mt-1">{espacio.edificio}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">{espacio.tipo}</p>
          </button>
        ))}
      </div>
      
      {selectedSpace && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-700">
            Espacio seleccionado: {espacios.find(e => e.id.toString() === selectedSpace)?.nombre}
          </p>
        </div>
      )}
    </div>
  );
};

export default SpaceSelector;