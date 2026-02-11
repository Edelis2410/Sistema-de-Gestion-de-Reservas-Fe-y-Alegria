const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. OBTENER TODOS LOS ESPACIOS (Con filtros) ---
exports.getAllEspacios = async (req, res) => {
  try {
    const { search = '', tipo = '', activo = '' } = req.query;

    const where = {};
    
    // Si no se especifica 'activo', por defecto solo traemos los activos (como hacías en el server)
    if (activo === '') {
      where.activo = true;
    } else {
      where.activo = activo === 'true';
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const espacios = await prisma.espacio.findMany({
      where,
      orderBy: { nombre: 'asc' }
    });

    res.json({ success: true, data: espacios });
  } catch (error) {
    console.error('Error obteniendo espacios:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// --- 2. OBTENER UN ESPACIO POR ID ---
exports.getEspacioById = async (req, res) => {
  try {
    const { id } = req.params;
    const espacio = await prisma.espacio.findUnique({
      where: { id: parseInt(id) },
      include: {
        reservas: {
          where: { estado: { in: ['pendiente', 'confirmada'] } },
          orderBy: { fecha: 'asc' },
          take: 5
        }
      }
    });

    if (!espacio) return res.status(404).json({ success: false, error: 'No encontrado' });

    res.json({ success: true, data: espacio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' });
  }
};

// --- 3. CREAR ESPACIO (Mudado del server.js) ---
exports.createEspacio = async (req, res) => {
  try {
    const { nombre, capacidad, tipo, descripcion } = req.body;

    if (!nombre || !capacidad) {
      return res.status(400).json({ success: false, error: 'Nombre y capacidad requeridos' });
    }

    const nuevoEspacio = await prisma.espacio.create({
      data: {
        nombre,
        capacidad: parseInt(capacidad),
        tipo: tipo || 'general',
        descripcion: descripcion || '',
        activo: true
      }
    });

    // Auditoría (Importante si la usas en otros controllers)
    await prisma.auditoria.create({
      data: {
        usuario_id: req.user.id,
        accion: 'crear_espacio',
        tabla_afectada: 'espacios',
        descripcion: `Creó el espacio: ${nombre}`
      }
    }).catch(err => console.log("Auditoría no registrada:", err.message));

    res.status(201).json({ success: true, data: nuevoEspacio });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, error: 'Ese nombre ya existe' });
    res.status(500).json({ success: false, error: 'Error al crear' });
  }
};

// --- 4. ACTUALIZAR ESPACIO (Mudado del server.js) ---
exports.updateEspacio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, capacidad, tipo, descripcion, activo } = req.body;

    const actualizado = await prisma.espacio.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        capacidad: capacidad ? parseInt(capacidad) : undefined,
        tipo,
        descripcion,
        activo: activo !== undefined ? activo : undefined
      }
    });

    res.json({ success: true, data: actualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: 'No se pudo actualizar' });
  }
};

// --- 5. ELIMINAR ESPACIO (Borrado Lógico mudado del server.js) ---
exports.deleteEspacio = async (req, res) => {
  try {
    await prisma.espacio.update({
      where: { id: parseInt(req.params.id) },
      data: { activo: false }
    });
    res.json({ success: true, message: 'Espacio desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar' });
  }
};

// --- 6. CHECK DISPONIBILIDAD ---
exports.checkDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.query;

    const reservasExistentes = await prisma.reserva.findMany({
      where: {
        espacio_id: parseInt(id),
        fecha: new Date(fecha),
        estado: { in: ['pendiente', 'confirmada'] }
      }
    });

    const hayConflicto = reservasExistentes.some(r => {
      return hora_inicio < r.hora_fin && hora_fin > r.hora_inicio;
    });

    res.json({ success: true, disponible: !hayConflicto });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al verificar disponibilidad' });
  }
};