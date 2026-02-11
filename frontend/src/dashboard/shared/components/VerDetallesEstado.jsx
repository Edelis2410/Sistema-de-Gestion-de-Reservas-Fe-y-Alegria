import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building
} from 'lucide-react';

const VerDetallesEstado = ({ 
  reserva, 
  espacio, 
  onClose,
  formatDate 
}) => {
  if (!reserva || !espacio) return null;

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'aprobada':
      case 'confirmada':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pendiente':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rechazada':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobada':
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Detalles de la Reserva</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">ID de Reserva</h3>
              <p className="text-lg font-semibold text-gray-800">
                #{reserva.id.toString().padStart(2, '0')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <div className="flex items-center">
                {getEstadoIcon(reserva.estado)}
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(reserva.estado)}`}>
                  {reserva.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Nombre</h4>
                <p className="text-gray-800">{reserva.usuarioNombre || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </h4>
                <p className="text-gray-800">{reserva.usuarioEmail || 'No especificado'}</p>
              </div>
              {reserva.usuarioRol && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Rol</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reserva.usuarioRol === 'docente' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {reserva.usuarioRol}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información del espacio - SOLO NOMBRE Y CAPACIDAD */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              Información del Espacio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Espacio
                </h4>
                <p className="text-lg font-medium text-gray-800">{espacio.nombre}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Capacidad
                </h4>
                <p className="text-gray-800">{espacio.capacidad} personas</p>
              </div>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Fecha y Hora
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha</h4>
                <p className="text-gray-800">{formatDate(reserva.fecha)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Horario
                </h4>
                <p className="text-gray-800">
                  {reserva.horaInicio || '--:--'} - {reserva.horaFin || '--:--'}
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional - SOLO MOTIVO */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Motivo de la Reserva</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{reserva.motivo || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerDetallesEstado;