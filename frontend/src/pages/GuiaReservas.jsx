import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Mail, CheckCircle, AlertCircle, FileText, Download, Video, MessageCircle } from 'lucide-react';

const GuiaReservas = () => {
  const [activeSection, setActiveSection] = useState('introduccion');

  // Ruta del archivo dentro de la carpeta public
  const PDF_URL = '/docs/manual-usuario.pdf'; 

  const handleDownload = () => {
    // Esta función fuerza la descarga en caso de usar botones
    const link = document.createElement('a');
    link.href = PDF_URL;
    link.download = 'Manual_Usuario_Reservas_Fe_y_Alegria.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sections = [
    { id: 'introduccion', title: 'Introducción', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'requisitos', title: 'Requisitos', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'proceso', title: 'Proceso de Reserva', icon: <Calendar className="w-5 h-5" /> },
    { id: 'politicas', title: 'Políticas de Uso', icon: <FileText className="w-5 h-5" /> },
    { id: 'preguntas', title: 'Preguntas Frecuentes', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'contacto', title: 'Contacto y Soporte', icon: <Mail className="w-5 h-5" /> }
  ];

  const faqs = [
    {
      pregunta: "¿Quién puede reservar espacios en el sistema?",
      respuesta: "Todos los docentes activos del Colegio Fe y Alegría pueden reservar espacios. Los administradores tienen acceso completo para gestionar todas las reservas."
    },
    {
      pregunta: "¿Con cuánta anticipación debo hacer mi reserva?",
      respuesta: "Se recomienda hacer reservas con al menos 48 horas de anticipación. Para eventos especiales, se sugiere una semana de anticipación."
    },
    {
      pregunta: "¿Puedo modificar o cancelar una reserva?",
      respuesta: "Sí, puedes modificar o cancelar tus reservas hasta 24 horas antes del evento. Después de ese tiempo, debes contactar a la administración."
    },
    {
      pregunta: "¿Qué sucede si hay un conflicto de horarios?",
      respuesta: "El sistema previene automáticamente conflictos de horarios. Si ocurre un conflicto, se notificará a los usuarios involucrados para su resolución."
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'introduccion':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido al Sistema de Reservas</h2>
            <p className="text-gray-600 text-lg">
              Este sistema está diseñado para facilitar la gestión y administración de los espacios educativos 
              en el Colegio Fe y Alegría, Puerto Ordaz.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Importante</h3>
                  <p className="text-primary-700">
                    Para garantizar el uso óptimo de los espacios, todas las reservas deben seguir el proceso 
                    establecido y respetar las políticas de uso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requisitos':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Requisitos para Reservar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Ser docente activo del Colegio Fe y Alegría",
                "Tener una cuenta registrada en el sistema",
                "Contar con correo electrónico institucional",
                "Especificar el propósito de la reserva",
                "Respetar los horarios establecidos",
                "Notificar cambios con anticipación"
              ].map((requisito, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{requisito}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'proceso':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Proceso de Reserva Paso a Paso</h2>
            <div className="space-y-8">
              {[
                {
                  paso: 1,
                  titulo: "Inicia sesión en el sistema",
                  descripcion: "Accede con tus credenciales de docente. Si no tienes cuenta, solicítala a administración."
                },
                {
                  paso: 2,
                  titulo: "Busca disponibilidad",
                  descripcion: "Consulta el calendario de espacios disponibles según la fecha y hora que necesites."
                },
                {
                  paso: 3,
                  titulo: "Selecciona el espacio",
                  descripcion: "Elige entre los espacios disponibles: CERPA, Sacramento, Salón Múltiple, Capilla, etc."
                },
                {
                  paso: 4,
                  titulo: "Completa el formulario",
                  descripcion: "Ingresa los detalles de tu evento: fecha, nombre del actividad, horario, espacio."
                },
                {
                  paso: 5,
                  titulo: "Envía la solicitud",
                  descripcion: "Revisa la información y envía tu solicitud. Recibirás un correo de confirmación."
                },
                {
                  paso: 6,
                  titulo: "Espera aprobación",
                  descripcion: "La administración revisará y aprobará tu solicitud en un plazo máximo de 24 horas."
                }
              ].map((paso) => (
                <div key={paso.paso} className="flex">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {paso.paso}
                    </div>
                    {paso.paso < 6 && <div className="flex-1 w-0.5 bg-gray-300 my-2"></div>}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold mb-2">{paso.titulo}</h3>
                    <p className="text-gray-600">{paso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'politicas':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Políticas de Uso de Espacios</h2>
            
            {/* Normas Institucionales */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">Normas Institucionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    titulo: "Uso adecuado de los espacios",
                    desc: "Los espacios deben utilizarse únicamente para fines académicos, culturales o administrativos especificados en la reserva."
                  },
                  {
                    titulo: "Responsabilidad por daños",
                    desc: "El solicitante es responsable de cualquier daño ocasionado al espacio o equipo durante su uso."
                  },
                  {
                    titulo: "Limpieza y orden",
                    desc: "Al finalizar, el espacio debe quedar en las mismas condiciones en que fue encontrado."
                  },
                  {
                    titulo: "Cancelaciones",
                    desc: "Las cancelaciones deben notificarse con al menos 24 horas de anticipación para liberar el espacio."
                  },
                  {
                    titulo: "Uso fuera del horario",
                    desc: "El uso fuera del horario establecido (7:00 a.m. – 5:00 p.m.) requiere autorización especial de administración."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-white rounded-xl border border-gray-200">
                    <div className="mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.titulo}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buenas Prácticas para el Uso Compartido */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">Buenas Prácticas para el Uso Compartido</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    titulo: "Planificación con antelación",
                    desc: "Realiza tus reservas con la mayor anticipación posible (hasta 15 días) para evitar conflictos de última hora."
                  },
                  {
                    titulo: "Uso necesario",
                    desc: "Reserva únicamente los espacios que realmente necesites y por el tiempo estrictamente requerido. Evita reservar 'por si acaso'."
                  },
                  {
                    titulo: "Cancelación oportuna",
                    desc: "Si no podrás utilizar un espacio, cancela la reserva lo antes posible para que otro docente pueda aprovecharlo."
                  },
                  {
                    titulo: "Rotación de espacios",
                    desc: "Procura no acaparar un mismo espacio de forma consecutiva si hay otros usuarios que también lo necesitan."
                  },
                  {
                    titulo: "Respeto por las reservas confirmadas",
                    desc: "Una vez que el administrador confirma una reserva, el espacio queda asignado oficialmente. No realices cambios sin autorización."
                  },
                  {
                    titulo: "Comunicación con el administrador",
                    desc: "Si tienes necesidades especiales (proyectos de varios días, eventos institucionales), comunícate con el administrador para evaluar tu caso."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="mr-4 mt-1">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.titulo}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 italic">
                El incumplimiento reiterado de estas normas podría conllevar a la restricción temporal del privilegio de reservar, a criterio del administrador.
              </p>
            </div>
          </div>
        );

      case 'preguntas':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-start">
                    <span className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      ?
                    </span>
                    {faq.pregunta}
                  </h3>
                  <p className="text-gray-600 ml-11">{faq.respuesta}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contacto':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Contacto y Soporte Técnico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <Mail className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Soporte por Correo</h3>
                  <p className="text-gray-600 mb-4">Para asistencia técnica o consultas sobre el sistema:</p>
                  <a href="mailto:soporte@feyalegria.edu.ve" className="text-primary-600 font-semibold hover:underline">
                    soporte@feyalegria.edu.ve
                  </a>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <Clock className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Horario de Atención</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>Lunes a Viernes: 7:00 AM - 5:00 PM</li>
                    <li>Sábados: 8:00 AM - 12:00 PM</li>
                    <li>Domingos: Cerrado</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-primary-50 border border-primary-200 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-primary-800">¿Necesitas ayuda inmediata?</h3>
                  <p className="text-primary-700 mb-4">
                    Para emergencias o problemas urgentes con reservas en curso:
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">Teléfono: (0286) 123-4567</p>
                    <p className="text-sm text-gray-600">Extensión: 123 (Administración)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Guía de Reservas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mt-4">
            Todo lo que necesitas saber para utilizar el sistema de gestión de espacios educativos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className={`${activeSection === section.id ? 'text-white' : 'text-primary-600'}`}>
                      {section.icon}
                    </span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
                <Download className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Descarga el Manual</h3>
                <p className="text-sm text-gray-600 mb-4">Guía completa en formato PDF</p>
                <button onClick={handleDownload} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors">
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {renderSectionContent()}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <Clock className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Tiempo de Respuesta</h3>
                <p className="text-gray-600">Reservas: 24 horas</p>
                <p className="text-gray-600">Soporte: 48 horas</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Reservas Activas</h3>
                <p className="text-gray-600">Puedes realizar varias reservas, siempre que no existan conflictos de horario y cumplas las políticas de uso.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <AlertCircle className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Recordatorio</h3>
                <p className="text-gray-600">Revisa las políticas de uso antes de realizar tu reserva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiaReservas;