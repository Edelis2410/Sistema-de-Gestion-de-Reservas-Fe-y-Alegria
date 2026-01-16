import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrearReserva = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    espacio: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombreReserva: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2026);

  // Espacios disponibles actualizados
  const espaciosDisponibles = [
    { id: 1, nombre: 'CERPA', edificio: 'Edificio B', tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'CAPILLA', edificio: 'Edificio B', tipo: 'Espacio Espiritual' },
    { id: 3, nombre: 'SACRAMENTO', edificio: 'Edificio C', tipo: 'Salón de Eventos' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', edificio: 'Edificio D', tipo: 'Espacio Polivalente' },
  ];

  // Obtener nombre del mes
  const getMonthName = (monthIndex) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  };

  // Generar días del calendario para el mes actual
  const generateCalendarDays = () => {
    const days = [];
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        disabled: true,
        isSunday: false
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
      days.push({
        day: i,
        month: 'current',
        disabled: dayOfWeek === 0,
        isSunday: dayOfWeek === 0
      });
    }
    
    const totalCells = 42;
    const daysNeeded = totalCells - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        day: i,
        month: 'next',
        disabled: true,
        isSunday: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
    setFormData(prev => ({ ...prev, fecha: '' }));
  };

  useEffect(() => {
    const espacioSeleccionado = localStorage.getItem('selectedSpace');
    if (espacioSeleccionado) {
      const espacioEncontrado = espaciosDisponibles.find(
        esp => esp.nombre === espacioSeleccionado
      );
      
      if (espacioEncontrado) {
        setFormData(prev => ({
          ...prev,
          espacio: espacioEncontrado.id.toString()
        }));
      }
      
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

  const handleDateClick = (day) => {
    const fecha = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, fecha }));
    setSelectedDate(day);
  };

  const handleHoraInicioChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, horaInicio: value }));
    
    if (formData.horaFin && value > formData.horaFin) {
      setFormData(prev => ({ ...prev, horaFin: '' }));
    }
  };

  const handleHoraFinChange = (e) => {
    const value = e.target.value;
    
    if (formData.horaInicio && value <= formData.horaInicio) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }
    
    setFormData(prev => ({ ...prev, horaFin: value }));
  };

  const handleGuardarClick = (e) => {
    e.preventDefault();
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin || !formData.espacio) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    setShowModal(true);
  };

  // Función para guardar la reserva en localStorage
  const saveReservationToStorage = (reservation) => {
    try {
      // Obtener reservas existentes
      const existingReservations = JSON.parse(localStorage.getItem('reservas')) || [];
      
      // Generar un ID único para la nueva reserva
      const newId = existingReservations.length > 0 
        ? Math.max(...existingReservations.map(r => r.id)) + 1 
        : 1;
      
      // Obtener información del espacio seleccionado
      const espacioSeleccionado = espaciosDisponibles.find(
        e => e.id.toString() === formData.espacio
      );
      
      // Crear objeto de reserva completo
      const nuevaReserva = {
        id: newId,
        espacio: parseInt(formData.espacio),
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        motivo: reservation.nombreReserva,
        descripcion: `Reserva creada para ${espacioSeleccionado?.nombre}`,
        estado: 'pendiente', // Estado por defecto
        fechaSolicitud: new Date().toISOString().split('T')[0],
        participantes: 1, // Valor por defecto
        capacidad: espacioSeleccionado?.capacidad || 50 // Capacidad por defecto
      };
      
      // Agregar la nueva reserva
      existingReservations.push(nuevaReserva);
      
      // Guardar en localStorage
      localStorage.setItem('reservas', JSON.stringify(existingReservations));
      
      console.log('Reserva guardada en localStorage:', nuevaReserva);
      return true;
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      return false;
    }
  };

  const handleModalSubmit = () => {
    if (!formData.nombreReserva.trim()) {
      alert('Por favor, ingrese un nombre para la reserva');
      return;
    }
    
    // Guardar la reserva en localStorage
    const saved = saveReservationToStorage(formData);
    
    if (saved) {
      console.log('Reserva creada:', formData);
      alert('Reserva creada exitosamente');
      setShowModal(false);
      navigate('/docente/reservas/historial');
    } else {
      alert('Error al guardar la reserva. Por favor, intente nuevamente.');
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Crear Reserva</h1>
            <p className="text-gray-600 text-sm">Selecciona fecha, hora y espacio</p>
          </div>
        </div>
      </div>

      {/* Contenido principal - 3 recuadros en horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Primer recuadro: Calendario */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Seleccionar fechas</h2>
          <p className="text-gray-600 text-xs mb-4">Elige el día para tu reserva</p>
          
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium text-gray-700 text-sm">
              {getMonthName(currentMonth)} de {currentYear}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded text-sm"
              >
                &lt;
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:bg-gray-100 rounded text-sm"
              >
                &gt;
              </button>
            </div>
          </div>
          
          <div className="border border-blue-100 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((dia, index) => (
                <div key={index} className="text-center font-medium text-gray-700 text-sm py-1">
                  {dia}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, index) => {
                const isSelected = selectedDate === dayObj.day && dayObj.month === 'current';
                const isCurrentMonth = dayObj.month === 'current';
                
                return (
                  <button
                    key={index}
                    onClick={() => !dayObj.disabled && handleDateClick(dayObj.day)}
                    disabled={dayObj.disabled}
                    className={`
                      h-10 flex items-center justify-center rounded-md text-sm
                      ${dayObj.disabled ? 'text-gray-300 cursor-not-allowed' : 
                        isCurrentMonth ? 'text-gray-800 hover:bg-blue-50' : 'text-gray-400'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      ${!dayObj.disabled && !isSelected ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    {dayObj.day}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              * No te permiten reservas los domingos.
            </p>
          </div>
          
          {formData.fecha && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">
                Fecha seleccionada: {formData.fecha}
              </p>
            </div>
          )}
        </div>
        
        {/* Segundo recuadro: Horario */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Hora y duración</h2>
          <p className="text-gray-600 text-xs mb-4">Selecciona el horario</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleHoraInicioChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de fin
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="time"
                  value={formData.horaFin}
                  onChange={handleHoraFinChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración rápida (opcional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((duracion) => (
                  <button
                    key={duracion}
                    type="button"
                    onClick={() => {
                      if (formData.horaInicio) {
                        const inicio = new Date(`2000-01-01T${formData.horaInicio}`);
                        const fin = new Date(inicio.getTime() + duracion * 60 * 60 * 1000);
                        const finStr = fin.toTimeString().slice(0, 5);
                        setFormData(prev => ({ ...prev, horaFin: finStr }));
                      }
                    }}
                    className={`
                      py-2 px-3 text-sm rounded-md border text-xs
                      ${formData.horaFin && formData.horaInicio && 
                        parseInt(formData.horaFin.split(':')[0]) - parseInt(formData.horaInicio.split(':')[0]) === duracion
                        ? 'bg-blue-100 text-blue-700 border-blue-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    {duracion} {duracion === 1 ? 'hora' : 'horas'}
                  </button>
                ))}
              </div>
            </div>
            
            {(formData.horaInicio || formData.horaFin) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-700">
                  Horario: {formData.horaInicio} - {formData.horaFin}
                  {formData.horaInicio && formData.horaFin && (
                    <span className="text-gray-600 ml-2 text-xs">
                      ({((new Date(`2000-01-01T${formData.horaFin}`) - new Date(`2000-01-01T${formData.horaInicio}`)) / (1000 * 60 * 60)).toFixed(1)} horas)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tercer recuadro: Espacios */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Seleccionar Espacio</h2>
          <p className="text-gray-600 text-xs mb-4">Elige el espacio disponible</p>
          
          <div className="space-y-4">
            {espaciosDisponibles.map((espacio) => (
              <button
                key={espacio.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, espacio: espacio.id.toString() }))}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all
                  ${formData.espacio === espacio.id.toString()
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                    : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{espacio.nombre}</h3>
                    <p className="text-gray-600 text-xs mt-1">{espacio.edificio}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">{espacio.tipo}</p>
              </button>
            ))}
          </div>
          
          {formData.espacio && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">
                Espacio seleccionado: {espaciosDisponibles.find(e => e.id.toString() === formData.espacio)?.nombre}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botón Guardar Centrado */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleGuardarClick}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Guardar
        </button>
      </div>

      {/* Modal para nombre de reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nombre de la Reserva
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Por favor, ingresa un nombre para identificar tu reserva
            </p>
            
            <input
              type="text"
              value={formData.nombreReserva}
              onChange={(e) => setFormData(prev => ({ ...prev, nombreReserva: e.target.value }))}
              placeholder="Ej: Reunión de profesores, Clase de matemáticas..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 text-sm"
            />
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearReserva;