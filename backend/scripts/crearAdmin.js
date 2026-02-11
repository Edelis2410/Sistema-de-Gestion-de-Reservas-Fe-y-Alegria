// scripts/crearAdmin.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function crearAdmin() {
  try {
    console.log(' Conectando a tu base de datos existente...');
    await prisma.$connect();
    
    // Verificar que los roles existan
    console.log('\n🔍 Verificando roles en la base de datos...');
    const roles = await prisma.rol.findMany();
    console.log('Roles encontrados:', roles.map(r => `${r.id}: ${r.nombre}`));
    
    if (roles.length === 0) {
      console.error(' ERROR: No hay roles en la base de datos.');
      console.error('   Ejecuta primero en pgAdmin: INSERT INTO roles (nombre) VALUES (\'docente\'), (\'administrador\');');
      return;
    }
    
    // Buscar el rol administrador
    const rolAdmin = roles.find(r => r.nombre === 'administrador');
    if (!rolAdmin) {
      console.error(' ERROR: No se encontró el rol "administrador" en la tabla roles');
      return;
    }
    
    console.log(`✅ Rol administrador encontrado: ID ${rolAdmin.id} - ${rolAdmin.nombre}`);
    
    // Verificar si ya existe el usuario admin
    const adminExistente = await prisma.usuario.findUnique({
      where: { email: 'admin@colegio.edu' }
    });
    
    if (adminExistente) {
      console.log('\n  El administrador ya existe:');
      console.log(`   Email: ${adminExistente.email}`);
      console.log(`   Nombre: ${adminExistente.nombre}`);
      console.log(`   ID: ${adminExistente.id}`);
      return;
    }
    
    // Crear el administrador
    console.log('\n Creando usuario administrador...');
    const password = 'Admin123!'; // CONTRASEÑA TEMPORAL
    const password_hash = await bcrypt.hash(password, 10);
    
    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Administrador Principal',
        email: 'admin@colegio.edu',
        password_hash: password_hash,
        rol_id: rolAdmin.id,
        activo: true,
        fecha_actualizacion: new Date() // <--- MODIFICACIÓN CLAVE PARA EVITAR EL ERROR
      }
    });
    
    console.log('\n ADMINISTRADOR CREADO EXITOSAMENTE!');
    console.log('=========================================');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Contraseña temporal: ${password}`);
    console.log(`   Nombre: ${admin.nombre}`);
    console.log(`   Rol: ${rolAdmin.nombre} (ID: ${rolAdmin.id})`);
    console.log('\n IMPORTANTE:');
    console.log('   1. Intenta loguearte con: admin@colegio.edu / Admin123!');
    console.log('   2. El historial de reservas ahora debería estar en 0.');
    
  } catch (error) {
    console.error('\n ERROR:', error.message);
    console.error('Detalles:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

crearAdmin();