// src/routes/index.js
const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const espacioRoutes = require('./espacioRoutes');
const reservaRoutes = require('./reservaRoutes');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/usuarios', usuarioRoutes);
router.use('/espacios', espacioRoutes);
router.use('/reservas', reservaRoutes);

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'API del Sistema de Reservas del Colegio',
    version: '1.0.0'
  });
});

module.exports = router;