// src/components/common/Forms/CancelarReservaModal.jsx
import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const CancelarReservaModal = ({
  reservaSeleccionada,
  setShowCancelarModal,
  obtenerNombreEspacio,
  formatFecha,
  confirmDeleteReserva
}) => {
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowCancelarModal(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Cancelar Reserva</h3>
          <button
            onClick={() => setShowCancelarModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          
          <p className="text-center text-gray-700 mb-2">
            ¿Estás seguro de que deseas cancelar la reserva?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {/* --- CAMBIO AQUÍ: ID VISUAL CORRELATIVO --- */}
            <p className="font-medium text-gray-800">
              #{(reservaSeleccionada.displayId || reservaSeleccionada.id).toString().padStart(2, '0')} - {reservaSeleccionada.motivo}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {obtenerNombreEspacio(reservaSeleccionada.espacio)} • {formatFecha(reservaSeleccionada.fecha)}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCancelarModal(false)}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              No, mantener
            </button>
            <button
              onClick={confirmDeleteReserva}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelarReservaModal;