const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. OBTENER TODOS LOS ESPACIOS ---
exports.getAllEspacios = async (req, res) => {
  try {
    const { search = '', tipo = '' } = req.query;
    
    // ✅ CLAVE: Filtramos para que NUNCA se vean los que tienen eliminado: true
    // Pero permitimos que se vean los activo: false (para que aparezcan atenuados)
    const where = {
      eliminado: false
    };

    // Búsqueda por nombre o descripción
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro por categoría (tipo)
    if (tipo && tipo !== 'Todos') {
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
          where: { 
            estado: { in: ['pendiente', 'confirmada'] },
            // También filtramos reservas de espacios no eliminados por coherencia
          },
          orderBy: { fecha: 'asc' },
          take: 5
        }
      }
    });

    if (!espacio || espacio.eliminado) {
      return res.status(404).json({ success: false, error: 'Espacio no encontrado' });
    }

    res.json({ success: true, data: espacio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' });
  }
};

// --- 3. CREAR ESPACIO ---
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
        activo: true,
        eliminado: false // Por defecto no está eliminado
      }
    });

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
    console.error('Error al crear:', error);
    res.status(500).json({ success: false, error: 'Error al crear' });
  }
};

// --- 4. ACTUALIZAR ESPACIO ---
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
    console.error('Error al actualizar:', error);
    res.status(500).json({ success: false, error: 'No se pudo actualizar' });
  }
};

// --- 5. ELIMINAR ESPACIO (Borrado Lógico Real) ---
exports.deleteEspacio = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Marcamos como eliminado en la BD
    await prisma.espacio.update({
      where: { id: parseInt(id) },
      data: { 
        eliminado: true,
        activo: false 
      }
    });

    // 2. Auditoría protegida (Aquí estaba el error)
    // Usamos ?. para que si req.user es undefined, no explote el código
    const usuarioId = req.user?.id || null; 

    if (usuarioId) {
      await prisma.auditoria.create({
        data: {
          usuario_id: usuarioId,
          accion: 'eliminar_espacio',
          tabla_afectada: 'espacios',
          descripcion: `Eliminó lógicamente el espacio ID: ${id}`
        }
      }).catch(err => console.log("Auditoría no registrada:", err.message));
    } else {
      console.log("Aviso: Espacio eliminado sin registro de usuario en auditoría (req.user no definido)");
    }

    res.json({ success: true, message: 'Espacio eliminado de la vista correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ success: false, error: 'Error interno al intentar eliminar' });
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

// --- 7. TOGGLE ESTADO ACTIVO (Poner en Mantenimiento / Activar) ---
exports.toggleEstadoEspacio = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body; 

    const espacio = await prisma.espacio.findUnique({
      where: { id: parseInt(id) }
    });

    if (!espacio) return res.status(404).json({ success: false, error: 'No encontrado' });

    const nuevoEstado = !espacio.activo;

    const actualizado = await prisma.espacio.update({
      where: { id: parseInt(id) },
      data: { activo: nuevoEstado }
    });

    // Auditoría con el motivo
    await prisma.auditoria.create({
      data: {
        usuario_id: req.user.id,
        accion: nuevoEstado ? 'activar_espacio' : 'desactivar_espacio',
        tabla_afectada: 'espacios',
        descripcion: nuevoEstado 
          ? `Activó el espacio: ${espacio.nombre}` 
          : `Desactivó ${espacio.nombre}. Motivo: ${motivo || 'No especificado'}`
      }
    }).catch(err => console.log("Auditoría de toggle no registrada:", err.message));

    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error en toggleEstadoEspacio:', error);
    res.status(500).json({ success: false, error: 'Error al cambiar el estado' });
  }
};