const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener notificaciones del usuario autenticado
exports.getNotificaciones = async (req, res) => {
    try {
        const notificaciones = await prisma.notificacion.findMany({
            where: { 
                usuario_id: req.user.id // Correcto: con guion bajo
            },
            orderBy: { 
                fecha_envio: 'desc' 
            },
            take: 20
        });
        res.json({ success: true, data: notificaciones });
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ success: false, message: "Error al cargar notificaciones" });
    }
};

// 2. Marcar una notificación específica como leída
exports.marcarLeida = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.notificacion.update({
            where: { id: parseInt(id) },
            data: { 
                leido: true, // CORREGIDO: de 'leida' a 'leido'
                fecha_lectura: new Date() 
            }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error al marcar como leída:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Marcar TODAS las notificaciones del usuario como leídas
exports.marcarTodasLeidas = async (req, res) => {
    try {
        await prisma.notificacion.updateMany({
            where: { 
                usuario_id: req.user.id, // CORREGIDO: de 'usuarioId' a 'usuario_id'
                leido: false             // CORREGIDO: de 'leida' a 'leido'
            },
            data: { 
                leido: true              // CORREGIDO: de 'leida' a 'leido'
            }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error al marcar todas como leídas:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};