import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrearReserva = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    espacio: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
    participantes: 1,
    descripcion: '',
  });

  // Espacios disponibles actualizados con los del colegio
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', capacidad: 200, tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'Sacramento', capacidad: 150, tipo: 'Salón de Eventos' },
    { id: 3, nombre: 'Salón Múltiple', capacidad: 300, tipo: 'Espacio Polivalente' },
    { id: 4, nombre: 'Capilla', capacidad: 100, tipo: 'Espacio Espiritual' },
  ];

  // Obtener el espacio seleccionado del localStorage
  useEffect(() => {
    const espacioSeleccionado = localStorage.getItem('selectedSpace');
    if (espacioSeleccionado) {
      // Encontrar el espacio por nombre
      const espacioEncontrado = espaciosDisponibles.find(
        esp => esp.nombre === espacioSeleccionado
      );
      
      if (espacioEncontrado) {
        setFormData(prev => ({
          ...prev,
          espacio: espacioEncontrado.id.toString()
        }));
      }
      
      // Limpiar el localStorage después de usar
      localStorage.removeItem('selectedSpace');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reserva creada:', formData);
    alert('Reserva creada exitosamente');
    navigate('/docente/reservas/historial');
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/docente/reservas')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crear Nueva Reserva</h1>
            <p className="text-gray-600">Complete el formulario para reservar un espacio</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Espacio */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Espacio a Reservar</span>
            </label>
            <select
              name="espacio"
              value={formData.espacio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione un espacio</option>
              {espaciosDisponibles.map(espacio => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre} - {espacio.tipo} (Capacidad: {espacio.capacidad} personas)
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={(e) => {
                  const today = new Date().toISOString().split('T')[0];
                  if (e.target.value < today) {
                    alert('No puedes seleccionar una fecha pasada');
                    setFormData(prev => ({ ...prev, fecha: today }));
                  } else {
                    handleChange(e);
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Hora Inicio</span>
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Hora Fin</span>
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={(e) => {
                    if (formData.horaInicio && e.target.value <= formData.horaInicio) {
                      alert('La hora de fin debe ser posterior a la hora de inicio');
                      return;
                    }
                    handleChange(e);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Participantes y Motivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4" />
                <span>Número de Participantes</span>
              </label>
              <input
                type="number"
                name="participantes"
                value={formData.participantes}
                onChange={(e) => {
                  const espacioSeleccionado = espaciosDisponibles.find(
                    esp => esp.id.toString() === formData.espacio
                  );
                  
                  if (espacioSeleccionado && parseInt(e.target.value) > espacioSeleccionado.capacidad) {
                    alert(`La capacidad máxima de este espacio es ${espacioSeleccionado.capacidad} personas`);
                    setFormData(prev => ({ 
                      ...prev, 
                      participantes: espacioSeleccionado.capacidad 
                    }));
                  } else {
                    handleChange(e);
                  }
                }}
                min="1"
                max="300"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Motivo de la Reserva</span>
              </label>
              <input
                type="text"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="Ej: Clase de Matemáticas, Reunión de Departamento..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Adicional (Opcional)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              placeholder="Agregue cualquier información adicional sobre la reserva..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/docente/reservas')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearReserva;