// components/common/Reservas/ReservationCard.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import { StatusBadge } from '../UI/StatusBadge';
import { Button } from '../UI/Button';

export const ReservationCard = ({ 
  reservation, 
  variant = 'default', // 'default', 'compact', 'detailed'
  onView,
  onCancel,
  onApprove, // Para admin
  onReject,  // Para admin
  showActions = true,
  userRole = 'teacher' // 'teacher' | 'admin'
}) => {
  const { id, space, date, time, event, status } = reservation;

  const cardVariants = {
    default: "rounded-lg border p-4 shadow-sm",
    compact: "rounded border p-3",
    detailed: "rounded-lg border p-6 shadow-md"
  };

  const handleView = () => onView?.(id);
  const handleCancel = () => onCancel?.(id);
  const handleApprove = () => onApprove?.(id);
  const handleReject = () => onReject?.(id);

  const isAdmin = userRole === 'admin';
  const isPending = status === 'Pendiente';

  return (
    <div className={`${cardVariants[variant]} ${
      status === 'Pendiente' 
        ? 'border-yellow-200 bg-yellow-50' 
        : status === 'Confirmada'
        ? 'border-blue-100 bg-blue-50'
        : 'border-slate-200 bg-white'
    }`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-medium text-slate-900">
          {space}
        </h3>
        <StatusBadge status={status} />
      </div>
      
      <p className="text-sm text-slate-800 font-medium mb-3">
        {event}
      </p>
      
      <div className="mb-4 flex items-center text-sm text-slate-600">
        <Calendar className="mr-2 h-4 w-4 text-slate-500" />
        <span>
         {/* Si 'date' ya contiene una "/" (como "15/02/2026"), lo mostramos tal cual.
           Si no, lo tratamos como un objeto Date.
         */}
         {typeof date === 'string' && date.includes('/') 
           ? date 
           :new Date(date).toLocaleDateString('es-ES')
         } • {time}
        </span>
     </div>

      {isAdmin && isPending && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800 font-medium">
            Solicitado por: {reservation.requestedBy || 'Docente'}
          </p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2">
          {onView && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleView}
              className="flex-1"
            >
              Ver
            </Button>
          )}
          
          {isAdmin && isPending ? (
            <>
              <Button 
                variant="success" 
                size="sm"
                onClick={handleApprove}
                className="flex-1"
              >
                Aprobar
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleReject}
                className="flex-1"
              >
                Rechazar
              </Button>
            </>
          ) : (
            onCancel && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};