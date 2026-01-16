// components/dashboard/Inicio.jsx (refactorizado)
import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../common/UI/Button';
import { MiniCalendar } from '../common/Calendar/MiniCalendar';
import { ReservationCard } from '../common/Reservas/ReservationCard';
import { ReservationsSummary } from '../common/Reservas/ReservationsSummary';
import { SectionHeader } from '../common/Layout/SectionHeader';

const Inicio = ({ user, isSidebarCollapsed }) => {
  // Estado compartido
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 9));
  
  // Datos - ahora podrían venir de una API
  const pendingReservations = [
    {
      id: 1,
      space: 'Capilla',
      date: '2026-01-15',
      time: '08:00 - 10:00',
      event: 'Retiro Espiritual',
      status: 'Pendiente',
    },
  ];

  const confirmedReservations = [
    {
      id: 1,
      space: 'Capilla',
      date: '2026-01-09',
      time: '08:00 - 10:00',
      event: 'Matemáticas Avanzadas',
      status: 'Confirmada',
    },
    {
      id: 2,
      space: 'CERPA',
      date: '2026-01-19',
      time: '14:00 - 16:00',
      event: 'Seminario',
      status: 'Confirmada',
    },
  ];

  // Preparar fechas resaltadas para el calendario
  const highlightedDates = [
    ...confirmedReservations.map(res => ({ 
      date: new Date(res.date), 
      type: 'confirmed' 
    })),
    ...pendingReservations.map(res => ({ 
      date: new Date(res.date), 
      type: 'pending' 
    }))
  ];

  // Handlers
  const handleNewReservation = () => {
    console.log('Nueva reserva');
  };

  const handleViewReservation = (reservationId) => {
    console.log('Ver reserva:', reservationId);
  };

  const handleCancelReservation = (reservationId) => {
    console.log('Cancelar reserva:', reservationId);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Bienvenido de nuevo,{' '}
              <span className="text-blue-600">{user?.name || 'Docente'}</span>
            </h1>
            <p className="text-slate-600 text-sm">
              Aquí puedes ver tu calendario y gestionar tus reservas pendientes
            </p>
          </div>
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={handleNewReservation}
          >
            Nueva Reserva
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Minicalendario */}
          <div className="lg:col-span-2">
            <MiniCalendar 
              currentDate={new Date(2026, 0, 1)}
              onDateSelect={setSelectedDate}
              highlightedDates={highlightedDates}
            />
          </div>

          {/* Sección de reservas pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <SectionHeader 
              title="Reservas pendientes"
              subtitle="Requieren confirmación"
              icon={AlertCircle}
            />

            {pendingReservations.length > 0 ? (
              <div className="space-y-4">
                {pendingReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    variant="default"
                    onView={handleViewReservation}
                    onCancel={handleCancelReservation}
                    userRole="teacher"
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
                <p className="mb-2 text-base font-semibold text-slate-700">
                  ¡No tienes reservas pendientes!
                </p>
                <Button 
                  variant="primary"
                  onClick={handleNewReservation}
                >
                  Crear nueva reserva
                </Button>
              </div>
            )}

            <ReservationsSummary 
              confirmed={confirmedReservations.length}
              pending={pendingReservations.length}
              cancelled={0}
            />
          </div>
        </div>

        {/* Sección de reservas confirmadas */}
        <div className="mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader 
              title="Reservas confirmadas"
              subtitle="Espacios reservados para este mes"
              icon={CheckCircle}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {confirmedReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  variant="compact"
                  onView={handleViewReservation}
                  onCancel={handleCancelReservation}
                  userRole="teacher"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;