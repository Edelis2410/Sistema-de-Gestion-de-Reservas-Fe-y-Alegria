const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { enviarCorreoAprobacion, enviarCorreoRechazo, enviarCorreoModificacion } = require('../utils/mailer');

// --- 1. OBTENER TODAS LAS RESERVAS ---
const getAllReservas = async (req, res) => {
    try {
        const { adminView } = req.query;
        let whereCondition = {};
        
        if (req.user.rol === 'administrador' && adminView === 'true') {
            whereCondition = { usuario_id: { not: req.user.id } };
        } else {
            whereCondition = { usuario_id: req.user.id };
        }

        const reservas = await prisma.reserva.findMany({
            where: whereCondition,
            include: { 
                espacio: true, 
                usuario: { select: { nombre: true, email: true } } 
            },
            orderBy: { fecha_creacion: 'desc' }
        });
        res.json({ success: true, data: reservas });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al cargar reservas' });
    }
};

// --- 2. VERIFICAR DISPONIBILIDAD (VERSIÓN PRISMA) ---
const checkDisponibilidad = async (req, res) => {
    try {
        const { espacio_id, fecha, hora_inicio, hora_fin } = req.query;

        const inicioSolicitado = new Date(`1970-01-01T${hora_inicio}:00.000Z`);
        const finSolicitado = new Date(`1970-01-01T${hora_fin}:00.000Z`);

        const conflictos = await prisma.reserva.findMany({
            where: {
                espacio_id: parseInt(espacio_id),
                fecha: new Date(fecha),
                estado: {
                    notIn: ['cancelada', 'rechazada']
                },
                AND: [
                    { hora_inicio: { lt: finSolicitado } },
                    { hora_fin: { gt: inicioSolicitado } }
                ]
            }
        });

        res.json({ 
            success: true, 
            disponible: conflictos.length === 0, 
            message: conflictos.length > 0 ? 'Este espacio ya está ocupado en el horario seleccionado.' : 'Disponible'
        });

    } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

// --- 3. CREAR RESERVA (CON AUTO-APROBACIÓN Y REGISTRO DE QUIEN CONFIRMA) ---
const createReserva = async (req, res) => {
    try {
        const { titulo, fecha, hora_inicio, hora_fin, espacio_id } = req.body;

        // --- VALIDACIÓN DE FECHA Y HORA PASADA ---
        const ahora = new Date();
        const fechaSolicitada = new Date(fecha);
        
        // Normalizamos ambas fechas a medianoche para comparar días
        const hoyMedianoche = new Date();
        hoyMedianoche.setHours(0, 0, 0, 0);
        
        const fechaSolicitadaMedianoche = new Date(fechaSolicitada);
        fechaSolicitadaMedianoche.setHours(0, 0, 0, 0);

        // 1. Validar si el día es anterior a hoy
        if (fechaSolicitadaMedianoche < hoyMedianoche) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se pueden realizar reservas en fechas pasadas.' 
            });
        }

        // 2. Si es para hoy, validar que la hora de inicio no haya pasado ya
        if (fechaSolicitadaMedianoche.getTime() === hoyMedianoche.getTime()) {
            const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
            const horaActual = ahora.getHours();
            const minutosActuales = ahora.getMinutes();

            if (hInicio < horaActual || (hInicio === horaActual && mInicio < minutosActuales)) {
                return res.status(400).json({
                    success: false,
                    error: 'La hora de inicio seleccionada ya ha pasado.'
                });
            }
        }
        // ------------------------------------------

        // Normalización de rol para validación
        const rolUsuario = req.user.rol ? req.user.rol.toLowerCase().trim() : '';
        const esAdmin = (rolUsuario === 'administrador' || rolUsuario === 'admin');
        const estadoFinal = esAdmin ? 'confirmada' : 'pendiente';

        // Validación de horario escolar (7 AM - 5 PM)
        const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
        const [hFin, mFin] = hora_fin.split(':').map(Number);
        const esHoraInvalida = hInicio < 7 || hFin > 17 || (hFin === 17 && mFin > 0);

        if (esHoraInvalida) {
            return res.status(400).json({ 
                success: false, 
                error: 'El horario permitido es de 7:00 AM a 5:00 PM.' 
            });
        }

        const nuevaReserva = await prisma.reserva.create({
            data: {
                titulo,
                fecha: new Date(fecha),
                hora_inicio: new Date(`1970-01-01T${hora_inicio}:00.000Z`),
                hora_fin: new Date(`1970-01-01T${hora_fin}:00.000Z`),
                usuario_id: req.user.id,
                espacio_id: parseInt(espacio_id),
                estado: estadoFinal,
                creado_por_admin: esAdmin,
                confirmado_por: esAdmin ? req.user.id : null 
            }
        });

        res.json({ success: true, data: nuevaReserva });
    } catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ success: false, error: 'Error al crear reserva' });
    }
};

// --- 4. ACTUALIZAR / GESTIONAR RESERVA ---
const updateReserva = async (req, res) => {
    const { id } = req.params;
    const { estado, motivo_rechazo, titulo, fecha, hora_inicio, hora_fin, espacio_id } = req.body;
    
    try {
        // 0. OBTENER DATOS ACTUALES (Para comparar y validar disponibilidad)
        const reservaPrevia = await prisma.reserva.findUnique({ 
            where: { id: parseInt(id) },
            include: { espacio: true, usuario: true }
        });

        if (!reservaPrevia) {
            return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
        }

        // ---VALIDACIÓN: BLOQUEAR CAMBIOS AL PASADO ---
        if (fecha || hora_inicio) {
          const ahora = new Date();
          const fechaEvaluar = fecha ? new Date(fecha) : reservaPrevia.fecha;

          const hoyMedianoche = new Date();
          hoyMedianoche.setHours(0, 0, 0, 0);
    
          const fechaEvaluarMedianoche = new Date(fechaEvaluar);
          fechaEvaluarMedianoche.setHours(0, 0, 0, 0);

          if (fechaEvaluarMedianoche < hoyMedianoche) {
            return res.status(400).json({ 
            success: false, 
            error: 'No se puede mover una reserva a una fecha pasada.' 
           });
        }

       if (fechaEvaluarMedianoche.getTime() === hoyMedianoche.getTime()) {
         let hInicio, mInicio;
        
         // Si el admin mandó una nueva hora, usamos esa
         if (hora_inicio) {
            [hInicio, mInicio] = hora_inicio.split(':').map(Number);
         } else {
            // Si no mandó hora, usamos la que ya tenía la reserva (es objeto Date)
            hInicio = reservaPrevia.hora_inicio.getUTCHours();
            mInicio = reservaPrevia.hora_inicio.getUTCMinutes();
        }

        if (hInicio < ahora.getHours() || (hInicio === ahora.getHours() && mInicio < ahora.getMinutes())) {
            return res.status(400).json({
                success: false,
                error: 'No puedes programar una reserva para una hora que ya pasó.'
            });
        } }
    }

        // 1. VALIDACIÓN DE DISPONIBILIDAD
        if (fecha || hora_inicio || hora_fin || espacio_id) {
            const fechaVal = fecha ? new Date(fecha) : reservaPrevia.fecha;
            const inicioVal = hora_inicio ? new Date(`1970-01-01T${hora_inicio}:00.000Z`) : reservaPrevia.hora_inicio;
            const finVal = hora_fin ? new Date(`1970-01-01T${hora_fin}:00.000Z`) : reservaPrevia.hora_fin;
            const espacioVal = espacio_id ? parseInt(espacio_id) : reservaPrevia.espacio_id;

            const conflictos = await prisma.reserva.findMany({
                where: {
                    id: { not: parseInt(id) },
                    espacio_id: espacioVal,
                    fecha: fechaVal,
                    estado: { notIn: ['cancelada', 'rechazada'] },
                    AND: [
                        { hora_inicio: { lt: finVal } },
                        { hora_fin: { gt: inicioVal } }
                    ]
                }
            });

            if (conflictos.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El espacio ya está ocupado en el horario seleccionado por otra reserva.' 
                });
            }
        }

        // 2. PROCEDER CON LA ACTUALIZACIÓN
        const reservaActualizada = await prisma.reserva.update({
            where: { id: parseInt(id) },
            data: { 
                titulo: titulo || undefined,
                fecha: fecha ? new Date(fecha) : undefined,
                hora_inicio: hora_inicio ? new Date(`1970-01-01T${hora_inicio}:00.000Z`) : undefined,
                hora_fin: hora_fin ? new Date(`1970-01-01T${hora_fin}:00.000Z`) : undefined,
                espacio_id: espacio_id ? parseInt(espacio_id) : undefined,
                estado: estado || undefined, 
                motivo_rechazo: estado === 'rechazada' ? motivo_rechazo : (estado === 'confirmada' ? null : undefined),
                confirmado_por: req.user.id 
            },
            include: { 
                espacio: true,
                usuario: true 
            }
        });

        // 3. LÓGICA DE NOTIFICACIONES (ESTADOS: Aprobación/Rechazo)
    
        const user = reservaActualizada.usuario;
        const huboCambiosEnDatos = titulo || fecha || hora_inicio || hora_fin || espacio_id;

        // 1. GESTIÓN DE EMAILS (Solo si el switch de Email está ON)
        if (user?.email && user.notificacionesEmail) {
            try {
                if (estado === 'confirmada') {
                    await enviarCorreoAprobacion(user.email, user.nombre, reservaActualizada.espacio.nombre);
                } else if (estado === 'rechazada') {
                    await enviarCorreoRechazo(user.email, user.nombre, reservaActualizada.espacio.nombre, motivo_rechazo);
                } else if (huboCambiosEnDatos) {
                    await enviarCorreoModificacion(user.email, user.nombre, reservaActualizada);
                }
            } catch (err) { console.error("Error al enviar email:", err); }
        }

        // 2. GESTIÓN DE CAMPANITA (Solo si el switch de Push está ON)
        if (user?.notificacionesPush) {
            try {
                let msgTitulo = '';
                let msgTexto = '';
                let msgTipo = 'info';

                if (estado === 'confirmada') {
                    msgTitulo = '¡Reserva Confirmada!';
                    msgTexto = `Tu solicitud para "${reservaActualizada.espacio.nombre}" ha sido aceptada.`;
                    msgTipo = 'success';
                } else if (estado === 'rechazada') {
                    msgTitulo = 'Reserva Rechazada';
                    msgTexto = `Tu solicitud para "${reservaActualizada.espacio.nombre}" fue rechazada.`;
                    msgTipo = 'error';
                } else if (huboCambiosEnDatos) {
                    msgTitulo = 'Reserva Modificada';
                    msgTexto = `Un administrador cambió detalles en: "${reservaActualizada.titulo}".`;
                    msgTipo = 'info';
                }

                if (msgTitulo) {
                    await prisma.notificacion.create({
                        data: {
                            usuario_id: reservaActualizada.usuario_id,
                            tipo: msgTipo,
                            titulo: msgTitulo,
                            mensaje: msgTexto,
                            leido: false,
                            fecha_envio: new Date()
                        }
                    });
                }
            } catch (err) { console.error("Error al crear notificación en DB:", err); }
        }

        res.json({ success: true, data: reservaActualizada });
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        res.status(500).json({ success: false, error: 'Error al procesar la actualización' });
    }
};

// --- 5. CANCELAR RESERVA ---
const cancelarReserva = async (req, res) => {
    try {
        await prisma.reserva.update({
            where: { id: parseInt(req.params.id) },
            data: { estado: 'cancelada' }
        });
        res.json({ success: true, message: 'Reserva cancelada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al cancelar la reserva' });
    }
};

module.exports = {
    getAllReservas,
    checkDisponibilidad,
    createReserva,
    updateReserva,
    cancelarReserva
};