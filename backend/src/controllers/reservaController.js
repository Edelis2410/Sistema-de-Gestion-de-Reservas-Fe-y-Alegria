const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { enviarCorreoAprobacion, enviarCorreoRechazo, enviarCorreoModificacion, enviarCorreoNuevaSolicitud } = require('../utils/mailer');

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

        // --- VALIDACIÓN DE CAMPOS OBLIGATORIOS ---
        if (!titulo || !fecha || !hora_inicio || !hora_fin || !espacio_id) {
            return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
        }

        // --- CONVERSIÓN DE HORAS (para cálculos) ---
        const inicioDate = new Date(`1970-01-01T${hora_inicio}:00.000Z`);
        const finDate = new Date(`1970-01-01T${hora_fin}:00.000Z`);

        if (isNaN(inicioDate.getTime()) || isNaN(finDate.getTime())) {
            return res.status(400).json({ success: false, error: 'Formato de hora inválido' });
        }

        // --- VALIDACIÓN DE DURACIÓN (1h - 4h) ---
        const duracionHoras = (finDate - inicioDate) / (1000 * 60 * 60);
        if (duracionHoras > 4) {
            return res.status(400).json({ success: false, error: 'No puedes reservar por más de 4 horas.' });
        }
        if (duracionHoras < 1) {
            return res.status(400).json({ success: false, error: 'La reserva debe ser de al menos 1 hora.' });
        }

        // --- VALIDACIÓN DE HORARIO PERMITIDO (7am - 5pm) ---
        const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
        const [hFin, mFin] = hora_fin.split(':').map(Number);

        if (hInicio < 7 || hFin > 17 || (hFin === 17 && mFin > 0)) {
            return res.status(400).json({ success: false, error: 'El horario permitido es de 7:00 AM a 5:00 PM.' });
        }

        // --- VALIDACIÓN DE FECHA ---
        const fechaObj = new Date(fecha);
        fechaObj.setUTCHours(0, 0, 0, 0); // Normalizar a UTC medianoche

        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);

        if (fechaObj < hoy) {
            return res.status(400).json({ success: false, error: 'No se pueden realizar reservas en fechas pasadas.' });
        }

        // Días de diferencia (redondeo exacto)
        const diffTime = fechaObj.getTime() - hoy.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            return res.status(400).json({ success: false, error: 'La reserva debe realizarse con al menos 1 día de anticipación.' });
        }
        if (diffDays > 15) {
            return res.status(400).json({ success: false, error: 'Solo puedes reservar con un máximo de 15 días de anticipación.' });
        }

        // --- VALIDACIÓN DE HORA ACTUAL (si es hoy) ---
        const hoyStr = hoy.toISOString().split('T')[0];
        if (fecha === hoyStr) {
            const ahora = new Date();
            if (hInicio < ahora.getHours() || (hInicio === ahora.getHours() && mInicio < ahora.getMinutes())) {
                return res.status(400).json({ success: false, error: 'La hora de inicio seleccionada ya ha pasado.' });
            }
        }

        // --- DETERMINAR ESTADO SEGÚN ROL ---
        const esAdmin = req.user.rol === 'administrador';
        const estadoFinal = esAdmin ? 'confirmada' : 'pendiente';

        // --- TRANSACCIÓN: VERIFICAR DISPONIBILIDAD Y CREAR ---
        const nuevaReserva = await prisma.$transaction(async (tx) => {
            // Buscar reservas que se solapen en el mismo espacio/fecha (excluyendo canceladas/rechazadas)
            const conflictos = await tx.reserva.findMany({
                where: {
                    espacio_id: parseInt(espacio_id),
                    fecha: fechaObj,
                    estado: { notIn: ['cancelada', 'rechazada'] },
                    AND: [
                        { hora_inicio: { lt: finDate } },
                        { hora_fin: { gt: inicioDate } }
                    ]
                }
            });

            if (conflictos.length > 0) {
                throw new Error('El espacio no está disponible en ese horario');
            }

            // Crear la reserva
            return await tx.reserva.create({
                data: {
                    titulo,
                    fecha: fechaObj,
                    hora_inicio: inicioDate,
                    hora_fin: finDate,
                    usuario_id: req.user.id,
                    espacio_id: parseInt(espacio_id),
                    estado: estadoFinal,
                    creado_por_admin: esAdmin,
                    confirmado_por: esAdmin ? req.user.id : null
                }
            });
        });

        // --- NOTIFICACIONES ASÍNCRONAS (sin bloquear la respuesta) ---
        if (estadoFinal === 'pendiente') {
            setImmediate(async () => {
                try {
                    const admins = await prisma.usuario.findMany({
                        where: {
                            rol: { nombre: 'administrador' },
                            activo: true
                        },
                        select: { id: true, email: true, nombre: true, notificacionesEmail: true, notificacionesPush: true }
                    });

                    const espacio = await prisma.espacio.findUnique({ where: { id: parseInt(espacio_id) } });
                    const usuarioSolicitante = await prisma.usuario.findUnique({ where: { id: req.user.id } });

                    const [year, month, day] = fecha.split('-');
                    const fechaFormateada = `${day}/${month}/${year}`;

                    for (const admin of admins) {
                        if (admin.id === req.user.id) continue;

                        if (admin.notificacionesPush) {
                            await prisma.notificacion.create({
                                data: {
                                    usuario_id: admin.id,
                                    tipo: 'info',
                                    titulo: 'Nueva solicitud de reserva',
                                    mensaje: `El docente ${usuarioSolicitante.nombre} ha solicitado el espacio "${espacio.nombre}" para el día ${fechaFormateada}.`,
                                    leido: false,
                                    fecha_envio: new Date()
                                }
                            });
                        }

                        if (admin.notificacionesEmail) {
                            await enviarCorreoNuevaSolicitud(
                                admin.email,
                                admin.nombre,
                                usuarioSolicitante.nombre,
                                espacio.nombre,
                                fechaFormateada,
                                hora_inicio,
                                hora_fin,
                                titulo
                            );
                        }
                    }
                } catch (error) {
                    console.error("Error al notificar a administradores:", error);
                }
            });
        }

        res.json({ success: true, data: nuevaReserva });
    } catch (error) {
        console.error("Error en createReserva:", error);
        if (error.message === 'El espacio no está disponible en ese horario') {
            return res.status(409).json({ success: false, error: error.message });
        }
        // Error genérico (posiblemente de validación o base de datos)
        res.status(500).json({ success: false, error: 'Error interno al crear la reserva' });
    }
};

// --- 4. ACTUALIZAR / GESTIONAR RESERVA ---
const updateReserva = async (req, res) => {
    const { id } = req.params;
    const { estado, motivo_rechazo, titulo, fecha, hora_inicio, hora_fin, espacio_id } = req.body;
    
    try {
        const reservaPrevia = await prisma.reserva.findUnique({ 
            where: { id: parseInt(id) },
            include: { espacio: true, usuario: true }
        });

        if (!reservaPrevia) {
            return res.status(404).json({ success: false, error: 'Reserva no encontrada' });
        }

        // --- VALIDACIÓN DE DURACIÓN EN ACTUALIZACIÓN ---
        if (hora_inicio || hora_fin) {
            const inicioVal = hora_inicio ? new Date(`1970-01-01T${hora_inicio}:00.000Z`) : reservaPrevia.hora_inicio;
            const finVal = hora_fin ? new Date(`1970-01-01T${hora_fin}:00.000Z`) : reservaPrevia.hora_fin;
            const duracionHoras = (finVal - inicioVal) / (1000 * 60 * 60);

            if (duracionHoras > 4) {
                return res.status(400).json({ success: false, error: 'No puedes reservar por más de 4 horas.' });
            }
            if (duracionHoras < 1) {
                return res.status(400).json({ success: false, error: 'La reserva debe ser de al menos 1 hora.' });
            }
        }

        // --- VALIDACIÓN DE FECHA PASADA Y ANTICIPACIÓN EN ACTUALIZACIÓN ---
        if (fecha) {
            const ahora = new Date();
            const hoyStr = ahora.toLocaleDateString('en-CA');
            
            if (fecha < hoyStr) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No se puede mover una reserva a una fecha pasada.' 
                });
            }

            // Mínimo 1 día de anticipación
            const fechaSolicitadaObj = new Date(fecha);
            const hoyStrSinHora = new Date().toLocaleDateString('en-CA');
            const unDiaEnMs = 24 * 60 * 60 * 1000;
            const diferenciaDias = Math.round((fechaSolicitadaObj - new Date(hoyStrSinHora)) / unDiaEnMs);

            if (diferenciaDias < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'La reserva debe realizarse con al menos 1 día de anticipación. No puedes reservar para el día de hoy.'
                });
            }

            // Máximo 15 días de anticipación
            if (diferenciaDias > 15) {
                return res.status(400).json({
                    success: false,
                    error: 'Solo puedes reservar con un máximo de 15 días de anticipación.'
                });
            }

            if (fecha === hoyStr && hora_inicio) {
                const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
                const horaActual = ahora.getHours();
                const minutosActuales = ahora.getMinutes();

                if (hInicio < horaActual || (hInicio === horaActual && mInicio < minutosActuales)) {
                    return res.status(400).json({
                        success: false,
                        error: 'No puedes programar una reserva para una hora que ya pasó.'
                    });
                }
            }
        }
        // ----------------------------------------------------

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

        const user = reservaActualizada.usuario;
        const huboCambiosEnDatos = titulo || fecha || hora_inicio || hora_fin || espacio_id;

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