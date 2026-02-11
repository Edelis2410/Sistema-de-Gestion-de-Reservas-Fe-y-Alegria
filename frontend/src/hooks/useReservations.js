// src/hooks/useReservations.js - VERSIÓN CORREGIDA
import { useState, useEffect } from 'react';
import { 
  getReservations,
  getSpaces,
  formatDate,
  RESERVATION_STATUS  // ← AÑADE ESTO
} from '../services/reservationService';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReservations = () => {
      try {
        setLoading(true);
        const data = getReservations();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las reservas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  // Función de filtrado básica
  const filterReservations = (searchTerm = '') => {
    if (!searchTerm.trim()) return reservations;
    
    const term = searchTerm.toLowerCase();
    return reservations.filter(reserva => {
      try {
        const espacio = getSpaces().find(e => e.id === reserva.espacio);
        const nombreEspacio = espacio?.nombre?.toLowerCase() || '';
        const motivo = (reserva.motivo || '').toLowerCase();
        const estado = (reserva.estado || '').toLowerCase();
        const idStr = reserva.id.toString();
        
        return nombreEspacio.includes(term) ||
               motivo.includes(term) ||
               estado.includes(term) ||
               idStr.includes(term);
      } catch (error) {
        return false;
      }
    });
  };

  return {
    // Estado
    reservations,
    loading,
    error,
    
    // Métodos
    filterReservations,
    
    // Constantes - ¡IMPORTANTE!
    RESERVATION_STATUS  // ← AHORA SÍ SE EXPORTA
    
  };
};