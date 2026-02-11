const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// --- RUTAS PROTEGIDAS POR TOKEN ---

// 1. Ver MIS reservas (Docente y Admin ven solo lo propio)
router.get('/', authMiddleware, reservaController.getAllReservas);

// 2. Crear reserva (Cualquier usuario autenticado)
router.post('/', authMiddleware, reservaController.createReserva);

// 3. Cancelar reserva (Cualquier usuario sobre su propia reserva o admin)
router.delete('/:id', authMiddleware, reservaController.cancelarReserva);

// --- RUTAS EXCLUSIVAS DEL ADMINISTRADOR ---

// 4. Ver TODAS las solicitudes del sistema (Para el apartado Solicitudes)
router.get('/solicitudes-globales', 
  authMiddleware, 
  roleMiddleware(['administrador']), 
  reservaController.getTodasLasSolicitudes
);

// 5. Aprobar y Rechazar
router.patch('/:id/aprobar', 
  authMiddleware, 
  roleMiddleware(['administrador']), 
  reservaController.aprobarReserva
);

router.patch('/:id/rechazar', 
  authMiddleware, 
  roleMiddleware(['administrador']), 
  reservaController.rechazarReserva
);

module.exports = router;