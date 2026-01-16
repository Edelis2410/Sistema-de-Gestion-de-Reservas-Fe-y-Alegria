import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Church, Users as UsersIcon, BookOpen } from 'lucide-react';
import EspaciosList from '../common/Espacios/EspaciosList';

const Espacios = ({ user, isSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const espacios = [
    { 
      nombre: 'CERPA', 
      capacidad: 200, 
      tipo: 'Auditorio Principal', 
      disponible: true,
      descripcion: 'Espacio ideal para conferencias, presentaciones y eventos académicos grandes.',
      icon: <Building className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Sacramento', 
      capacidad: 150, 
      tipo: 'Salón de Eventos', 
      disponible: true,
      descripcion: 'Perfecto para talleres, reuniones y actividades culturales.',
      icon: <BookOpen className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Salón Múltiple', 
      capacidad: 300, 
      tipo: 'Espacio Polivalente', 
      disponible: true,
      descripcion: 'El espacio más grande, diseñado para eventos institucionales y celebraciones.',
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />
    },
    { 
      nombre: 'Capilla', 
      capacidad: 100, 
      tipo: 'Espacio Espiritual', 
      disponible: true,
      descripcion: 'Ambiente tranquilo para reflexión, oración y actividades espirituales.',
      icon: <Church className="h-5 w-5 text-blue-500" />
    },
  ];

  const handleReservar = (espacioNombre) => {
    localStorage.setItem('selectedSpace', espacioNombre);
    navigate('/docente/reservas/crear');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Espacios Disponibles</h1>
      <p className="text-gray-600">Explora y conoce los espacios que puedes reservar en el Colegio Fe y Alegría</p>
      
      <EspaciosList
        espacios={espacios}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        userRole="teacher"
        onReservar={handleReservar}
        emptyStateTitle="No se encontraron espacios"
        emptyStateDescription="Intenta con otros términos de búsqueda"
      />
    </div>
  );
};

export default Espacios;