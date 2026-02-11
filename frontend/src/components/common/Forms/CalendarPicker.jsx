// src/components/common/Forms/CalendarPicker.jsx
import React, { useState, useEffect } from 'react';

const CalendarPicker = ({ 
  selectedDate,
  onDateSelect,
  disabledDays = [0]
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Inicializar con la fecha actual o la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  // Generar días del calendario cuando cambia currentDate o selectedDate
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, selectedDate]);

  const getMonthName = (date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    const prevMonthDays = startingDay;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < prevMonthDays; i++) {
      days.push({
        day: prevMonthLastDay - prevMonthDays + i + 1,
        isCurrentMonth: false,
        disabled: true
      });
    }
    
    // Días del mes actual
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayOfWeek = dayDate.getDay();
      
      // CAMBIO AQUÍ: Usamos "disabled" para que coincida con la propiedad que lee el botón
      const disabled = disabledDays.includes(dayOfWeek);
      
      const isSelected = selectedDate && 
                        selectedDate.getDate() === i &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getFullYear() === year;
      
      days.push({
        day: i,
        date: dayDate,
        isCurrentMonth: true,
        disabled: disabled, // Propiedad unificada
        isSelected,
        isToday: dayDate.toDateString() === today.toDateString()
      });
    }
    
    // Días del próximo mes
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        disabled: true
      });
    }
    
    setCalendarDays(days);
  };

  const handleDateClick = (dayInfo) => {
    // Si el día está deshabilitado, no hacemos nada
    if (dayInfo.disabled || !dayInfo.isCurrentMonth) return;
    
    const selectedDateObj = dayInfo.date;
    onDateSelect(selectedDateObj);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    // Validación extra: no permitir "Hoy" si hoy es domingo (deshabilitado)
    if (disabledDays.includes(today.getDay())) {
      alert("Hoy es un día no laborable para reservas.");
      return;
    }
    setCurrentDate(today);
    onDateSelect(today);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-300 p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Seleccionar fechas</h2>
        <button
          onClick={handleTodayClick}
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
        >
          Hoy
        </button>
      </div>
      <p className="text-gray-600 text-xs mb-4">Elige el día para tu reserva</p>
      
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 text-sm">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
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
          {calendarDays.map((dayInfo, index) => {
            const isCurrentMonth = dayInfo.isCurrentMonth;
            const isToday = dayInfo.isToday;
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(dayInfo)}
                // Ahora dayInfo.disabled tiene el valor correcto (true o false)
                disabled={dayInfo.disabled}
                className={`
                  h-10 flex items-center justify-center rounded-md text-sm transition-colors
                  ${dayInfo.disabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 
                    isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${dayInfo.isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${!dayInfo.disabled && !dayInfo.isSelected && isCurrentMonth ? 'hover:bg-blue-50' : ''}
                  ${isToday && !dayInfo.isSelected ? 'bg-blue-100 text-blue-600' : ''}
                `}
              >
                {dayInfo.day}
              </button>
            );
          })}
        </div>
        
        {disabledDays.includes(0) && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            * No se permiten reservas los domingos.
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;