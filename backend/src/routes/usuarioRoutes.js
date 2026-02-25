// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, esAdmin } = require('../middleware/authMiddleware'); 

// POST /api/usuarios
router.post('/', authMiddleware, esAdmin, usuarioController.crearUsuario);

module.exports = router;