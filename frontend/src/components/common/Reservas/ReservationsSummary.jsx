// components/common/Reservas/ReservationsSummary.jsx
import React from 'react';

export const ReservationsSummary = ({ 
  confirmed = 0, 
  pending = 0, 
  cancelled = 0, // Seguimos recibiendo 'cancelled' por compatibilidad con el componente padre
  showTitle = true 
}) => {
  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      {showTitle && (
        <h3 className="mb-4 text-sm font-medium text-slate-900">Resumen del mes</h3>
      )}
      <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-4 text-center">
        <div className="text-blue-600">
          <div className="text-xl font-semibold">{confirmed}</div>
          <div className="text-xs">Confirmadas</div>
        </div>
        <div className="text-yellow-600">
          <div className="text-xl font-semibold">{pending}</div>
          <div className="text-xs">Pendientes</div>
        </div>
        {/* Cambiamos text-slate-500 por text-red-500 para las rechazadas */}
        <div className="text-red-500"> 
          <div className="text-xl font-semibold">{cancelled}</div>
          <div className="text-xs">Rechazadas</div>
        </div>
      </div>
    </div>
  );
};