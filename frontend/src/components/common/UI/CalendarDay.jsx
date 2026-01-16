// components/common/UI/CalendarDay.jsx
export const CalendarDay = ({ 
  date, 
  isToday, 
  isCurrentMonth, 
  hasConfirmed, 
  hasPending, 
  isSelected,
  onClick 
}) => {
  return (
    <div className="relative group">
      <button
        onClick={() => date && onClick(date)}
        className={`
          h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 relative border
          ${!date ? 'cursor-default opacity-50' : ''}
          ${
            hasConfirmed
              ? 'bg-green-50 border-2 border-green-400 text-green-800 hover:bg-green-100'
              : ''
          }
          ${
            hasPending && !hasConfirmed
              ? 'bg-yellow-50 border-2 border-yellow-400 text-yellow-800 hover:bg-yellow-100'
              : ''
          }
          ${
            !hasConfirmed && !hasPending && isCurrentMonth
              ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
              : ''
          }
          ${
            !isCurrentMonth && !hasConfirmed && !hasPending
              ? 'text-slate-400 border-slate-100 hover:bg-slate-50'
              : ''
          }
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
        disabled={!date}
      >
        <span className="relative z-10">
          {date ? date.getDate() : ''}
        </span>
        {isToday && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full z-20"></div>
        )}
      </button>

      {(hasConfirmed || hasPending) && (
        <div className="absolute z-20 invisible group-hover:visible bg-slate-900 text-white text-xs rounded-lg py-2 px-3 -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg">
          <div className="flex flex-col gap-1">
            {hasConfirmed && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                Reserva confirmada
              </span>
            )}
            {hasPending && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                Reserva pendiente
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};