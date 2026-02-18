const nodemailer = require('nodemailer');

// 1. Configuración del transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sistemareserva.feyalegria2026@gmail.com', // Tu correo de Gmail
    pass: 'hbuk znsr vtee jabq' // Las 16 letras de Google
  }
});

// 2. Función para enviar correo de APROBACIÓN
const enviarCorreoAprobacion = async (emailDestino, nombreUsuario, nombreEspacio) => {
  const mailOptions = {
    from: '"Sistema de Reservas" <tu_correo@gmail.com>',
    to: emailDestino,
    subject: '¡Tu reserva ha sido APROBADA! ✅',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola, ${nombreUsuario}</h2>
        <p>Te informamos que tu solicitud para el espacio <strong>${nombreEspacio}</strong> ha sido <strong>aprobada</strong> con éxito.</p>
        <p>Ya puedes hacer uso del espacio en el horario solicitado.</p>
        <br>
        <p>Saludos,<br>Administración del Colegio</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// 3. Función para enviar correo de RECHAZO
const enviarCorreoRechazo = async (emailDestino, nombreUsuario, nombreEspacio, motivo) => {
  const mailOptions = {
    from: '"Sistema de Reservas" <tu_correo@gmail.com>',
    to: emailDestino,
    subject: 'Actualización de tu reserva: Rechazada ❌',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola, ${nombreUsuario}</h2>
        <p>Lamentamos informarte que tu solicitud para el espacio <strong>${nombreEspacio}</strong> ha sido <strong>rechazada</strong>.</p>
        <p><strong>Motivo:</strong> ${motivo || 'No especificado'}</p>
        <p>Si tienes dudas, por favor contacta con la administración.</p>
        <br>
        <p>Saludos,<br>Administración del Colegio</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Función para notificar cambios en una reserva
const enviarCorreoModificacion = async (email, nombre, reserva) => {
    // Formatear la fecha para que sea legible
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Formatear horas (quitando los segundos si vienen de la base de datos)
    const formatoHora = (fecha) => new Date(fecha).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });

    const mailOptions = {
        from: `"Sistema de Reservas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `⚠️ Modificación en tu reserva: ${reserva.titulo}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 20px;">Reserva Actualizada</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
                    <p style="line-height: 1.6;">Te informamos que un administrador ha realizado cambios en los detalles de tu solicitud de reserva. A continuación los datos actualizados:</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Evento:</strong> ${reserva.titulo}</p>
                        <p style="margin: 5px 0;"><strong>Espacio:</strong> ${reserva.espacio.nombre}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${fechaFormateada}</p>
                        <p style="margin: 5px 0;"><strong>Horario:</strong> ${formatoHora(reserva.hora_inicio)} - ${formatoHora(reserva.hora_fin)}</p>
                    </div>

                    <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                        Si este cambio interfiere con tus actividades, por favor ponte en contacto con la administración.
                    </p>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
                    Este es un mensaje automático, por favor no respondas a este correo.
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};


// Esto es para que veas en la terminal si la conexión es exitosa
transporter.verify((error, success) => {
    if (error) {
        console.error('Error en la configuración del correo:', error);
    } else {
        console.log('✅ Servidor de correos listo para enviar mensajes');
    }
});

module.exports = transporter;


// 4. EXPORTAR LAS FUNCIONES 
module.exports = {
  transporter,
  enviarCorreoAprobacion,
  enviarCorreoRechazo,
  enviarCorreoModificacion
  
};