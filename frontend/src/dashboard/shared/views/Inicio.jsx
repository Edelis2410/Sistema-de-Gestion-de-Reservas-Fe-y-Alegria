// src/dashboard/shared/views/Inicio.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, RefreshCw, EyeOff } from 'lucide-react';
import { Button } from '../../../components/common/UI/Button';
import { MiniCalendar } from '../../../components/common/Calendar/MiniCalendar';
import { ReservationCard } from '../../../components/common/Reservas/ReservationCard';
import { ReservationsSummary } from '../../../components/common/Reservas/ReservationsSummary';

const Inicio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState([]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const savedHidden = JSON.parse(localStorage.getItem(`hidden_res_${user?.id}`) || '[]');
      setHiddenIds(savedHidden);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        const dataMapeada = result.data.map(res => {
          // --- CORRECCIÓN SEGURA DE FECHA ---
          // Extraemos YYYY-MM-DD directamente del string para evitar desfases
          const datePart = res.fecha.split('T')[0];
          const [year, month, day] = datePart.split('-');
          
          // --- CORRECCIÓN SEGURA DE HORAS ---
          const formatTime = (timeStr) => {
            if (!timeStr) return "00:00";
            // Si viene con formato ISO (con T), extraemos HH:mm
            return timeStr.includes('T') 
              ? timeStr.split('T')[1].substring(0, 5) 
              : timeStr.substring(0, 5);
          };

          return {
            id: res.id,
            space: res.espacio.nombre,
            date: `${day}/${month}/${year}`, // Formato visual DD/MM/YYYY
            rawDate: datePart, // YYYY-MM-DD para lógica
            time: `${formatTime(res.hora_inicio)} - ${formatTime(res.hora_fin)}`,
            event: res.titulo,
            status: res.estado, 
          };
        });
        setReservas(dataMapeada);
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  const handleHideReservation = (id) => {
    const newHiddenIds = [...hiddenIds, id];
    setHiddenIds(newHiddenIds);
    localStorage.setItem(`hidden_res_${user?.id}`, JSON.stringify(newHiddenIds));
  };

  const handleResetView = (e) => {
    e.preventDefault();
    setHiddenIds([]);
    localStorage.removeItem(`hidden_res_${user?.id}`);
  };

  const handleNewReservation = () => navigate(`/${user?.rol === 'administrador' ? 'admin' : 'docente'}/reservas/crear`);
  const handleViewReservation = () => navigate(`/${user?.rol === 'administrador' ? 'admin' : 'docente'}/reservas/historial`);

  // --- FILTROS DE LÓGICA ---
  const pendingReservations = reservas
    .filter(r => r.status === 'pendiente')
    .filter(r => !hiddenIds.includes(r.id))
    .slice(0, 2); 

  const confirmedReservations = reservas
    .filter(r => r.status === 'confirmada')
    .filter(r => !hiddenIds.includes(r.id));
  
  const rejectedCount = reservas.filter(r => r.status === 'rechazada').length;
  const totalPendientesGlobal = reservas.filter(r => r.status === 'pendiente').length;

  // --- CORRECCIÓN CALENDARIO ---
  const highlightedDates = reservas
    .filter(res => !hiddenIds.includes(res.id))
    .filter(res => res.status === 'confirmada' || res.status === 'pendiente')
    .map(res => {
      const [year, month, day] = res.rawDate.split('-').map(Number);
      return { 
        date: new Date(year, month - 1, day), 
        type: res.status === 'confirmada' ? 'confirmed' : 'pending' 
      };
    });

  if (loading || !user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin text-blue-500 mb-2" size={32} />
        <p className="text-slate-500 font-medium">Cargando tu panel...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Bienvenido, <span className="text-blue-600">{user.nombre || 'Usuario'}</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Panel de {user.rol === 'administrador' ? 'Administración' : 'Docente'}
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleNewReservation}>Nueva Reserva</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA: CALENDARIO Y RESUMEN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <MiniCalendar currentDate={new Date()} highlightedDates={highlightedDates} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-2">
              <ReservationsSummary 
                confirmed={confirmedReservations.length}
                pending={totalPendientesGlobal}
                cancelled={rejectedCount}
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: PENDIENTES */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Reservas pendientes</h2>
                {hiddenIds.length > 0 && (
                  <button onClick={handleResetView} className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 block">
                    Restablecer vista
                  </button>
                )}
              </div>
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>

            {pendingReservations.length > 0 ? (
              <div className="space-y-4">
                {pendingReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={{
                      ...reservation,
                      status: 'Pendiente'
                    }}
                    variant="default"
                    onView={handleViewReservation}
                    onCancel={() => handleHideReservation(reservation.id)}
                    labelCancel="Ocultar"
                    iconCancel={EyeOff}
                    userRole="teacher" 
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-slate-400 italic">No hay solicitudes pendientes.</p>
            )}
          </div>
        </div>

        {/* SECCIÓN INFERIOR: CONFIRMADAS */}
        <div className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Reservas confirmadas</h2>
            {confirmedReservations.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {confirmedReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={{
                      ...reservation,
                      status: 'Confirmada'
                    }}
                    variant="compact"
                    onView={handleViewReservation}
                    onCancel={() => handleHideReservation(reservation.id)}
                    labelCancel="Ocultar"
                    userRole="teacher" 
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No tienes reservas confirmadas actualmente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;