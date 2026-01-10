import React, { useState, useMemo } from 'react';
import { Search, Users, Calendar, Clock, MapPin, Filter, ChevronRight, Library, BookOpen, Cross, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// Importar imágenes para los espacios
import cerpaImage from '../assets/images/cerpa.png';
import sacramentoImage from '../assets/images/sacramento.png';
import salonMultipleImage from '../assets/images/salon-multiple.png';
import capillaImage from '../assets/images/capilla.png';
import heroBackgroundImage from '../assets/images/min.png';

const Espacios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const navigate = useNavigate(); // Inicializar useNavigate

  // Función para manejar el clic en el botón de reservar
  const handleReservarClick = (espacioNombre) => {
    // Guardar en localStorage o estado global el espacio seleccionado
    localStorage.setItem('selectedSpace', espacioNombre);
    
    // Redirigir al login
    navigate('/login');
  };

  // Definir espacios en orden alfabético por nombre, igual que en el Home
  const espacios = useMemo(() => [
    {
      id: 4,
      nombre: 'Capilla',
      tipo: 'Espacio Espiritual',
      capacidad: '100 personas',
      descripcion: 'Ambiente tranquilo para reflexión, oración y actividades espirituales.',
      disponible: true,
      horario: 'Todos los días, 6:00 AM - 8:00 PM',
      categoria: 'espiritual',
      image: capillaImage,
      icon: <Cross className="w-6 h-6 text-white" />
    },
    {
      id: 1,
      nombre: 'CERPA',
      tipo: 'Auditorio Principal',
      capacidad: '200 personas',
      descripcion: 'Espacio ideal para conferencias, presentaciones y eventos académicos grandes.',
      disponible: true,
      horario: 'Lunes a Viernes, 7:00 AM - 9:00 PM',
      categoria: 'academico',
      image: cerpaImage,
      icon: <Library className="w-6 h-6 text-white" />
    },
    {
      id: 2,
      nombre: 'Sacramento',
      tipo: 'Salón de Eventos',
      capacidad: '150 personas',
      descripcion: 'Perfecto para talleres, reuniones y actividades culturales.',
      disponible: true,
      horario: 'Lunes a Sábado, 8:00 AM - 8:00 PM',
      categoria: 'cultural',
      image: sacramentoImage,
      icon: <BookOpen className="w-6 h-6 text-white" />
    },
    {
      id: 3,
      nombre: 'Salón Múltiple',
      tipo: 'Espacio Polivalente',
      capacidad: '300 personas',
      descripcion: 'El espacio más grande, diseñado para eventos institucionales y celebraciones.',
      disponible: true,
      horario: 'Martes a Domingo, 9:00 AM - 10:00 PM',
      categoria: 'eventos',
      image: salonMultipleImage,
      icon: <Users className="w-6 h-6 text-white" />
    }
  ].sort((a, b) => a.nombre.localeCompare(b.nombre)), []);

  const categorias = [
    { id: 'todos', nombre: 'Todos los espacios' },
    { id: 'academico', nombre: 'Académicos' },
    { id: 'cultural', nombre: 'Culturales' },
    { id: 'eventos', nombre: 'Eventos' },
    { id: 'espiritual', nombre: 'Espirituales' }
  ];

  const espaciosFiltrados = useMemo(() => espacios.filter(espacio => {
    const coincideBusqueda = espacio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            espacio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = selectedCategory === 'todos' || espacio.categoria === selectedCategory;
    return coincideBusqueda && coincideCategoria;
  }), [espacios, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con imagen de fondo */}
      <div 
        className="text-white py-16 relative"
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay para mejor legibilidad */}
        <div className="absolute inset-0 bg-primary-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Espacios Educativos</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Descubre y reserva los espacios disponibles en el Colegio Fe y Alegría
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Barra de búsqueda y filtros */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar espacios por nombre o descripción..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-gray-600">
            Mostrando {espaciosFiltrados.length} de {espacios.length} espacios
          </div>
        </div>

        {/* Grid de espacios - MÁS GRUESAS COMO EN GUÍA DE RESERVAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {espaciosFiltrados.map((espacio) => (
            <div
              key={espacio.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Cards con IMAGEN DE FONDO - MÁS ALTA */}
              <div 
                className="h-48 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${espacio.image})` }}
              >
                {/* Overlay oscuro para mejor legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                
                {/* Overlay adicional en hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                
                {/* Icono en círculo - MÁS GRANDE */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {espacio.icon}
                </div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-xl font-bold text-white">{espacio.nombre}</h3>
                  <p className="text-white/90 text-sm">{espacio.tipo}</p>
                </div>
              </div>
              
              {/* Información del espacio - MÁS GRUESA (p-6 como en Guía) */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Capacidad</p>
                    <p className="text-base font-semibold text-gray-900">{espacio.capacidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
                      Disponible
                    </span>
                  </div>
                </div>
                
                {/* Botón modificado para redirigir al login */}
                <button 
                  onClick={() => handleReservarClick(espacio.nombre)}
                  className="group w-full text-center py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow hover:shadow-md"
                >
                  <span className="flex items-center justify-center">
                    <span>Reservar</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {espaciosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron espacios</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o selecciona otra categoría</p>
          </div>
        )}

        {/* Información adicional - IGUAL QUE EN GUÍA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">¿Cómo reservar un espacio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Selecciona el espacio</h3>
              <p className="text-gray-600">Busca y elige el espacio según fecha y disponibilidad.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Completa el formulario</h3>
              <p className="text-gray-600">Ingresa los detalles de tu reserva: fecha, hora y propósito.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Espera confirmación</h3>
              <p className="text-gray-600">Recibirás una confirmación por correo en 24 horas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Espacios;