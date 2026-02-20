import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Shield, CheckCircle, XCircle, RefreshCw, 
  Pencil, Trash2, X, Save, AlertTriangle 
} from 'lucide-react';

// Componente SuccessModal interno (igual al de HistorialReservas)
const SuccessModal = ({ isOpen, onClose, mensaje }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 text-center">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Completado!</h3>
        <p className="text-gray-600 mb-6">{mensaje}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

const ListarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para Modales
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  // Estado para modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const obtenerUsuarios = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setUsuarios(data.data);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarEliminacion = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/usuarios/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserToDelete(null);
      obtenerUsuarios();
    } catch (err) {
      alert('Error al desactivar usuario');
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/usuarios/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(editingUser)
      });
      if (response.ok) {
        setEditingUser(null);
        await obtenerUsuarios(); // Actualizar la lista
        // Mostrar modal de éxito
        setSuccessMessage('Usuario editado correctamente');
        setShowSuccessModal(true);
      } else {
        alert('Error al actualizar');
      }
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  useEffect(() => { obtenerUsuarios(); }, []);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administrar Usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">Gestiona los usuarios del sistema</p>
        </div>
        <button 
          onClick={obtenerUsuarios} 
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Actualizar lista"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Usuario</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Rol</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-center text-slate-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{u.nombre}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.rol === 'administrador' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setEditingUser({...u, rol_id: u.rol === 'administrador' ? 2 : 1})}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Editar usuario"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setUserToDelete(u)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Desactivar usuario"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={guardarEdicion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingUser.nombre} onChange={e => setEditingUser({...editingUser, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingUser.rol_id} onChange={e => setEditingUser({...editingUser, rol_id: e.target.value})}>
                  <option value={1}>Docente</option>
                  <option value={2}>Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="edit-activo" checked={editingUser.activo} onChange={e => setEditingUser({...editingUser, activo: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="edit-activo" className="text-sm text-gray-700">Usuario habilitado</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <Save className="w-5 h-5" /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR (CONFIRMACIÓN) */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Estás seguro?</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Vas a desactivar a <b>{userToDelete.nombre}</b>. El usuario ya no podrá iniciar sesión, pero sus registros históricos se mantendrán.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setUserToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ÉXITO PARA EDICIÓN */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        mensaje={successMessage}
      />
    </div>
  );
};

export default ListarUsuarios;