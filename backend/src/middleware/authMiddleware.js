// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Acceso denegado. Token no proporcionado' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_fallback');
    
    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: { rol: true }
    });

    if (!usuario) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario inactivo. Contacte al administrador' 
      });
    }

    // Adjuntar usuario a la request
    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.nombre,
      rol_id: usuario.rol_id
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expirado' 
      });
    }
    
    console.error('Error en authMiddleware:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error de autenticación' 
    });
  }
};

// Middleware para verificar roles específicos
const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no autenticado' 
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false, 
        error: 'No tiene permisos para realizar esta acción' 
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };