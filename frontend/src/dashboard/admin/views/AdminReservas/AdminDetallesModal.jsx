import React from 'react';
import { 
  Calendar, Clock, MapPin, User, FileText, 
  CheckCircle2, XCircle, AlertCircle, Clock4 
} from 'lucide-react';
import { Button } from '../../../../components/common/UI/Button';

const AdminDetallesModal = ({ reserva, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  if (!reserva) return null;

  const formatearFechaCorrecta = (fechaStr) => {
    if (!fechaStr || fechaStr === 'N/A') return 'N/A';
    try {
      const [year, month, day] = fechaStr.split('-').map(Number);
      const fecha = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch (e) {
      return fechaStr;
    }
  };

  // Nueva función para formatear fecha de creación (incluye hora)
  const formatearFechaCreacion = (fechaStr) => {
    if (!fechaStr || fechaStr === 'N/A') return 'N/A';
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (e) {
      return fechaStr;
    }
  };

  const getEstadoEstilo = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pendiente': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rechazada': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'cancelada': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Encabezado Profesional */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Información de Reserva</h3>
            <p className="text-xs text-slate-500 font-medium">ID de Registro: #{reserva.id || '---'}</p>
          </div>
          <span className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-widest ${getEstadoEstilo(reserva.estado)}`}>
            {reserva.estado || 'Pendiente'}
          </span>
        </div>

        {/* Contenido Técnico */}
        <div className="p-6 space-y-8">
          
          {/* Fila de Título */}
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-slate-100 rounded text-slate-500">
              <FileText size={18} />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Descripción del Evento</label>
              <p className="text-slate-900 font-semibold text-base leading-snug">
                {reserva.titulo || 'Sin descripción técnica'}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Rejilla de Datos */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <DetailItem 
              icon={<User size={16}/>} 
              label="Usuario" 
              value={reserva.usuario} 
            />
            <DetailItem 
              icon={<MapPin size={16}/>} 
              label="Ubicación / Espacio" 
              value={reserva.espacio} 
            />
            <DetailItem 
              icon={<Calendar size={16}/>} 
              label="Fecha Asignada" 
              value={formatearFechaCorrecta(reserva.fecha)} 
              fullWidth
            />
            <DetailItem 
              icon={<Clock size={16}/>} 
              label="Hora de Inicio" 
              value={reserva.horaInicio} 
            />
            <DetailItem 
              icon={<Clock4 size={16}/>} 
              label="Duración Estimada" 
              value={reserva.duracion} 
            />
            {/* NUEVO: Fecha de Creación */}
            <DetailItem 
              icon={<Clock4 size={16}/>} 
              label="Fecha de Creación" 
              value={formatearFechaCreacion(reserva.fecha_creacion)} 
              fullWidth
            />
          </div>

          {/* Panel de Observaciones de Rechazo */}
          {reserva.motivo_rechazo && (
            <div className="p-4 rounded border-l-4 border-rose-500 bg-rose-50/50">
              <label className="block text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2">Observaciones de la Administración</label>
              <p className="text-rose-900 text-sm font-medium italic leading-relaxed">
                "{reserva.motivo_rechazo}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-10 py-2.5 rounded shadow-sm transition-all active:scale-95"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, fullWidth = false }) => (
  <div className={`flex items-start gap-3 ${fullWidth ? 'col-span-2' : ''}`}>
    <div className="mt-0.5 text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-slate-800 font-semibold">{value || 'No especificado'}</p>
    </div>
  </div>
);

export default AdminDetallesModal;