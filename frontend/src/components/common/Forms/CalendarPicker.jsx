// src/components/common/Forms/CalendarPicker.jsx
import React, { useState } from 'react';

const CalendarPicker = ({ 
  selectedDate,
  onDateSelect,
  disabledDays = [0],
  initialYear = 2026
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(initialYear);

  const getMonthName = (monthIndex) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  };

  const generateCalendarDays = () => {
    const days = [];
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        disabled: true,
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
      const isDayDisabled = disabledDays.includes(dayOfWeek);
      
      days.push({
        day: i,
        month: 'current',
        disabled: isDayDisabled,
        isSunday: dayOfWeek === 0
      });
    }
    
    // Días del próximo mes
    const totalCells = 42;
    const daysNeeded = totalCells - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        day: i,
        month: 'next',
        disabled: true,
      });
    }
    
    return days;
  };

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
    onDateSelect(null);
  };

  const handleDateClick = (day) => {
    const fecha = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onDateSelect(fecha, day);
  };

  const calendarDays = generateCalendarDays();

  return (
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
        
        {disabledDays.includes(0) && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            * No te permiten reservas los domingos.
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;