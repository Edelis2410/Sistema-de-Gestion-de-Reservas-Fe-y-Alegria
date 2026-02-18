const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetearBaseDeDatos() {
  console.log("--------------------------------------------------");
  console.log("🚀 Iniciando limpieza total y reseteo de IDs...");
  console.log("--------------------------------------------------");

  try {
    // Definimos los nombres de las tablas según los @@map de tu schema.prisma
    // Usamos el orden correcto para evitar conflictos de integridad
    const tablasALimpiar = [
      'auditoria',
      'notificaciones',
      'reservas',
      'usuarios'
    ];

    for (const tabla of tablasALimpiar) {
      try {
        // TRUNCATE vacía la tabla
        // RESTART IDENTITY reinicia el contador de ID a 1
        // CASCADE se encarga de las relaciones (llaves foráneas)
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tabla}" RESTART IDENTITY CASCADE;`);
        console.log(`✅ Tabla "${tabla}": Limpiada y contador reiniciado a 1.`);
      } catch (err) {
        console.log(`⚠️  No se pudo limpiar la tabla "${tabla}": ${err.message}`);
      }
    }

    console.log("--------------------------------------------------");
    console.log("✨ ¡PROCESO FINALIZADO CON ÉXITO! ✨");
    console.log("Ahora puedes registrar tu primer usuario (será el ID 1)");
    console.log("y crear tu primera reserva (será el ID 1).");
    console.log("--------------------------------------------------");

  } catch (error) {
    console.error("\n❌ Error crítico durante el proceso:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetearBaseDeDatos();