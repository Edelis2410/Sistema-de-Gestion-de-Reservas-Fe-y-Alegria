import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Loader, Building, Church, 
  Users as UsersIcon, BookOpen, Plus, X, CheckCircle2,
  AlertTriangle, Clock, MessageSquare 
} from 'lucide-react';

import EspacioCard from '../../../components/common/Espacios/EspacioCard';

// ✅ Función para ignorar acentos y mayúsculas
const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Espacios = () => {
  // --- ESTADOS ---
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [motivoDesactivacion, setMotivoDesactivacion] = useState('');

  // ✅ Actualizado a las 05:00 PM según tu cambio en Prisma
  const HORARIO_APERTURA = "07:00 AM";
  const HORARIO_CIERRE = "05:00 PM";

  const [nuevoEspacio, setNuevoEspacio] = useState({
    nombre: '', capacidad: '', tipo: '', descripcion: ''
  });

  const navigate = useNavigate();
  const rawRole = localStorage.getItem('userRole');
  const userRole = rawRole ? rawRole.toLowerCase() : '';
  const isAdmin = userRole === 'administrador' || userRole === 'admin';

  // --- LOGICA DE CIERRE DE FILTRO ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- CARGA DE DATOS ---
  const loadEspacios = useCallback(async () => {
    try {
      setLoading(true);
      // El backend ya filtra automáticamente los que tienen "eliminado: true"
      const response = await fetch('http://localhost:5000/api/espacios', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      if (result.success) {
        setEspacios(result.data || []);
      }
    } catch (error) {
      console.error('Error cargando espacios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEspacios(); }, [loadEspacios]);

  // --- CAMBIO DE ESTADO (ACTIVAR/DESACTIVAR) ---
  const handleToggleStatus = (espacio) => {
    if (espacio.activo) {
      setSelectedId(espacio.id);
      setMotivoDesactivacion('');
      setShowDeactivateModal(true);
    } else {
      procesarCambioEstado(espacio.id, true, '');
    }
  };

  const procesarCambioEstado = async (id, nuevoEstado, motivo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/espacios/${id}/toggle`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ motivo })
      });
      const data = await response.json();
      if (data.success) {
        setShowDeactivateModal(false);
        loadEspacios(); 
      }
    } catch (error) {
      alert("Error al cambiar estado");
    }
  };

  // --- CRUD ---
  const handleSaveSpace = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const url = isEditMode 
      ? `http://localhost:5000/api/espacios/${selectedId}` 
      : 'http://localhost:5000/api/espacios';
    
    try {
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...nuevoEspacio,
          capacidad: parseInt(nuevoEspacio.capacidad)
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccessDialog(true);
        loadEspacios();
        setTimeout(() => {
          setIsModalOpen(false);
          setShowSuccessDialog(false);
        }, 2000);
      }
    } catch (error) {
      alert("Error al guardar");
    } finally { setIsSaving(false); }
  };

  const handleEditClick = (espacio) => {
    setIsEditMode(true);
    setSelectedId(espacio.id);
    setNuevoEspacio({
      nombre: espacio.nombre,
      capacidad: espacio.capacidad,
      tipo: espacio.tipo || '',
      descripcion: espacio.descripcion || ''
    });
    setIsModalOpen(true);
  };

  // ✅ ELIMINAR (Soft Delete)
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/espacios/${selectedId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteConfirm(false);
        // Al recargar, como el backend puso "eliminado: true", ya no vendrá en la lista
        loadEspacios(); 
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // --- LÓGICA DE FILTRADO ---
  const tiposUnicos = ['Todos', 'Académicos', 'Culturales', 'Eventos', 'Espirituales'];
  
  const filteredEspacios = espacios.filter(esp => {
    const busquedaLimpia = normalizarTexto(searchTerm);
    const nombreLimpio = normalizarTexto(esp.nombre);
    const descLimpia = normalizarTexto(esp.descripcion || '');

    const matchesSearch = nombreLimpio.includes(busquedaLimpia) || descLimpia.includes(busquedaLimpia);
    const matchesFilter = filterType === 'Todos' || esp.tipo === filterType;
    
    // Aquí NO filtramos por activo, porque queremos que los inactivos se sigan viendo (atenuados)
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* 1. HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Espacios Disponibles</h1>
            <p className="text-gray-600">Gestión y disponibilidad horaria institucional</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar espacio ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm bg-white transition-all"
              />
            </div>

            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full sm:w-auto border rounded-lg px-4 py-2 bg-white outline-none shadow-sm flex items-center justify-between gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <span>{filterType}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
                  {tiposUnicos.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => { setFilterType(tipo); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${filterType === tipo ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'}`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MODALES Y DIÁLOGOS */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full animate-in zoom-in duration-300">
            <CheckCircle2 size={60} className="text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Completado!</h3>
            <p className="text-gray-500 text-center">La información ha sido guardada.</p>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar espacio?</h3>
            <p className="text-gray-500 mb-6">Esta acción quitará el espacio de la lista definitivamente.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl font-bold text-gray-600">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold">Quitar</button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b bg-amber-50 flex justify-between items-center text-amber-700">
              <span className="flex items-center gap-2 font-bold"><AlertTriangle size={20} /> Confirmar Desactivación</span>
              <button onClick={() => setShowDeactivateModal(false)} className="hover:bg-amber-100 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Indica el motivo del cierre temporal:</p>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea 
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border rounded-xl h-28 resize-none bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Mantenimiento, limpieza..."
                  value={motivoDesactivacion}
                  onChange={(e) => setMotivoDesactivacion(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={() => setShowDeactivateModal(false)} className="flex-1 py-2.5 font-bold text-gray-500">Cancelar</button>
              <button 
                disabled={!motivoDesactivacion.trim()}
                onClick={() => procesarCambioEstado(selectedId, false, motivoDesactivacion)}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl font-bold disabled:opacity-50"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Espacio' : 'Nuevo Espacio'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSpace} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-black-400 mb-1 uppercase tracking-widest ml-1">Nombre</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.nombre} onChange={(e) => setNuevoEspacio({...nuevoEspacio, nombre: e.target.value})} />
              </div>

              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-[10px] uppercase tracking-wider">
                   <Clock size={14} /> <span>Horario Institucional Predefinido</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-2 border rounded-xl"><span className="block text-[8px] text-black-400 font-bold">APERTURA</span><span className="font-bold text-gray-700">{HORARIO_APERTURA}</span></div>
                  <div className="bg-white p-2 border rounded-xl"><span className="block text-[8px] text-black-400 font-bold">CIERRE</span><span className="font-bold text-gray-700">{HORARIO_CIERRE}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-black-400 mb-1 uppercase tracking-widest ml-1">Capacidad</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.capacidad} onChange={(e) => setNuevoEspacio({...nuevoEspacio, capacidad: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black-400 mb-1 uppercase tracking-widest ml-1">Tipo</label>
                  <select required className="w-full px-4 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.tipo} onChange={(e) => setNuevoEspacio({...nuevoEspacio, tipo: e.target.value})}>
                    <option value="">Elegir...</option>
                    <option value="Académicos">Académicos</option>
                    <option value="Culturales">Culturales</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Espirituales">Espirituales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black-400 mb-1 uppercase tracking-widest ml-1">Descripción</label>
                <textarea className="w-full px-4 py-2 border rounded-xl h-20 resize-none outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.descripcion} onChange={(e) => setNuevoEspacio({...nuevoEspacio, descripcion: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  {isSaving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LISTADO DE TARJETAS */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 text-gray-400">
          <Loader className="animate-spin text-blue-600 mb-2" size={32} />
          <p className="text-sm font-medium">Sincronizando espacios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEspacios.map((espacio) => (
            <div 
              key={espacio.id} 
              className={`transition-all duration-300 ${!espacio.activo ? 'grayscale-[0.5] opacity-80' : 'opacity-100'}`}
            >
              <EspacioCard 
                espacio={espacio} 
                onReservar={() => navigate('/docente/reservas/crear')} 
                userRole={userRole}
                onEdit={handleEditClick}
                onDelete={(id) => { setSelectedId(id); setShowDeleteConfirm(true); }}
                onToggleStatus={() => handleToggleStatus(espacio)}
              />
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() => { 
                setIsEditMode(false); 
                setNuevoEspacio({nombre:'', capacidad:'', tipo:'', descripcion:''}); 
                setIsModalOpen(true); 
              }}
              className="group flex flex-col items-center justify-center p-6 min-h-[300px] border-2 border-dashed border-gray-300 rounded-[2rem] hover:border-blue-500 hover:bg-blue-50 transition-all bg-white"
            >
              <div className="bg-blue-50 group-hover:bg-blue-100 p-5 rounded-full mb-4 transition-colors">
                <Plus size={40} className="text-blue-600" />
              </div>
              <span className="text-blue-600 font-bold uppercase text-[11px] tracking-[0.2em]">Registrar Nuevo Espacio</span>
              <p className="text-gray-400 text-[10px] mt-2 text-center px-6">Configura un nuevo ambiente en el sistema.</p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Espacios;