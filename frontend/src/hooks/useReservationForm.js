// src/hooks/useReservationForm.js
import { useState } from 'react';

export const useReservationForm = (initialState = {}) => {
  const [formData, setFormData] = useState({
    espacio: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombreReserva: '',
    ...initialState
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (fecha, day) => {
    updateFormData('fecha', fecha);
    setSelectedDate(day);
  };

  const handleHoraInicioChange = (value) => {
    updateFormData('horaInicio', value);
    
    // Si la hora de inicio es mayor que la de fin, limpiar hora de fin
    if (formData.horaFin && value > formData.horaFin) {
      updateFormData('horaFin', '');
    }
  };

  const handleHoraFinChange = (value) => {
    if (formData.horaInicio && value <= formData.horaInicio) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }
    
    updateFormData('horaFin', value);
  };

  const resetForm = () => {
    setFormData({
      espacio: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      nombreReserva: '',
      ...initialState
    });
    setSelectedDate(null);
  };

  const isFormValid = () => {
    return formData.fecha && formData.horaInicio && formData.horaFin && formData.espacio;
  };

  return {
    formData,
    selectedDate,
    updateFormData,
    handleDateSelect,
    handleHoraInicioChange,
    handleHoraFinChange,
    resetForm,
    isFormValid
  };
};