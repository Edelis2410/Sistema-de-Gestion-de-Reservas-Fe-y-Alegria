// components/common/UI/StatusBadge.jsx
export const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    Pendiente: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    Confirmada: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    Cancelada: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200'
    },
    Rechazada: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200'
    }
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const config = statusConfig[status] || statusConfig.Pendiente;

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizes[size]} font-semibold`}>
      {status}
    </span>
  );
};