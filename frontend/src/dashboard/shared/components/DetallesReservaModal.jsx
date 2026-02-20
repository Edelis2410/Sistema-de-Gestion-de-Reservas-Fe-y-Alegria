// src/dashboard/shared/components/DetallesReservaModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const DetallesReservaModal = ({ 
  reservaSeleccionada, 
  setShowDetallesModal,
  obtenerNombreEspacio, 
  formatFecha 
}) => {
  
  // Función para cerrar al hacer clic fuera del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDetallesModal(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Detalles de la Reserva</h3>
          <button
            onClick={() => setShowDetallesModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">ID</h4>
            <p className="text-lg font-semibold">
              #{ (reservaSeleccionada.displayId || reservaSeleccionada.id).toString().padStart(2, '0') }
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Espacio</h4>
            <p className="text-gray-800">{obtenerNombreEspacio(reservaSeleccionada.espacio)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha</h4>
            <p className="text-gray-800">{formatFecha(reservaSeleccionada.fecha)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Horario</h4>
            <p className="text-gray-800">{reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Título/Motivo</h4>
            <p className="text-gray-800">{reservaSeleccionada.motivo}</p>
          </div>

          {/* Fecha de creación */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h4>
            <p className="text-gray-800">
              {reservaSeleccionada.fechaCreacion 
                ? new Date(reservaSeleccionada.fechaCreacion).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })
                : 'No disponible'}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <button
            onClick={() => setShowDetallesModal(false)}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesReservaModal;