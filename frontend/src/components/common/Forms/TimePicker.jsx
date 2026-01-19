// src/components/common/Forms/TimePicker.jsx
import React from 'react';

const TimePicker = ({ 
  horaInicio, 
  horaFin, 
  onHoraInicioChange, 
  onHoraFinChange,
  quickDurations = [1, 2, 3, 4, 5, 6]
}) => {
  const handleQuickDuration = (hours) => {
    if (horaInicio) {
      const [hour, minute] = horaInicio.split(':').map(Number);
      const endHour = hour + hours;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      onHoraFinChange(endTime);
    }
  };

  const calculateDuration = () => {
    if (!horaInicio || !horaFin) return 0;
    
    const [startHour, startMinute] = horaInicio.split(':').map(Number);
    const [endHour, endMinute] = horaFin.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Hora y duración</h2>
      <p className="text-gray-600 text-xs mb-4">Selecciona el horario</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de inicio
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => onHoraInicioChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora de fin
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => onHoraFinChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración rápida (opcional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quickDurations.map((hours) => {
              const duration = calculateDuration();
              const isActive = Math.abs(duration - hours) < 0.1;
              
              return (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleQuickDuration(hours)}
                  className={`
                    py-2 px-3 text-sm rounded-md border text-xs
                    ${isActive
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {hours} {hours === 1 ? 'hora' : 'horas'}
                </button>
              );
            })}
          </div>
        </div>
        
        {(horaInicio || horaFin) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-700">
              Horario: {horaInicio || '--:--'} - {horaFin || '--:--'}
              {horaInicio && horaFin && (
                <span className="text-gray-600 ml-2 text-xs">
                  ({calculateDuration().toFixed(1)} horas)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;