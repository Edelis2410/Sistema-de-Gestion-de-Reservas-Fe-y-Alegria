// src/components/common/Forms/ReservationModal.jsx
import React from 'react';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reservationName,
  onReservationNameChange,
  title = "Nombre de la Reserva",
  subtitle = "Por favor, ingresa un nombre para identificar tu reserva"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{subtitle}</p>
        
        <input
          type="text"
          value={reservationName}
          onChange={onReservationNameChange}
          placeholder="Ej: Reunión de profesores, Clase de matemáticas..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 text-sm"
        />
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;