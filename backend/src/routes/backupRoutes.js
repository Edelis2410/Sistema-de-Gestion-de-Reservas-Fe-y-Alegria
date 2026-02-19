// backend/src/routes/backupRoutes.js
const express = require('express');
const router = express.Router();
const { generateBackup } = require('../controllers/backupController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Ruta para generar backup (descarga + envío por correo)
router.get(
  '/backup',
  authMiddleware,
  (req, res, next) => {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }
    next();
  },
  generateBackup
);

module.exports = router;