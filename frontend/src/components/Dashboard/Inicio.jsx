import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Inicio = ({ user, isSidebarCollapsed }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Datos de ejemplo para reservas pendientes
  const pendingReservations = [
    { id: 1, space: 'Capilla', date: '2024-03-15', time: '08:00 - 10:00', event: 'Retiro Espiritual', status: 'Pendiente' },
    { id: 2, space: 'CERPA', date: '2024-03-16', time: '14:00 - 16:00', event: 'Conferencia', status: 'Pendiente' },
    { id: 3, space: 'Sacramento', date: '2024-03-18', time: '18:00 - 21:00', event: 'Cena de Gala', status: 'Pendiente' },
  ];

  // Generar días del mes para el minicalendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navegación del calendario
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo, <span className="text-blue-600">{user?.name || 'Docente'}</span>
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver tu calendario y gestionar tus reservas pendientes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Minicalendario */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Calendario</h2>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                      date
                        ? date.toDateString() === selectedDate.toDateString()
                          ? 'bg-blue-500 text-white'
                          : date.getMonth() === currentMonth.getMonth()
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-gray-100'
                        : ''
                    }`}
                    disabled={!date}
                  >
                    {date ? date.getDate() : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Eventos del día seleccionado */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                Eventos para {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Matemáticas Avanzadas</p>
                    <p className="text-sm text-gray-600">Capilla • 08:00 - 10:00</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Física Experimental</p>
                    <p className="text-sm text-gray-600">Laboratorio • 10:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de reservas pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Reservas Pendientes</h2>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>

            {pendingReservations.length > 0 ? (
              <div className="space-y-4">
                {pendingReservations.map((reservation) => (
                  <div key={reservation.id} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{reservation.space}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        {reservation.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{reservation.event}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(reservation.date).toLocaleDateString('es-ES')} • {reservation.time}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Confirmar
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-600">No tienes reservas pendientes</p>
                <p className="text-gray-500 text-sm mt-1">Todas tus reservas están confirmadas</p>
              </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Resumen del mes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-gray-500">Confirmadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-gray-500">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-xs text-gray-500">Canceladas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximas reservas confirmadas */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Próximas Reservas Confirmadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-bold text-gray-900 mb-2">Capilla</h3>
                <p className="text-sm text-gray-600 mb-1">Retiro Espiritual</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>15 Mar • 08:00-10:00</span>
                </div>
              </div>
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-bold text-gray-900 mb-2">CERPA</h3>
                <p className="text-sm text-gray-600 mb-1">Conferencia Anual</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>20 Mar • 15:00-17:00</span>
                </div>
              </div>
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-bold text-gray-900 mb-2">Sacramento</h3>
                <p className="text-sm text-gray-600 mb-1">Cena de Gala</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>25 Mar • 18:00-21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;