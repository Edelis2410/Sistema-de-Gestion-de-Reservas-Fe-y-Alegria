const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. ESTADÍSTICAS ADMIN ---
exports.getAdminStats = async (req, res) => {
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ success: false, error: 'No autorizado' });
    }

    try {
        const [total, pendientes, confirmadas, rechazadas, espaciosCount, usuariosCount, topEspaciosRaw] = await Promise.all([
            prisma.reserva.count(),
            prisma.reserva.count({ where: { estado: 'pendiente' } }),
            prisma.reserva.count({ where: { estado: 'confirmada' } }),
            prisma.reserva.count({ where: { estado: 'rechazada' } }),
            prisma.espacio.count({ where: { activo: true } }),
            prisma.usuario.count({ where: { activo: true } }),
            prisma.reserva.groupBy({
                by: ['espacio_id'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 3
            })
        ]);

        const topEspacios = await Promise.all(
            topEspaciosRaw.map(async (item) => {
                const esp = await prisma.espacio.findUnique({
                    where: { id: item.espacio_id },
                    select: { nombre: true }
                });
                return {
                    nombre: esp ? esp.nombre : "Espacio desconocido",
                    cantidad: item._count.id
                };
            })
        );

        res.json({
            success: true,
            data: { total, pendientes, confirmadas, rechazadas, espaciosCount, usuariosCount, topEspacios }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al calcular estadísticas' });
    }
};

// --- 2. ESTADÍSTICAS DOCENTE ---
exports.getDocenteStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const [total, confirmadas, pendientes, rechazadas, canceladas, proximasRaw] = await Promise.all([
            prisma.reserva.count({ where: { usuario_id: userId } }),
            prisma.reserva.count({ where: { usuario_id: userId, estado: 'confirmada' } }),
            prisma.reserva.count({ where: { usuario_id: userId, estado: 'pendiente' } }),
            prisma.reserva.count({ where: { usuario_id: userId, estado: 'rechazada' } }),
            prisma.reserva.count({ where: { usuario_id: userId, estado: 'cancelada' } }),
            prisma.reserva.findMany({
                where: { 
                    usuario_id: userId, 
                    fecha: { gte: new Date() },
                    estado: { in: ['confirmada', 'pendiente'] } 
                },
                take: 3,
                orderBy: { fecha: 'asc' },
                include: { espacio: true }
            })
        ]);

        const proximas = proximasRaw.map(reserva => {
            const formatTime = (dateObj) => {
                if (!dateObj) return "00:00";
                return new Date(dateObj).toLocaleTimeString('en-GB', {
                    hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
                });
            };
            return {
                ...reserva,
                hora_inicio: formatTime(reserva.hora_inicio),
                hora_fin: formatTime(reserva.hora_fin)
            };
        });

        res.json({
            success: true,
            data: { stats: { total, confirmadas, pendientes, rechazadas, canceladas }, proximas }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 3. REPORTE ESTADÍSTICO (Módulo de Reportes) - VERSIÓN SIMPLIFICADA ---
exports.getReporteEstadisticas = async (req, res) => {
    try {
        const { periodo } = req.query;
        let whereReserva = {};
        let whereUsuario = {};

        if (periodo === 'mensual') {
            // Últimos 30 días desde ahora
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 30);
            whereReserva = {
                fecha: {
                    gte: fechaLimite
                }
            };
            whereUsuario = {
                fecha_creacion: {
                    gte: fechaLimite
                }
            };
        } else {
            // 'todos' o cualquier otro valor: sin filtro
            whereReserva = {};
            whereUsuario = {};
        }

        // --- OBTENER RESERVAS (con o sin filtro) ---
        const reservasDb = await prisma.reserva.findMany({
            where: whereReserva,
            include: {
                usuario: { select: { nombre: true } },
                espacio: { select: { nombre: true } }
            },
            orderBy: { fecha: 'desc' }
        });

        // --- OBTENER TODOS LOS ESPACIOS ACTIVOS ---
        const todosEspacios = await prisma.espacio.findMany({
            where: { eliminado: false, activo: true },
            select: {
                id: true,
                nombre: true,
                activo: true,
                reservas: {
                    where: whereReserva,
                    select: { hora_inicio: true, hora_fin: true }
                }
            }
        });

        // --- OBTENER USUARIOS (con o sin filtro) ---
        const usuariosFiltrados = await prisma.usuario.findMany({
            where: whereUsuario,
            select: {
                id: true,
                nombre: true,
                email: true,
                fecha_creacion: true,
                activo: true,
                rol: { select: { nombre: true } },
                _count: { select: { reservas: true } }
            },
            orderBy: { fecha_creacion: 'desc' }
        });

        // --- MÉTRICAS ---
        const totalUsuariosPeriodo = usuariosFiltrados.length;
        const totalReservasPeriodo = reservasDb.length;
        const aprobadasCount = reservasDb.filter(r => r.estado === 'confirmada').length;
        const tasaCalculada = totalReservasPeriodo > 0 ? `${Math.round((aprobadasCount / totalReservasPeriodo) * 100)}%` : "0%";

        console.log(`Reservas encontradas: ${reservasDb.length}`);
        console.log(`Usuarios encontrados: ${usuariosFiltrados.length}`);
        console.log(`Espacios totales: ${todosEspacios.length}`);

        // --- CONSTRUIR RESPUESTA ---
        res.json({
            success: true,
            data: {
                sistema: {
                    totalUsuarios: totalUsuariosPeriodo,
                    totalEspacios: todosEspacios.length,
                    totalReservas: totalReservasPeriodo,
                    tasaConfirmadas: tasaCalculada
                },
                reservas: reservasDb.map(r => {
                    let duracionTexto = "N/A";
                    if (r.hora_inicio && r.hora_fin) {
                        const diffMs = new Date(r.hora_fin) - new Date(r.hora_inicio);
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        duracionTexto = `${diffHrs}h ${diffMins}m`;
                    }
                    return {
                        id: r.id,
                        usuario: r.usuario?.nombre || 'N/A',
                        espacio: r.espacio?.nombre || 'N/A',
                        fecha: r.fecha ? new Date(r.fecha).toISOString().split('T')[0] : 'N/A',
                        horaInicio: r.hora_inicio ? new Date(r.hora_inicio).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : 'N/A',
                        duracion: duracionTexto,
                        estado: r.estado || 'pendiente'
                    };
                }),
                usuarios: usuariosFiltrados.map(u => ({
                    id: u.id,
                    nombre: u.nombre,
                    correo: u.email,
                    fechaRegistro: u.fecha_creacion ? new Date(u.fecha_creacion).toISOString().split('T')[0] : 'N/A',
                    totalReservas: u._count.reservas,
                    estado: u.activo ? 'Activo' : 'Inactivo',
                    rol: u.rol?.nombre || 'Docente'
                })),
                espacios: todosEspacios.map(e => {
                    const horasTotalesReales = e.reservas.reduce((acc, r) => {
                        if (r.hora_inicio && r.hora_fin) {
                            return acc + ((new Date(r.hora_fin) - new Date(r.hora_inicio)) / (1000 * 60 * 60));
                        }
                        return acc;
                    }, 0);
                    return {
                        id: e.id,
                        espacio: e.nombre,
                        horasTotales: Math.round(horasTotalesReales * 10) / 10,
                        porcentajeOcupacion: e.reservas.length > 0 ? Math.min((e.reservas.length * 10), 100) : 0,
                        numeroReservas: e.reservas.length,
                        disponibilidad: e.reservas.length > 10 ? 'Baja' : (e.reservas.length > 0 ? 'Media' : 'Alta'),
                        estado: e.activo ? 'Activo' : 'Inactivo'
                    };
                })
            }
        });
    } catch (error) {
        console.error("Error en getReporteEstadisticas:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};