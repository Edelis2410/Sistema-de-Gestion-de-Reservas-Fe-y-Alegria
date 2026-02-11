import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Loader, Building, Church, 
  Users as UsersIcon, BookOpen, Plus, X, CheckCircle2,
  AlertTriangle // Importamos icono para eliminar
} from 'lucide-react';

import EspacioCard from '../../../components/common/Espacios/EspacioCard';

const Espacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo: modo edición
  const [selectedId, setSelectedId] = useState(null); // Nuevo: ID para editar/eliminar
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Nuevo: confirmación borrar
  
  const [nuevoEspacio, setNuevoEspacio] = useState({
    nombre: '', capacidad: '', tipo: '', descripcion: ''
  });

  const navigate = useNavigate();

  const rawRole = localStorage.getItem('userRole');
  const userRole = rawRole ? rawRole.toLowerCase() : '';
  const isAdmin = userRole === 'administrador' || userRole === 'admin';

  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const getIconForSpace = (nombre) => {
    const n = normalizeText(nombre);
    if (n.includes('cerpa')) return <Building className="h-5 w-5 text-blue-500" />;
    if (n.includes('capilla')) return <Church className="h-5 w-5 text-blue-500" />;
    if (n.includes('sacramento')) return <BookOpen className="h-5 w-5 text-blue-500" />;
    if (n.includes('multiple')) return <UsersIcon className="h-5 w-5 text-blue-500" />;
    return <Building className="h-5 w-5 text-blue-500" />;
  };

  const loadEspacios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/espacios');
      const result = await response.json();
      if (result.success) {
        const dataProcesada = (result.data || []).map(esp => ({
          ...esp,
          icon: getIconForSpace(esp.nombre),
          disponible: Boolean(esp.activo) 
        }));
        setEspacios(dataProcesada);
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEspacios(); }, [loadEspacios]);

  // --- LÓGICA DE GUARDAR (CREAR O EDITAR) ---
  const handleSaveSpace = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const url = isEditMode 
      ? `http://localhost:5000/api/espacios/${selectedId}` 
      : 'http://localhost:5000/api/espacios';
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...nuevoEspacio, capacidad: parseInt(nuevoEspacio.capacidad) })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessDialog(true);
        setNuevoEspacio({ nombre: '', capacidad: '', tipo: '', descripcion: '' });
        loadEspacios();
        setTimeout(() => {
          setShowSuccessDialog(false);
          setIsModalOpen(false);
        }, 2000);
      } else {
        throw new Error(data.error || 'Error al procesar');
      }
    } catch (error) {
      alert(error.message);
    } finally { 
      setIsSaving(false); 
    }
  };

  // --- LÓGICA DE ELIMINAR ---
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/espacios/${selectedId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteConfirm(false);
        loadEspacios();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // --- FUNCIONES PARA ABRIR MODALES ---
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

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

 const filteredEspacios = espacios.filter(esp => {
    // 1. Normalizamos el término de búsqueda por texto
    const busquedaNormalizada = normalizeText(searchTerm);
    const matchesSearch = normalizeText(esp.nombre).includes(busquedaNormalizada) || 
                          normalizeText(esp.descripcion || '').includes(busquedaNormalizada);
    
    // 2. CORRECCIÓN DEL FILTRO DE CATEGORÍA:
    // Normalizamos tanto el tipo del espacio como el tipo seleccionado en el filtro
    // Esto hace que "Académicos" sea igual a "academicos"
    const matchesFilter = filterType === 'Todos' || 
                          normalizeText(esp.tipo) === normalizeText(filterType);
    
    return matchesSearch && matchesFilter;
  });

  const tiposUnicos = ['Todos', 'Académicos', 'Culturales', 'Eventos', 'Espirituales'];

  return (
    <div className="p-6">
      {/* HEADER (Buscador y Filtro) */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Espacios Disponibles</h1>
            <p className="text-gray-600">Gestión y reserva de espacios</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text" placeholder="Buscar..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
              />
            </div>
            <select
              value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white outline-none shadow-sm"
            >
              {tiposUnicos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* DIÁLOGO DE ÉXITO */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center animate-in zoom-in duration-300 max-w-sm w-full">
            <CheckCircle2 size={60} className="text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{isEditMode ? '¡Actualizado!' : '¡Creado!'}</h3>
            <p className="text-gray-500 text-center">Operación realizada con éxito.</p>
          </div>
        </div>
      )}

      {/* DIÁLOGO DE CONFIRMACIÓN ELIMINAR */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar espacio?</h3>
            <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-gray-100 rounded-xl font-bold text-gray-600">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Espacio' : 'Agregar Nuevo Espacio'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSpace} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.nombre} onChange={(e) => setNuevoEspacio({...nuevoEspacio, nombre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Capacidad</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={nuevoEspacio.capacidad} onChange={(e) => setNuevoEspacio({...nuevoEspacio, capacidad: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                  <select required className="w-full px-4 py-2 border rounded-xl outline-none bg-white" value={nuevoEspacio.tipo} onChange={(e) => setNuevoEspacio({...nuevoEspacio, tipo: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    <option value="Académicos">Académicos</option>
                    <option value="Culturales">Culturales</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Espirituales">Espirituales</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea rows="3" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={nuevoEspacio.descripcion} onChange={(e) => setNuevoEspacio({...nuevoEspacio, descripcion: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isSaving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTADO DE TARJETAS */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64"><Loader className="animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEspacios.map((espacio) => (
            <EspacioCard 
              key={espacio.id} 
              espacio={espacio} 
              onReservar={() => navigate('/docente/reservas/crear')} 
              userRole={isAdmin ? 'admin' : 'teacher'}
              onEdit={handleEditClick}   // <-- PASAMOS LA FUNCIÓN
              onDelete={handleDeleteClick} // <-- PASAMOS LA FUNCIÓN
            />
          ))}

          {isAdmin && (
            <button
              onClick={() => { setIsEditMode(false); setNuevoEspacio({nombre:'', capacidad:'', tipo:'', descripcion:''}); setIsModalOpen(true); }}
              className="group flex flex-col items-center justify-center p-6 min-h-[250px] border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all bg-white shadow-sm"
            >
              <div className="bg-blue-50 group-hover:bg-blue-100 p-4 rounded-full mb-3 transition-colors">
                <Plus size={40} className="text-blue-600" />
              </div>
              <span className="text-blue-600 font-bold uppercase text-xs tracking-widest">Añadir Espacio</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Espacios;