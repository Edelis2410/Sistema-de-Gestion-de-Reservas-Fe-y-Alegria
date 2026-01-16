import React, { useState } from 'react';
import { 
  HelpCircle, Mail, Phone, MessageSquare, 
  ChevronDown, ChevronUp, CheckCircle, 
  AlertCircle, Send, ExternalLink, BookOpen, 
  Video, FileText, Calendar, Clock, Users
} from 'lucide-react';

const Help = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    tipo: 'tecnico'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQs organizadas por categorías
  const faqs = {
    reservas: [
      {
        id: 1,
        pregunta: '¿Cómo puedo hacer una reserva de un espacio?',
        respuesta: 'Para hacer una reserva, sigue estos pasos:\n1. Ve a la sección "Reservas" → "Crear Reserva"\n2. Selecciona el espacio que deseas reservar\n3. Elige la fecha y hora de inicio y fin\n4. Revisa la disponibilidad en tiempo real\n5. Completa los detalles adicionales requeridos\n6. Confirma tu reserva',
        pasos: 6
      },
      {
        id: 2,
        pregunta: '¿Con cuánta anticipación puedo hacer una reserva?',
        respuesta: 'Puedes hacer reservas con hasta 30 días de anticipación. Las reservas del día actual deben realizarse al menos con 1 hora de anticipación.'
      },
      {
        id: 3,
        pregunta: '¿Cuánto tiempo puede durar mi reserva?',
        respuesta: 'Las reservas pueden durar desde 1 hora hasta un máximo de 4 horas continuas por día. Para periodos más largos, contacta a la administración.'
      }
    ],
    cancelaciones: [
      {
        id: 4,
        pregunta: '¿Cómo cancelo una reserva existente?',
        respuesta: 'Para cancelar una reserva:\n1. Ve a "Reservas" → "Historial"\n2. Encuentra la reserva que deseas cancelar\n3. Haz clic en "Cancelar Reserva"\n4. Confirma la cancelación\n\nRecibirás una confirmación por correo electrónico.',
        pasos: 4
      },
      {
        id: 5,
        pregunta: '¿Hasta cuándo puedo cancelar una reserva sin penalización?',
        respuesta: 'Puedes cancelar hasta 24 horas antes de la hora de inicio de tu reserva sin ninguna penalización. Las cancelaciones con menos de 24 horas podrían afectar tu límite de reservas semanales.'
      }
    ],
    disponibilidad: [
      {
        id: 6,
        pregunta: '¿Cómo puedo ver la disponibilidad de los espacios?',
        respuesta: 'Hay varias formas:\n\n1. **En la página principal**: Verás un calendario con las reservas del día\n2. **En la sección "Espacios"**: Cada espacio muestra su disponibilidad actual\n3. **Al crear una reserva**: El sistema te muestra automáticamente los horarios disponibles\n4. **Calendario general**: Puedes ver todas las reservas en el calendario del sistema',
        pasos: 4
      },
      {
        id: 7,
        pregunta: '¿Cómo sé si un espacio está disponible en tiempo real?',
        respuesta: 'El sistema muestra la disponibilidad en tiempo real. Cuando seleccionas una fecha y hora, verás:\n✅ Verde: Espacio disponible\n🟡 Amarillo: Reserva pendiente de confirmación\n🔴 Rojo: Espacio ocupado\n\nLos cambios se actualizan automáticamente.'
      }
    ],
    problemas: [
      {
        id: 8,
        pregunta: '¿Qué hago si no puedo acceder a mi cuenta?',
        respuesta: 'Si tienes problemas para acceder:\n1. Verifica que estés usando el correo y contraseña correctos\n2. Intenta restablecer tu contraseña usando el enlace "¿Olvidaste tu contraseña?"\n3. Si el problema persiste, contacta al soporte técnico usando el formulario de contacto.'
      },
      {
        id: 9,
        pregunta: '¿Cómo cambio mis preferencias de notificaciones?',
        respuesta: 'Ve a "Configuración" → "Preferencias Personales" → "Tipo de notificaciones". Allí puedes activar o desactivar notificaciones por correo y push.'
      }
    ]
  };

  // Manejar cambios en el formulario de contacto
  const handleContactChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  // Enviar formulario de contacto
  const handleSubmitContact = (e) => {
    e.preventDefault();
    
    if (!contactForm.nombre || !contactForm.email || !contactForm.mensaje) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      alert('Por favor ingrese un correo electrónico válido');
      return;
    }

    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Resetear formulario
      setContactForm({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        tipo: 'tecnico'
      });

      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  // Función para alternar FAQ
  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  // Información de contacto de soporte
  const supportContacts = [
    {
      tipo: 'Soporte Técnico',
      descripcion: 'Problemas con el sistema, errores técnicos, acceso',
      email: 'soporte@feialegria.edu',
      telefono: '+51 1 123 4567',
      horario: 'Lun-Vie: 8:00 AM - 6:00 PM',
      icon: AlertCircle,
      color: 'bg-red-50 border-red-100',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      tipo: 'Administración',
      descripcion: 'Consultas sobre reservas, políticas, permisos especiales',
      email: 'admin.reservas@feialegria.edu',
      telefono: '+51 1 123 4568',
      horario: 'Lun-Vie: 8:00 AM - 4:00 PM',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-100',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      tipo: 'Coordinación Académica',
      descripcion: 'Uso de espacios para actividades académicas',
      email: 'coordinacion@feialegria.edu',
      telefono: '+51 1 123 4569',
      horario: 'Lun-Vie: 8:00 AM - 3:00 PM',
      icon: Mail,
      color: 'bg-blue-50 border-blue-100',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  // Recursos adicionales como links
  const recursos = [
    {
      icon: BookOpen,
      label: 'Manual del usuario',
      href: '#',
      desc: 'Guía completa del sistema en PDF'
    },
    {
      icon: Video,
      label: 'Video tutoriales',
      href: '#',
      desc: 'Aprende paso a paso con videos'
    },
    {
      icon: FileText,
      label: 'Políticas de uso',
      href: '#',
      desc: 'Normativas de espacios disponibles'
    },
    {
      icon: Calendar,
      label: 'Calendario académico',
      href: '#',
      desc: 'Fechas importantes del año'
    },
    {
      icon: Clock,
      label: 'Horarios de atención',
      href: '#',
      desc: 'Disponibilidad de los departamentos'
    },
    {
      icon: Users,
      label: 'Directorio de contactos',
      href: '#',
      desc: 'Personas clave para consultas'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-slate-900">Centro de ayuda</h1>
            <p className="mt-2 text-sm text-slate-600">
              Encuentra respuestas rápidas y contacta con nuestro equipo de soporte
            </p>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {submitted && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">¡Mensaje enviado exitosamente!</p>
                <p className="text-sm text-green-700 mt-1">
                  Nos pondremos en contacto contigo en un plazo de 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sección izquierda: FAQs y Recursos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preguntas Frecuentes */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Preguntas frecuentes</h2>
                    <p className="text-sm text-slate-500">Respuestas a las consultas más comunes</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-8">
                  {Object.entries(faqs).map(([categoria, items]) => (
                    <div key={categoria} className="space-y-4">
                      <h3 className="text-base font-medium text-slate-900 capitalize border-b border-slate-100 pb-2">
                        {categoria === 'reservas' && 'Reservas de espacios'}
                        {categoria === 'cancelaciones' && 'Cancelaciones'}
                        {categoria === 'disponibilidad' && 'Disponibilidad'}
                        {categoria === 'problemas' && 'Problemas técnicos'}
                      </h3>
                      <div className="space-y-3">
                        {items.map((faq) => (
                          <div key={faq.id} className="overflow-hidden rounded-lg border border-slate-200">
                            <button
                              onClick={() => toggleFAQ(faq.id)}
                              className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors duration-150"
                            >
                              <span className="text-sm font-medium text-slate-900 pr-4">
                                {faq.pregunta}
                              </span>
                              {activeFAQ === faq.id ? (
                                <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                              )}
                            </button>
                            {activeFAQ === faq.id && (
                              <div className="border-t border-slate-100 p-4">
                                <div className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                                  {faq.respuesta}
                                  {faq.pasos && (
                                    <div className="mt-4">
                                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span>{faq.pasos} pasos</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recursos adicionales como links */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recursos adicionales</h2>
                    <p className="text-sm text-slate-500">Enlaces útiles y documentos de referencia</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recursos.map((recurso, index) => (
                    <a
                      key={index}
                      href={recurso.href}
                      className="group rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                          <recurso.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                              {recurso.label}
                            </span>
                            <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            {recurso.desc}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha: Contacto */}
          <div className="space-y-6">
            {/* Información de Contacto */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Contactar soporte</h2>
                    <p className="text-sm text-slate-500">Equipos disponibles para ayudarte</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {supportContacts.map((contact, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border ${contact.color} p-4`}
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <div className={`rounded-lg ${contact.bgColor} p-2`}>
                          <contact.icon className={`h-4 w-4 ${contact.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-slate-900">{contact.tipo}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{contact.descripcion}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-slate-700 hover:text-blue-600 hover:underline transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span className="text-slate-700">{contact.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{contact.horario}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Formulario de Contacto */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Send className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Enviar consulta</h2>
                    <p className="text-sm text-slate-500">Nos pondremos en contacto contigo</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitContact} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={contactForm.nombre}
                      onChange={(e) => handleContactChange('nombre', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Ingrese su nombre"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Tipo de consulta
                    </label>
                    <select
                      value={contactForm.tipo}
                      onChange={(e) => handleContactChange('tipo', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none bg-white"
                    >
                      <option value="tecnico">Problema técnico</option>
                      <option value="reserva">Consulta sobre reservas</option>
                      <option value="administrativo">Asunto administrativo</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Asunto (opcional)
                    </label>
                    <input
                      type="text"
                      value={contactForm.asunto}
                      onChange={(e) => handleContactChange('asunto', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Breve descripción del asunto"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Mensaje *
                    </label>
                    <textarea
                      value={contactForm.mensaje}
                      onChange={(e) => handleContactChange('mensaje', e.target.value)}
                      rows="4"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                      placeholder="Describa su consulta o problema en detalle..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar consulta
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;