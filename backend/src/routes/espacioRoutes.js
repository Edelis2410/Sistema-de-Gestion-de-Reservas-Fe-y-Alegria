//  src/routes/espacioRoutes.js
router.get('/:id/disponibilidad', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.query;
    
    const espacioId = parseInt(id);
    
    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        success: false,
        error: 'Fecha y horarios son requeridos'
      });
    }
    
    // Verificar reservas conflictivas
    const reservasConflictivas = await prisma.reserva.findMany({
      where: {
        espacio_id: espacioId,
        fecha: new Date(fecha),
        estado: { in: ['pendiente', 'confirmada'] },
        OR: [
          {
            hora_inicio: { lte: hora_inicio },
            hora_fin: { gt: hora_inicio }
          },
          {
            hora_inicio: { lt: hora_fin },
            hora_fin: { gte: hora_fin }
          },
          {
            hora_inicio: { gte: hora_inicio },
            hora_fin: { lte: hora_fin }
          }
        ]
      }
    });
    
    res.json({
      disponible: reservasConflictivas.length === 0,
      conflictos: reservasConflictivas
    });
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});