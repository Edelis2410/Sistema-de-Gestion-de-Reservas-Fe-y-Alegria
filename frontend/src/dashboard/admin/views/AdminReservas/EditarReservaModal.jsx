// src/dashboard/admin/views/AdminReservas/EditarReservaModal.jsx
import React, { useState } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';

const EditarReservaModal = ({ 
  reserva, 
  setShowEditarModal, 
  espacios, 
  onActualizar 
}) => {
  const [formData, setFormData] = useState({
    espacio_id: reserva?.espacio_id || reserva?.espacio || '',
    fecha: reserva?.fecha ? reserva.fecha.split('T')[0] : '', 
    hora_inicio: reserva?.horaInicio || '',
    hora_fin: reserva?.horaFin || '',
    titulo: reserva?.motivo || ''
  });

  // Estados para feedback visual
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Limpiar error al empezar a escribir de nuevo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // onActualizar ahora devuelve { success, message } según el cambio en ListarReservas
    const resultado = await onActualizar(reserva.id, formData);

    if (resultado && !resultado.success) {
      setError(resultado.message);
      setIsSubmitting(false);
    } else {
      // Si tuvo éxito, ListarReservas se encarga de cerrar el modal
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={() => !isSubmitting && setShowEditarModal(false)}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-left animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Editar Reserva</h3>
            <p className="text-xs text-slate-500">Referencia: #{reserva?.displayId}</p>
          </div>
          <button 
            onClick={() => setShowEditarModal(false)} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Alerta de Error Dinámica */}
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Espacio</label>
            <select 
              name="espacio_id"
              value={formData.espacio_id}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 transition-all"
              required
            >
              {espacios.map(esp => (
                <option key={esp.id} value={esp.id}>{esp.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha</label>
            <input 
              type="date" 
              name="fecha"
              min={new Date().toISOString().split('T')[0]}
              value={formData.fecha}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hora Inicio</label>
              <input 
                type="time" 
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hora Fin</label>
              <input 
                type="time" 
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Motivo</label>
            <textarea 
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              rows="3"
              className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 resize-none"
              required
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowEditarModal(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarReservaModal;