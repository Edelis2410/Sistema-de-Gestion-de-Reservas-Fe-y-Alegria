// src/components/Dashboard/Reservasd/CrearReserva.jsx (CÓDIGO COMPLETO CORREGIDO)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Rutas CORRECTAS para common (dentro de components/common/)
import CalendarPicker from '../../common/Forms/CalendarPicker';
import TimePicker from '../../common/Forms/TimePicker';
import SpaceSelector from '../../common/Selectors/SpaceSelector';
import ReservationModal from '../../common/Forms/ReservationModal';
import FormHeader from '../../common/Layout/FormHeader';

// Ruta CORRECTA para hooks (en src/hooks/) - SOLO 3 NIVELES
import { useReservationForm } from '../../../hooks/useReservationForm';

const CrearReserva = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [espacios, setEspacios] = useState([]);

  const {
    formData,
    selectedDate,
    updateFormData,
    handleDateSelect,
    handleHoraInicioChange,
    handleHoraFinChange,
    resetForm,
    isFormValid
  } = useReservationForm();

  // Datos de espacios
  const espaciosEjemplo = [
    { id: 1, nombre: 'CERPA', edificio: 'Edificio B', tipo: 'Auditorio Principal' },
    { id: 2, nombre: 'CAPILLA', edificio: 'Edificio B', tipo: 'Espacio Espiritual' },
    { id: 3, nombre: 'SACRAMENTO', edificio: 'Edificio C', tipo: 'Salón de Eventos' },
    { id: 4, nombre: 'SALÓN MÚLTIPLE', edificio: 'Edificio D', tipo: 'Espacio Polivalente' },
  ];

  useEffect(() => {
    // En producción, esto vendría de una API
    setEspacios(espaciosEjemplo);
    
    // Verificar si hay un espacio preseleccionado desde la página de espacios
    const espacioSeleccionado = localStorage.getItem('selectedSpace');
    if (espacioSeleccionado) {
      const espacioEncontrado = espaciosEjemplo.find(
        esp => esp.nombre === espacioSeleccionado
      );
      
      if (espacioEncontrado) {
        updateFormData('espacio', espacioEncontrado.id.toString());
      }
      
      localStorage.removeItem('selectedSpace');
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    setShowModal(true);
  };

  const saveReservation = () => {
    try {
      const existingReservations = JSON.parse(localStorage.getItem('reservas')) || [];
      const newId = existingReservations.length > 0 
        ? Math.max(...existingReservations.map(r => r.id)) + 1 
        : 1;
      
      const espacioSeleccionado = espacios.find(
        e => e.id.toString() === formData.espacio
      );
      
      const nuevaReserva = {
        id: newId,
        espacio: parseInt(formData.espacio),
        espacioNombre: espacioSeleccionado?.nombre,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        motivo: formData.nombreReserva,
        descripcion: `Reserva creada para ${espacioSeleccionado?.nombre}`,
        estado: 'pendiente',
        fechaSolicitud: new Date().toISOString().split('T')[0],
        participantes: 1,
        capacidad: 50
      };
      
      existingReservations.push(nuevaReserva);
      localStorage.setItem('reservas', JSON.stringify(existingReservations));
      return true;
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      return false;
    }
  };

  const handleConfirmReservation = () => {
    if (!formData.nombreReserva.trim()) {
      alert('Por favor, ingrese un nombre para la reserva');
      return;
    }
    
    const saved = saveReservation();
    
    if (saved) {
      alert('Reserva creada exitosamente');
      setShowModal(false);
      resetForm();
      navigate('/docente/reservas/historial');
    } else {
      alert('Error al guardar la reserva. Por favor, intente nuevamente.');
    }
  };

  const espacioSeleccionado = espacios.find(e => e.id.toString() === formData.espacio);

  return (
    <div className="p-6">
      {/* Encabezado */}
      <FormHeader
        title="Crear Reserva"
        subtitle="Selecciona fecha, hora y espacio"
        onBack={() => navigate('/docente/reservas')}
      />

      {/* Tres recuadros en horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calendario */}
        <CalendarPicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          disabledDays={[0]} // Domingos deshabilitados
        />
        
        {/* Horario */}
        <TimePicker
          horaInicio={formData.horaInicio}
          horaFin={formData.horaFin}
          onHoraInicioChange={handleHoraInicioChange}
          onHoraFinChange={handleHoraFinChange}
        />
        
        {/* Espacios */}
        <SpaceSelector
          espacios={espacios}
          selectedSpace={formData.espacio}
          onSelectSpace={(espacioId) => updateFormData('espacio', espacioId)}
        />
      </div>

      {/* Resumen de selección */}
      {(formData.fecha || formData.horaInicio || formData.espacio) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Selección actual:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {formData.fecha && (
              <div>
                <span className="font-medium">Fecha:</span> {formData.fecha}
              </div>
            )}
            {(formData.horaInicio || formData.horaFin) && (
              <div>
                <span className="font-medium">Horario:</span> {formData.horaInicio || '--:--'} - {formData.horaFin || '--:--'}
              </div>
            )}
            {espacioSeleccionado && (
              <div>
                <span className="font-medium">Espacio:</span> {espacioSeleccionado.nombre}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón Guardar */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isFormValid()}
          className={`
            px-8 py-3 text-white rounded-lg font-medium transition-colors
            ${isFormValid() 
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          Guardar Reserva
        </button>
      </div>

      {/* Modal de confirmación */}
      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleConfirmReservation}
        reservationName={formData.nombreReserva}
        onReservationNameChange={(e) => updateFormData('nombreReserva', e.target.value)}
      />
    </div>
  );
};

export default CrearReserva;