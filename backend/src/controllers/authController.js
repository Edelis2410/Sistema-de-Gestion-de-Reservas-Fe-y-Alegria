// src/controllers/authController.js 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario con su rol
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo. Contacte al administrador'
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol.nombre,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Preparar respuesta del usuario (sin password)
    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.nombre,
      rol_id: usuario.rol_id,
      activo: usuario.activo,
      fecha_creacion: usuario.fecha_creacion
    };

    // Registrar en auditoría
    await prisma.auditoria.create({
      data: {
        usuario_id: usuario.id,
        accion: 'login',
        tabla_afectada: 'usuarios',
        descripcion: `Usuario ${email} inició sesión`
      }
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: { rol: true }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol.nombre,
      rol_id: usuario.rol_id,
      activo: usuario.activo,
      fecha_creacion: usuario.fecha_creacion
    };

    res.json({
      success: true,
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(currentPassword, usuario.password_hash);
    
    if (!passwordValida) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: userId },
      data: { password_hash }
    });

    // Registrar en auditoría
    await prisma.auditoria.create({
      data: {
        usuario_id: userId,
        accion: 'cambiar_password',
        tabla_afectada: 'usuarios',
        descripcion: `Usuario ${usuario.email} cambió su contraseña`
      }
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};