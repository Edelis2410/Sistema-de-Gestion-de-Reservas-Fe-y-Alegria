// src/components/common/Calendar/MiniCalendar.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from '../UI/CalendarDay';
import { Button } from '../UI/Button';

export const MiniCalendar = ({ 
  currentDate = new Date(),
  highlightedDates = [],
  showTooltips = true
}) => {
  const [currentMonth, setCurrentMonth] = useState(currentDate);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

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

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendarDays();

  const getDateStatus = (date) => {
    if (!date) return { hasConfirmed: false, hasPending: false };
    
    const hasConfirmed = highlightedDates.some(h => 
      h.type === 'confirmed' && isSameDay(h.date, date)
    );
    
    const hasPending = highlightedDates.some(h => 
      h.type === 'pending' && isSameDay(h.date, date)
    );

    return { hasConfirmed, hasPending };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Calendario</h2>
          <p className="text-sm text-slate-500">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            icon={ChevronLeft}
            onClick={prevMonth}
            className="!p-2"
          />
          <Button 
            variant="secondary" 
            size="sm"
            icon={ChevronRight}
            onClick={nextMonth}
            className="!p-2"
          />
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes - ahora de solo lectura */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const { hasConfirmed, hasPending } = getDateStatus(date);
          const isCurrentMonth = date && date.getMonth() === currentMonth.getMonth();
          const isToday = date && isSameDay(date, new Date());

          return (
            <CalendarDay
              key={index}
              date={date}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              hasConfirmed={hasConfirmed}
              hasPending={hasPending}
              // Se quitó: isSelected y onClick
            />
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center mt-6 space-x-8 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-400 rounded mr-2" />
          <span className="text-slate-700 font-medium">Confirmadas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded mr-2" />
          <span className="text-slate-700 font-medium">Pendientes</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span className="text-slate-700 font-medium">Hoy</span>
        </div>
      </div>
    </div>
  );
};