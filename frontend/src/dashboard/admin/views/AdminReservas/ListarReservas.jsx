// src/dashboard/admin/views/AdminReservas/ListarReservas.jsx 
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Check, X, MapPin, MessageCircle, Eye, AlertCircle, Send, Edit } from 'lucide-react';
import AdminDetallesModal from './AdminDetallesModal';
import EditarReservaModal from './EditarReservaModal';

const ListarReservas = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estados para el rechazo
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [idParaRechazar, setIdParaRechazar] = useState(null);
  const [motivo_rechazo, setMotivoRechazo] = useState('');
  const [isRejecting, setIsRejecting] = useState(false); // Estado de carga

  // Espacios para el modal de edición
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA' },
    { id: 2, nombre: 'CAPILLA' },
    { id: 3, nombre: 'SACRAMENTO' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE' },
  ];

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservas?adminView=true', {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.success) {
        setSolicitudes(result.data);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const abrirModal = (res) => {
    const reservaFormateada = {
      ...res,
      displayId: res.id,
      usuario: res.usuario?.nombre || 'N/A',
      espacio: res.espacio?.nombre || 'N/A',
      espacio_id: res.espacio_id,
      motivo: res.titulo,
      fecha: res.fecha ? new Date(res.fecha).toISOString().split('T')[0] : 'N/A',
      horaInicio: res.hora_inicio ? new Date(res.hora_inicio).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : 'N/A',
      horaFin: res.hora_fin ? new Date(res.hora_fin).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : 'N/A',
      duracion: (() => {
        if (res.hora_inicio && res.hora_fin) {
          const diffMs = new Date(res.hora_fin) - new Date(res.hora_inicio);
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          return `${diffHrs}h ${diffMins}m`;
        }
        return "N/A";
      })()
    };
    setReservaSeleccionada(reservaFormateada);
    setIsModalOpen(true);
  };

  const handleEditClick = (res) => {
    const reservaParaEditar = {
        ...res,
        displayId: res.id,
        espacio: res.espacio_id,
        motivo: res.titulo,
        horaInicio: new Date(res.hora_inicio).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
        horaFin: new Date(res.hora_fin).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
    };
    setReservaSeleccionada(reservaParaEditar);
    setIsEditModalOpen(true);
  };

  const handleActualizarReserva = async (id, datosActualizados) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });
      const result = await response.json();
      if (result.success) {
        setIsEditModalOpen(false);
        cargarSolicitudes();
        return { success: true };
      } else {
        return { success: false, message: result.error || "No se pudo actualizar la reserva" };
      }
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      return { success: false, message: "Error de conexión con el servidor" };
    }
  };

  const handleEstado = async (id, nuevoEstado) => {
    if (nuevoEstado === 'rechazada' && !isRejectModalOpen) {
      setIdParaRechazar(id);
      setIsRejectModalOpen(true);
      return;
    }

    setIsRejecting(true); // ← Activar estado de carga

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          estado: nuevoEstado,
          motivo_rechazo: nuevoEstado === 'rechazada' ? motivo_rechazo : null 
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false); 
        setIsRejectModalOpen(false); 
        setMotivoRechazo(''); 
        setReservaSeleccionada(null);
        cargarSolicitudes(); 
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    } finally {
      setIsRejecting(false); // ← Desactivar estado de carga
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Cargando solicitudes...</div>;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Solicitudes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra las reservas del personal docente.
        </p>
      </div>

      {/* TABLA DE SOLICITUDES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Docente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Evento / Espacio</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {solicitudes.length > 0 ? (
                solicitudes.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {res.usuario?.nombre?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{res.usuario?.nombre}</p>
                          <p className="text-xs text-slate-500">{res.usuario?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{res.titulo}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} /> {res.espacio?.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`w-fit px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        res.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' :
                        res.estado === 'confirmada' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {res.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => abrirModal(res)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEditClick(res)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Editar">
                          <Edit size={18} />
                        </button>
                        {res.estado === 'pendiente' && (
                          <>
                            <button onClick={() => handleEstado(res.id, 'confirmada')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Aprobar">
                              <Check size={18} />
                            </button>
                            <button onClick={() => handleEstado(res.id, 'rechazada')} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Rechazar">
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No hay solicitudes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE RECHAZO */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertCircle size={24} />
              <h2 className="text-xl font-bold">Motivo del Rechazo</h2>
            </div>
            <textarea
              autoFocus
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              rows="4"
              placeholder="Ej: El espacio no está disponible..."
              value={motivo_rechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsRejectModalOpen(false)} 
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl font-medium"
                disabled={isRejecting}
              >
                Cancelar
              </button>
              <button 
                disabled={!motivo_rechazo.trim() || isRejecting} 
                onClick={() => handleEstado(idParaRechazar, 'rechazada')} 
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {isRejecting ? (
                  <>Procesando...</>
                ) : (
                  <><Send size={16} /> Confirmar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {isEditModalOpen && (
        <EditarReservaModal 
            reserva={reservaSeleccionada}
            espacios={espaciosDisponibles}
            setShowEditarModal={setIsEditModalOpen}
            onActualizar={handleActualizarReserva}
        />
      )}

      {/* MODAL DETALLES */}
      <AdminDetallesModal 
        isOpen={isModalOpen} 
        reserva={reservaSeleccionada} 
        onClose={() => { setIsModalOpen(false); setReservaSeleccionada(null); }} 
        onAprobar={(id) => handleEstado(id, 'confirmada')}
        onRechazar={(id) => handleEstado(id, 'rechazada')}
      />
    </div>
  );
};

export default ListarReservas;