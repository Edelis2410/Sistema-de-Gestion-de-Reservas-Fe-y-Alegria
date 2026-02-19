const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); // Usamos bcryptjs para evitar errores en Windows
const jwt = require('jsonwebtoken');

const { transporter } = require('../utils/mailer');
// La clave ahora se toma de las variables de entorno para mayor seguridad
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta_aqui';

// --- Función auxiliar para contar administradores activos (opcionalmente excluyendo un ID) ---
const contarAdminsActivos = async (excluirId = null) => {
  const where = {
    rol: { nombre: 'administrador' },
    activo: true
  };
  if (excluirId) {
    where.id = { not: excluirId };
  }
  return await prisma.usuario.count({ where });
};

// --- 1. LOGIN ---
exports.login = async (req, res) => {
    const { email, password, rolSeleccionado } = req.body;
    
    try {
        const usuario = await prisma.usuario.findUnique({ 
            where: { email: email.trim().toLowerCase() },
            include: { rol: true } 
        });

        if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        if (!usuario.activo) {
            return res.status(401).json({ success: false, error: 'Usuario inactivo' });
        }

        const nombreRol = usuario.rol.nombre.toLowerCase();
        
        if (rolSeleccionado) {
            const mapeoRoles = { 'docente': 'docente', 'admin': 'administrador' };
            const rolEsperado = mapeoRoles[rolSeleccionado];
            if (rolEsperado && rolEsperado !== nombreRol) {
                return res.status(403).json({ success: false, error: `Acceso denegado: Tu rol es ${nombreRol}` });
            }
        }

        const token = jwt.sign({ 
            id: usuario.id, 
            email: usuario.email, 
            rol: nombreRol,
            nombre: usuario.nombre 
        }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            success: true,
            token,
            user: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                rol: nombreRol,
                foto: usuario.foto 
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, error: 'Error interno' });
    }
};

// --- 2. VERIFICAR TOKEN (Y cargar preferencias actualizadas) ---
exports.verifyToken = async (req, res) => {
    try {
        const usuario = await prisma.usuario.findUnique({ 
            where: { id: req.user.id }, 
            include: { rol: true } 
        });
        
        if (!usuario) return res.status(401).json({ success: false });

        res.json({ 
            success: true, 
            user: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email,
                rol: usuario.rol.nombre.toLowerCase(),
                foto: usuario.foto,
                // Solo enviamos las preferencias que existen en tu nuevo esquema de Prisma
                preferencias: {
                    notificacionesEmail: usuario.notificacionesEmail,
                    notificacionesPush: usuario.notificacionesPush,
                    recordatorioReserva: usuario.recordatorioReserva
                }
            } 
        });
    } catch (e) { 
        res.status(500).json({ success: false }); 
    }
};

// --- 3. ACTUALIZAR PREFERENCIAS  ---
exports.actualizarPreferencias = async (req, res) => {
    try {
        const p = req.body;
        
        await prisma.usuario.update({
            where: { id: req.user.id },
            data: {
                notificacionesEmail: Boolean(p.notificacionesEmail),
                notificacionesPush: Boolean(p.notificacionesPush),
                recordatorioReserva: Boolean(p.recordatorioReserva)
            }
        });

        // Auditoría
        await prisma.auditoria.create({
            data: {
                usuario_id: req.user.id,
                accion: 'actualizar_preferencias',
                tabla_afectada: 'usuarios',
                descripcion: `Usuario actualizó ajustes: Email(${p.notificacionesEmail}), Push(${p.notificacionesPush}), Recordatorio(${p.recordatorioReserva})`
            }
        });

        res.json({ success: true, message: 'Preferencias actualizadas' });
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ success: false, error: 'No se pudieron guardar los ajustes' });
    }
};

// --- 4. ACTUALIZAR PERFIL PROPIO ---
exports.actualizarPerfil = async (req, res) => {
    const { nombre, email, telefono, foto } = req.body;
    try {
        const usuarioActualizado = await prisma.usuario.update({
            where: { id: req.user.id },
            data: {
                nombre: nombre,
                email: email ? email.toLowerCase().trim() : undefined,
                telefono: telefono,
                foto: foto,
            },
            include: { rol: true }
        });

        res.json({
            success: true,
            user: {
                id: usuarioActualizado.id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                rol: usuarioActualizado.rol.nombre.toLowerCase(),
                foto: usuarioActualizado.foto,
                telefono: usuarioActualizado.telefono
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al guardar cambios' });
    }
};

// --- 5. OBTENER TODOS LOS USUARIOS (ADMIN) ---
exports.getAllUsuarios = async (req, res) => {
    try {
        if (req.user.rol !== 'administrador') return res.status(403).json({ success: false });
        
        const usuarios = await prisma.usuario.findMany({ 
            include: { rol: true },
            orderBy: { nombre: 'asc' }
        });

        const dataFormateada = usuarios.map(u => ({
            id: u.id,
            nombre: u.nombre,
            email: u.email,
            activo: u.activo,
            rol: u.rol.nombre.toLowerCase(),
            rol_id: u.rol_id
        }));

        res.json({ success: true, data: dataFormateada });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 6. CREAR NUEVO USUARIO (ADMIN) ---
exports.crearUsuario = async (req, res) => {
    try {
        if (req.user.rol !== 'administrador') {
            return res.status(403).json({ success: false, error: 'No autorizado' });
        }

        const { nombre, email, password, rol_id, activo } = req.body;

        // --- VALIDACIÓN LÍMITE DE ADMINISTRADORES ---
        const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'administrador' } });
        if (!rolAdmin) {
            return res.status(500).json({ success: false, error: 'Error interno: rol administrador no encontrado' });
        }

        // Si el nuevo usuario será administrador activo, verificar límite
        if (parseInt(rol_id) === rolAdmin.id && (activo === undefined || activo === true)) {
            const adminsActivos = await contarAdminsActivos();
            if (adminsActivos >= 4) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No se puede crear otro administrador. Límite máximo de 4 administradores activos alcanzado.' 
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email: email.toLowerCase().trim(),
                password_hash,
                rol_id: parseInt(rol_id),
                activo: activo !== undefined ? activo : true
            }
        });

        await prisma.auditoria.create({
            data: {
                usuario_id: req.user.id,
                accion: 'crear_usuario',
                tabla_afectada: 'usuarios',
                descripcion: `Admin creó al usuario: ${email}`
            }
        });

        res.status(201).json({ success: true, message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        if (error.code === 'P2002') return res.status(400).json({ success: false, error: 'El correo ya existe' });
        res.status(500).json({ success: false, error: 'Error al procesar el registro' });
    }
};

// --- 7. EDITAR USUARIO (ADMIN) ---
exports.updateUsuario = async (req, res) => {
    if (req.user.rol !== 'administrador') return res.status(403).json({ success: false });
    const { id } = req.params;
    const { nombre, email, rol_id, activo } = req.body;
    
    try {
        // Obtener usuario actual
        const usuarioActual = await prisma.usuario.findUnique({
            where: { id: parseInt(id) },
            include: { rol: true }
        });
        if (!usuarioActual) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        // Obtener rol administrador
        const rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'administrador' } });
        if (!rolAdmin) {
            return res.status(500).json({ success: false, error: 'Error interno: rol administrador no encontrado' });
        }

        // Determinar el estado final después de la actualización
        const rolFinal = rol_id !== undefined ? parseInt(rol_id) : usuarioActual.rol_id;
        const activoFinal = activo !== undefined ? activo : usuarioActual.activo;

        // Si el resultado será administrador activo, verificar límite
        if (rolFinal === rolAdmin.id && activoFinal === true) {
            // Contar administradores activos excluyendo al usuario actual si ya es administrador activo
            const excluirId = (usuarioActual.rol_id === rolAdmin.id && usuarioActual.activo === true) ? usuarioActual.id : null;
            const adminsActivos = await contarAdminsActivos(excluirId);
            if (adminsActivos >= 4) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No se puede actualizar: se alcanzaría el límite máximo de 4 administradores activos.' 
                });
            }
        }

        // Proceder con la actualización
        const actualizado = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: {
                nombre,
                email: email.toLowerCase().trim(),
                rol_id: parseInt(rol_id),
                activo
            }
        });

        res.json({ success: true, data: actualizado });
    } catch (e) {
        console.error("Error al actualizar usuario:", e);
        res.status(500).json({ success: false, error: 'No se pudo actualizar el usuario' });
    }
};

// --- 8. DESACTIVAR USUARIO (ADMIN) ---
exports.deleteUsuario = async (req, res) => {
    if (req.user.rol !== 'administrador') return res.status(403).json({ success: false });
    try {
        await prisma.usuario.update({
            where: { id: parseInt(req.params.id) },
            data: { activo: false }
        });
        res.json({ success: true, message: 'Usuario desactivado correctamente' });
    } catch (e) {
        res.status(500).json({ success: false, error: 'No se pudo desactivar' });
    }
};

// --- 9. SOLICITAR RECUPERACIÓN DE CONTRASEÑA ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ 
            where: { email: email.toLowerCase().trim() } 
        });

        if (!usuario) {
            return res.json({ success: true, message: 'Si el correo existe, se enviará un enlace.' });
        }

        const resetToken = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.email,
            subject: 'Recuperación de Contraseña - Sistema de Reservas',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
                    <h2 style="color: #2563eb; text-align: center;">Recuperación de Contraseña</h2>
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el botón:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Restablecer mi contraseña
                        </a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Enlace de recuperación enviado.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'No se pudo enviar el correo' });
    }
};

// --- 10. RESTABLECER CONTRASEÑA ---
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await prisma.usuario.update({
            where: { id: decoded.id },
            data: { password_hash: password_hash }
        });

        await prisma.auditoria.create({
            data: {
                usuario_id: decoded.id,
                accion: 'reset_password',
                tabla_afectada: 'usuarios',
                descripcion: 'El usuario restableció su contraseña mediante enlace de correo'
            }
        });

        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, error: 'El enlace es válido o ha expirado' });
    }
};