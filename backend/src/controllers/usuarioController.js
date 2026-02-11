const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); // Usamos bcryptjs para evitar errores en Windows
const jwt = require('jsonwebtoken');

// La clave ahora se toma de las variables de entorno para mayor seguridad
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta_aqui';

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

// --- 2. VERIFICAR TOKEN (Y cargar preferencias) ---
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
                // Enviamos las preferencias para que el Frontend las conozca al cargar
                preferencias: {
                    notificacionesEmail: usuario.notificacionesEmail,
                    notificacionesPush: usuario.notificacionesPush,
                    recordatorioReserva: usuario.recordatorioReserva,
                    confirmacionReserva: usuario.confirmacionReserva,
                    notificarCambios: usuario.notificarCambios,
                    notificarRechazos: usuario.notificarRechazos
                }
            } 
        });
    } catch (e) { 
        res.status(500).json({ success: false }); 
    }
};

// --- 3. ACTUALIZAR PREFERENCIAS (NUEVO) ---
exports.actualizarPreferencias = async (req, res) => {
    try {
        const p = req.body;
        await prisma.usuario.update({
            where: { id: req.user.id },
            data: {
                notificacionesEmail: p.notificacionesEmail,
                notificacionesPush: p.notificacionesPush,
                recordatorioReserva: p.recordatorioReserva,
                confirmacionReserva: p.confirmacionReserva,
                notificarCambios: p.notificarCambios,
                notificarRechazos: p.notificarRechazos,
            }
        });

        // Auditoría del cambio
        await prisma.auditoria.create({
            data: {
                usuario_id: req.user.id,
                accion: 'actualizar_preferencias',
                tabla_afectada: 'usuarios',
                descripcion: `Usuario actualizó sus ajustes de notificación`
            }
        });

        res.json({ success: true, message: 'Preferencias actualizadas' });
    } catch (error) {
        console.error("Error al guardar preferencias:", error);
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