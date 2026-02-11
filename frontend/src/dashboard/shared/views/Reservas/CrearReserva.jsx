// src/dashboard/shared/views/Reservas/CrearReserva.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, AlertCircle, Clock } from 'lucide-react'; // Añadí Clock para el icono

// Componentes UI
import CalendarPicker from '../../../../components/common/Forms/CalendarPicker';
import TimePicker from '../../../../components/common/Forms/TimePicker';
import SpaceSelector from '../../../../components/common/Selectors/SpaceSelector';
import ReservationModal from '../../../../components/common/Forms/ReservationModal';
import FormHeader from '../../../../components/common/Layout/FormHeader';

// Contextos
import { useAuth } from '../../../../contexts/AuthContext';

const CrearReserva = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorEspacios, setErrorEspacios] = useState('');
  const [errorDisponibilidad, setErrorDisponibilidad] = useState('');

  // Formulario
  const [formData, setFormData] = useState({
    espacio_id: '',
    titulo: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    descripcion: ''
  });

  const [selectedDate, setSelectedDate] = useState(null);

  // 1. CARGA DE ESPACIOS
  const loadEspacios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/espacios');
      const result = await response.json();
      
      if (result.success) {
        const simplificados = (result.data || []).map(esp => ({
          id: esp.id,
          nombre: esp.nombre,
          capacidad: esp.capacidad,
          tipo: esp.tipo
        }));
        setEspacios(simplificados);

        const preselected = localStorage.getItem('selectedSpace');
        if (preselected) {
          const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
          const encontrado = simplificados.find(e => norm(e.nombre) === norm(preselected));
          if (encontrado) setFormData(prev => ({ ...prev, espacio_id: encontrado.id.toString() }));
          localStorage.removeItem('selectedSpace');
        }
      }
    } catch (error) {
      setErrorEspacios('Error al cargar espacios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEspacios();
  }, [loadEspacios]);

  // Handlers
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorDisponibilidad('');
  };

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    updateFormData('fecha', `${year}-${month}-${day}`);
    setSelectedDate(date);
  };

  const isFormValid = () => {
    const { espacio_id, fecha, hora_inicio, hora_fin } = formData;
    if (!espacio_id || !fecha || !hora_inicio || !hora_fin) return false;

    // 1. Validación de Rango Escolar (7 AM - 5 PM)
    const inicio = parseInt(hora_inicio.split(':')[0]);
    const fin = parseInt(hora_fin.split(':')[0]);
    const minFin = parseInt(hora_fin.split(':')[1]);
    const dentroDeHorarioEscolar = inicio >= 7 && (fin < 17 || (fin === 17 && minFin === 0));

    if (!dentroDeHorarioEscolar) return false;

    // 2. Validación de Tiempo Real (No permitir horas pasadas si es hoy)
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    if (fecha === hoy) {
      const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
      const horaActual = ahora.getHours();
      const minutosActuales = ahora.getMinutes();

      if (hInicio < horaActual || (hInicio === horaActual && mInicio < minutosActuales)) {
      return false; // La hora ya pasó
      }
    }

    return true;
  };

  // Función para determinar si mostrar el aviso de horario (solo si hay horas pero son inválidas)
  const mostrarAvisoHorario = () => {
    const { hora_inicio, hora_fin } = formData;
    if (!hora_inicio || !hora_fin) return false;
    
    const inicio = parseInt(hora_inicio.split(':')[0]);
    const fin = parseInt(hora_fin.split(':')[0]);
    const minFin = parseInt(hora_fin.split(':')[1]);

    return !(inicio >= 7 && (fin < 17 || (fin === 17 && minFin === 0)));
  };

  const handleCheckAndOpenModal = async () => {
    setErrorDisponibilidad('');

    // --- VALIDACIÓN DE TIEMPO EN EL FRONTEND ---
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
  
    // 1. Validar fecha pasada
    if (formData.fecha < hoy) {
      setErrorDisponibilidad('No se pueden realizar reservas en fechas pasadas.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validar hora pasada (si es hoy)
    if (formData.fecha === hoy) {
     const [hInicio, mInicio] = formData.hora_inicio.split(':').map(Number);
     if (hInicio < ahora.getHours() || (hInicio === ahora.getHours() && mInicio < ahora.getMinutes())) {
       setErrorDisponibilidad('La hora de inicio seleccionada ya ha pasado.');
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
      }
    }
    
    if (!isFormValid()) return;
    
    setChecking(true);
    setErrorDisponibilidad('');

    try {
      const { espacio_id, fecha, hora_inicio, hora_fin } = formData;
      const response = await fetch(
        `http://localhost:5000/api/reservas/check?espacio_id=${espacio_id}&fecha=${fecha}&hora_inicio=${hora_inicio}&hora_fin=${hora_fin}`
      );
      
      const result = await response.json();

      if (result.success && result.disponible) {
        setShowModal(true);
      } else {
        setErrorDisponibilidad(result.message || 'Este espacio ya está ocupado en el horario seleccionado.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setErrorDisponibilidad('Error de conexión con el servidor al verificar disponibilidad.');
    } finally {
      setChecking(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!formData.titulo.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Verificamos el rol del usuario desde el contexto
      const isAdmin = user?.rol === 'administrador';

      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          espacio_id: parseInt(formData.espacio_id),
          usuario_id: user?.id,
          // AQUÍ LA MAGIA: Si es admin, mandamos el estado 'confirmada'
          estado: isAdmin ? 'confirmada' : 'pendiente'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowModal(false);
        setSaving(false);
        setShowSuccessModal(true);
      } else {
        setSaving(false);
        alert(`Error: ${result.error || 'No se pudo crear la reserva'}`);
      }
    } catch (error) {
      setSaving(false);
      alert('Error de conexión con el servidor');
    }
  };

  const goToHistory = () => {
    setShowSuccessModal(false);
    
    // Redirigir según el rol
    if (user?.rol === 'administrador') {
      navigate('/admin/reservas/historial');
    } else {
      navigate('/docente/reservas/historial');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <FormHeader title="Nueva Reserva" onBack={() => navigate('/docente/espacios')} />

      {errorDisponibilidad && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium text-sm">{errorDisponibilidad}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <CalendarPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} disabledDays={[0]} />
        <TimePicker
          horaInicio={formData.hora_inicio}
          horaFin={formData.hora_fin}
          onHoraInicioChange={(h) => updateFormData('hora_inicio', h)}
          onHoraFinChange={(h) => updateFormData('hora_fin', h)}
        />
        <SpaceSelector
          espacios={espacios}
          selectedSpace={formData.espacio_id}
          onSelectSpace={(id) => updateFormData('espacio_id', id)}
          loading={loading}
          title="Espacio"
          subtitle="Nombre, capacidad y tipo"
        />
      </div>

      <div className="flex flex-col items-center mt-10">
        {/* MENSAJE DE HORARIO PERMITIDO (Justo arriba del botón) */}
        {mostrarAvisoHorario() && (
          <div className="mb-4 flex items-center gap-2 text-red-500 animate-bounce">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold">El horario permitido es de 7:00 AM a 5:00 PM</span>
          </div>
        )}

        <button
          onClick={handleCheckAndOpenModal}
          disabled={!isFormValid() || saving || checking}
          className={`px-16 py-4 rounded-full text-white font-bold text-lg shadow-xl transition-all ${
            isFormValid() && !saving && !checking ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105' : 'bg-gray-300'
          }`}
        >
          {checking ? 'Verificando...' : saving ? 'Guardando...' : 'Confirmar Reserva'}
        </button>
      </div>

      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleConfirmReservation}
        reservationName={formData.titulo}
        onReservationNameChange={(e) => updateFormData('titulo', e.target.value)}
        isSaving={saving}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-14 w-14 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-800 mb-2">¡Todo listo!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tu reserva para <span className="font-bold text-gray-700">"{formData.titulo}"</span> ha sido registrada.
            </p>

            <button
              onClick={goToHistory}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center group transition-all shadow-lg shadow-blue-200"
            >
              Ir al Historial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearReserva;