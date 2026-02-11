import React, { useState } from 'react';
import { 
  HelpCircle, Mail, Phone, MessageSquare, 
  ChevronDown, ChevronUp, CheckCircle, 
  AlertCircle, Clock
} from 'lucide-react';

const Help = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = {
    reservas: [
      {
        id: 1,
        pregunta: '¿Cómo puedo hacer una reserva de un espacio?',
        respuesta: 'Para hacer una reserva, sigue estos pasos:\n1. Ve a la sección "Reservas" → "Crear Reserva"\n2. Selecciona el espacio que deseas reservar\n3. Elige la fecha y hora de inicio y fin\n4. Revisa la disponibilidad en tiempo real\n5. Confirma tu reserva',
        pasos: 5
      },
      {
        id: 2,
        pregunta: '¿Con cuánta anticipación puedo hacer una reserva?',
        respuesta: 'Puedes hacer reservas con hasta 30 días de anticipación. Las reservas del día actual deben realizarse al menos con 1 hora de anticipación.'
      },
      {
        id: 3,
        pregunta: '¿Cuánto tiempo puede durar mi reserva?',
        respuesta: 'Las reservas pueden durar desde 1 hora hasta un máximo de 4 horas continuas por día.'
      }
    ],
    cancelaciones: [
      {
        id: 4,
        pregunta: '¿Cómo cancelo una reserva existente?',
        respuesta: 'Para cancelar una reserva:\n1. Ve a "Reservas" → "Historial"\n2. Encuentra la reserva que deseas cancelar\n3. Haz clic en "Cancelar Reserva"\n4. Confirma la cancelación',
        pasos: 4
      }
    ],
    problemas: [
      {
        id: 9,
        pregunta: '¿Cómo cambio mis preferencias de notificaciones?',
        respuesta: 'Ve a "Configuración" → "Preferencias Personales". Allí puedes activar o desactivar las notificaciones por correo y push mediante los interruptores.'
      }
    ]
  };

  const supportContacts = [
    {
      tipo: 'Soporte Técnico',
      descripcion: 'Problemas con el sistema o acceso',
      email: 'soporte@feialegria.edu',
      telefono: '+51 1 123 4567',
      horario: 'Lun-Vie: 8:00 AM - 4:00 PM',
      icon: AlertCircle,
      color: 'bg-red-50 border-red-100',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      tipo: 'Administración',
      descripcion: 'Consultas sobre políticas y permisos',
      email: 'sistemareserva.feyalegria2026@gmail.com',
      telefono: '+51 1 123 4568',
      horario: 'Lun-Vie: 8:00 AM - 4:00 PM',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-100',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-slate-900">Centro de ayuda</h1>
          <p className="mt-2 text-sm text-slate-600">
            Resuelve tus dudas rápidamente o contacta con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sección izquierda: FAQs */}
          <div className="lg:col-span-2">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Preguntas frecuentes</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-8">
                  {Object.entries(faqs).map(([categoria, items]) => (
                    <div key={categoria} className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                        {categoria === 'reservas' && 'Gestión de Reservas'}
                        {categoria === 'cancelaciones' && 'Cancelaciones'}
                        {categoria === 'problemas' && 'Cuenta y Soporte'}
                      </h3>
                      <div className="space-y-3">
                        {items.map((faq) => (
                          <div key={faq.id} className="rounded-lg border border-slate-200 transition-all">
                            <button
                              onClick={() => toggleFAQ(faq.id)}
                              className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
                            >
                              <span className="text-sm font-medium text-slate-700">
                                {faq.pregunta}
                              </span>
                              {activeFAQ === faq.id ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                            {activeFAQ === faq.id && (
                              <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {faq.respuesta}
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
          </div>

          {/* Sección derecha: Contacto Unificado */}
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Soporte Directo</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {supportContacts.map((contact, index) => (
                  <div key={index} className={`rounded-lg border ${contact.color} p-4`}>
                    <div className="mb-3 flex items-start gap-3">
                      <div className={`rounded-lg ${contact.bgColor} p-2 flex-shrink-0`}>
                        <contact.icon className={`h-4 w-4 ${contact.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{contact.tipo}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{contact.descripcion}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-black/5">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600">
                        <Mail className="h-3.5 w-3.5" />
                        {contact.email}
                      </a>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="h-3.5 w-3.5" />
                        {contact.telefono}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {contact.horario}
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => window.location.href = 'mailto:soporte@feialegria.edu'}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <Mail className="h-4 w-4" />
                  Escribir un correo ahora
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;