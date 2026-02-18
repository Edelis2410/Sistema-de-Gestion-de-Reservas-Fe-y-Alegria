import React, { useEffect } from 'react'; // ✅ 1. Agregar useEffect
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ 2. Agregar useLocation
import { Calendar, Clock, Shield, Bell, CheckCircle, ArrowRight, Users, BarChart3, Library, BookOpen, MapPin, Cross } from 'lucide-react';

// Importar la imagen de fondo
import fondoImage from '../assets/images/fondofinal.png';

// Importar las imágenes de los espacios
import cerpaImage from '../assets/images/biblioteca_.png';
import sacramentoImage from '../assets/images/sacramento_.png';
import salonMultipleImage from '../assets/images/salon_multiple.png';
import capillaImage from '../assets/images/capilla_.png';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 3. Obtener la ubicación actual

  // ✅ 4. Subir scroll automáticamente cada vez que se visita el Home
  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Cambia a 'smooth' si quieres animación suave
      });
    }
  }, [location.pathname]);

  const handleReservarClick = (spaceName) => {
    localStorage.setItem('selectedSpace', spaceName);
    navigate('/login');
  };

  const features = [
    { 
      icon: <Calendar />, 
      title: 'Reservación', 
      desc: 'Sistema de solicitud automatizada con validación de horarios en tiempo real.'
    },
    { 
      icon: <Clock />, 
      title: 'Gestión en Tiempo Real', 
      desc: 'Disponibilidad actualizada al instante, evitando conflictos de programación.'
    },
    { 
      icon: <Shield />, 
      title: 'Seguridad Integral', 
      desc: 'Autenticación por roles, permisos diferenciados y registro de actividades.'
    },
    { 
      icon: <Bell />, 
      title: 'Notificaciones', 
      desc: 'Recordatorios automáticos por email para docentes y administradores.'
    },
    { 
      icon: <BarChart3 />, 
      title: 'Reportes Avanzados', 
      desc: 'Estadísticas de uso y reportes exportables para planificación institucional.'
    },
    { 
      icon: <Users />, 
      title: 'Colaboración', 
      desc: 'Coordinación eficiente entre departamentos para optimizar recursos.'
    }
  ];

  const spaces = [
    { 
      name: 'CERPA', 
      type: 'Auditorio Principal', 
      capacity: '200 personas', 
      icon: <Library />,
      image: cerpaImage 
    },
    { 
      name: 'Sacramento', 
      type: 'Salón de Eventos', 
      capacity: '150 personas', 
      icon: <BookOpen />,
      image: sacramentoImage 
    },
    { 
      name: 'Salón Múltiple', 
      type: 'Espacio Polivalente', 
      capacity: '300 personas', 
      icon: <Users />,
      image: salonMultipleImage 
    },
    { 
      name: 'Capilla', 
      type: 'Espacio Espiritual', 
      capacity: '100 personas', 
      icon: <Cross />,
      image: capillaImage 
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section CON IMAGEN DE FONDO */}
      <section className="relative overflow-hidden section-padding min-h-[600px] flex items-center">
        {/* Imagen de fondo con posicionamiento ajustado */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${fondoImage})`,
              backgroundPosition: 'center 35%'
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-10 mb-4 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Gestiona tus espacios educativos
              <span className="block text-white mt-2">
                de manera eficiente
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-10 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Maximiza el uso de instalaciones para un colegio más productivo
            </p>
            
            <div className="flex justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-800 transition-all duration-300 rounded-lg"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="section-padding bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              Características Principales
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas saber
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un sistema diseñado específicamente para optimizar la gestión de espacios educativos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 rounded-full"></div>
                </div>
                
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.desc}
                </p>
                
                <div className="mt-8 pt-6 border-t border-blue-200 w-full">
                  <div className="h-1 w-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full transition-all duration-300 group-hover:w-20 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Espacios */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Espacios Disponibles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conoce los principales espacios educativos que puedes reservar en nuestra institución
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((space, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div 
                  className="h-48 relative bg-cover bg-center"
                  style={{ backgroundImage: `url(${space.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {React.cloneElement(space.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">{space.name}</h3>
                    <p className="text-white/90 text-sm">{space.type}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Capacidad</p>
                      <p className="text-lg font-semibold text-gray-900">{space.capacity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Estado</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Disponible
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleReservarClick(space.name)}
                    className="group w-full text-center py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
          
          <div className="text-center mt-12">
            <Link
              to="/espacios"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
            >
              Ver todos los espacios disponibles
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="section-padding bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para optimizar la gestión de espacios?
          </h2>
          <p className="text-lg text-gray-900 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a nuestra comunidad educativa y experimenta una gestión eficiente y organizada
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;