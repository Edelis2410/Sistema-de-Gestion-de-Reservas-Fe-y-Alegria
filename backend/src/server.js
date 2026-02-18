process.env.TZ = "America/Caracas";
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const app = express();
const SECRET_KEY = 'tu_clave_secreta_aqui';

// --- IMPORTACIÓN DE TUS MÓDULOS ---
// ✅ Se eliminó enviarCorreoRecordatorio de aquí
const { enviarCorreoAprobacion, enviarCorreoRechazo, enviarCorreoModificacion } = require('./utils/mailer');
const reservaController = require('./controllers/reservaController');
const usuarioController = require('./controllers/usuarioController');
const espacioController = require('./controllers/espacioController');
const dashboardController = require('./controllers/dashboardController');
const notificacionController = require('./controllers/notificacionController');

app.use(cors());

// --- CONFIGURACIÓN DE LÍMITES PARA FOTOS ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- MIDDLEWARE DE AUTENTICACIÓN ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// --- RUTAS DE USUARIOS ---
app.post('/api/login', usuarioController.login);
app.post('/api/forgot-password', usuarioController.forgotPassword);
app.post('/api/reset-password', usuarioController.resetPassword); 
app.get('/api/verify-token', authenticateToken, usuarioController.verifyToken);
app.get('/api/usuarios', authenticateToken, usuarioController.getAllUsuarios);
app.post('/api/usuarios', authenticateToken, usuarioController.crearUsuario);
app.put('/api/usuarios/perfil', authenticateToken, usuarioController.actualizarPerfil);
app.put('/api/usuarios/preferencias', authenticateToken, usuarioController.actualizarPreferencias);
app.put('/api/usuarios/:id', authenticateToken, usuarioController.updateUsuario);
app.delete('/api/usuarios/:id', authenticateToken, usuarioController.deleteUsuario);

// RUTAS ESPACIOS
app.get('/api/espacios', espacioController.getAllEspacios);
app.get('/api/espacios/:id', espacioController.getEspacioById);
app.post('/api/espacios', authenticateToken, espacioController.createEspacio);
app.put('/api/espacios/:id', authenticateToken, espacioController.updateEspacio);
app.delete('/api/espacios/:id', espacioController.deleteEspacio);

app.patch('/api/espacios/:id/toggle', authenticateToken, espacioController.toggleEstadoEspacio);

// RUTAS RESERVAS
app.get('/api/reservas', authenticateToken, reservaController.getAllReservas);
app.get('/api/reservas/check', reservaController.checkDisponibilidad);
app.post('/api/reservas', authenticateToken, reservaController.createReserva);
app.put('/api/reservas/:id', authenticateToken, reservaController.updateReserva);
app.delete('/api/reservas/:id', authenticateToken, reservaController.cancelarReserva);

app.get('/api/admin/stats', authenticateToken, dashboardController.getAdminStats);
app.get('/api/docente/stats', authenticateToken, dashboardController.getDocenteStats);
app.get('/api/reportes/estadisticas', authenticateToken, dashboardController.getReporteEstadisticas);

// --- RUTAS DE NOTIFICACIONES ---
app.get('/api/notificaciones', authenticateToken, notificacionController.getNotificaciones);
app.put('/api/notificaciones/:id/read', authenticateToken, notificacionController.marcarLeida);
app.put('/api/notificaciones/read-all', authenticateToken, notificacionController.marcarTodasLeidas);

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// ✅ SE ELIMINÓ TODA LA TAREA PROGRAMADA (CRON JOB) DE AQUÍ

app.use('*', (req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});