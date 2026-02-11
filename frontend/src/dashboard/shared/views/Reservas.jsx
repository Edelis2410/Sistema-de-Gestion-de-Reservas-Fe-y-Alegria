import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Plus,
  Save,
  X,
  CheckCircle
} from 'lucide-react';

const Reservas = ({ user, isSidebarCollapsed }) => {
  const [formData, setFormData] = useState({
    space: '',
    eventName: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    attendees: '',
    recurring: false,
    recurrenceType: 'none'
  });

  // Espacios disponibles
  const spaces = [
    { id: 'capilla', name: 'Capilla', capacity: 100 },
    { id: 'cerpa', name: 'CERPA', capacity: 200 },
    { id: 'sacramento', name: 'Sacramento', capacity: 150 },
    { id: 'salon-multiple', name: 'Salón Múltiple', capacity: 300 },
  ];

  // Reservas existentes
  const existingReservations = [
    { id: 1, space: 'Capilla', date: '2024-03-15', time: '08:00 - 10:00', event: 'Retiro Espiritual' },
    { id: 2, space: 'CERPA', date: '2024-03-16', time: '14:00 - 16:00', event: 'Conferencia' },
    { id: 3, space: 'Sacramento', date: '2024-03-18', time: '18:00 - 21:00', event: 'Cena de Gala' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reserva enviada:', formData);
    // Aquí iría la lógica para enviar la reserva
    alert('Reserva enviada para aprobación');
    setFormData({
      space: '',
      eventName: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      attendees: '',
      recurring: false,
      recurrenceType: 'none'
    });
  };

  return (
    <div className={`p-4 pt-16 transition-all duration-300 ${
      isSidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Crea nuevas reservas y gestiona las existentes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de reserva */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Nueva Reserva</h2>
              <Plus className="h-5 w-5 text-blue-500" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selección de espacio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Espacio
                  </label>
                  <select
                    name="space"
                    value={formData.space}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar espacio</option>
                    {spaces.map(space => (
                      <option key={space.id} value={space.id}>
                        {space.name} (Capacidad: {space.capacity} personas)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre del evento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del evento
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Conferencia Anual"
                    required
                  />
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Horario */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Hora inicio
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Número de asistentes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Número de asistentes
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Recurrencia */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={formData.recurring}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Reserva recurrente
                  </label>
                  {formData.recurring && (
                    <select
                      name="recurrenceType"
                      value={formData.recurrenceType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="none">Seleccionar frecuencia</option>
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  )}
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe el propósito del evento..."
                  />
                </div>
              </div>

              {/* Botones del formulario */}
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enviar reserva
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    space: '',
                    eventName: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    description: '',
                    attendees: '',
                    recurring: false,
                    recurrenceType: 'none'
                  })}
                  className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
              </div>
            </form>

            {/* Información importante */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Recordatorios importantes</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Las reservas se aprueban en un plazo de 24-48 horas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Cancela con 24 horas de anticipación para evitar penalizaciones
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Verifica la disponibilidad antes de realizar la reserva
                </li>
              </ul>
            </div>
          </div>

          {/* Lista de reservas existentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Mis Reservas</h2>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>

            {existingReservations.length > 0 ? (
              <div className="space-y-4">
                {existingReservations.map((reservation) => (
                  <div key={reservation.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{reservation.space}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Confirmada
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{reservation.event}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(reservation.date).toLocaleDateString('es-ES')} • {reservation.time}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors">
                        Editar
                      </button>
                      <button className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No tienes reservas activas</p>
                <p className="text-gray-500 text-sm mt-1">Crea tu primera reserva</p>
              </div>
            )}

            {/* Estadísticas */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Estadísticas</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-gray-500">Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">73%</div>
                  <div className="text-xs text-gray-500">Aprobación</div>
                </div>
              </div>
            </div>

            {/* Disponibilidad rápida */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-2">¿Necesitas ayuda?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Consulta la disponibilidad de espacios antes de reservar
              </p>
              <button className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Ver disponibilidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;