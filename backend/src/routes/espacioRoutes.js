//  src/routes/espacioRoutes.js
const express = require('express');
const router = express.Router();
const espacioController = require('../controllers/espacioController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware'); // Ajusta según tus middlewares
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- RUTAS PÚBLICAS/AUTENTICADAS ---

// Obtener todos los espacios
router.get('/', authMiddleware, espacioController.getAllEspacios);

// Obtener un espacio por ID
router.get('/:id', authMiddleware, espacioController.getEspacioById);

// Verificar disponibilidad (La que ya tenías)
router.get('/:id/disponibilidad', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.query;
    const espacioId = parseInt(id);
    
    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ success: false, error: 'Fecha y horarios son requeridos' });
    }
    
    const reservasConflictivas = await prisma.reserva.findMany({
      where: {
        espacio_id: espacioId,
        fecha: new Date(fecha),
        estado: { in: ['pendiente', 'confirmada'] },
        OR: [
          { hora_inicio: { lte: hora_inicio }, hora_fin: { gt: hora_inicio } },
          { hora_inicio: { lt: hora_fin }, hora_fin: { gte: hora_fin } },
          { hora_inicio: { gte: hora_inicio }, hora_fin: { lte: hora_fin } }
        ]
      }
    });
    
    res.json({ success: true, disponible: reservasConflictivas.length === 0, conflictos: reservasConflictivas });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// --- RUTAS DE ADMINISTRADOR ---

// Crear nuevo espacio
router.post('/', authMiddleware, adminMiddleware, espacioController.createEspacio);

// Actualizar espacio
router.put('/:id', authMiddleware, adminMiddleware, espacioController.updateEspacio);

// Eliminar espacio
router.delete('/:id', authMiddleware, adminMiddleware, espacioController.deleteEspacio);


// Cambiar estado activo/inactivo con motivo
router.patch('/:id/toggle', authMiddleware, adminMiddleware, espacioController.toggleEstadoEspacio);

module.exports = router;