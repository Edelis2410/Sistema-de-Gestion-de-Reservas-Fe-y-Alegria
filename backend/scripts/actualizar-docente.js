// scripts/actualizar-docente.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function actualizarDocente() {
  try {
    console.log('🔄 Actualizando contraseña del docente...\n');
    
    const EMAIL = 'docente@colegio.edu';
    const NUEVA_CONTRASEÑA = 'Docente123!';
    
    // 1. Generar NUEVO hash
    console.log(`Generando hash para: "${NUEVA_CONTRASEÑA}"`);
    const nuevoHash = await bcrypt.hash(NUEVA_CONTRASEÑA, 10);
    console.log(`Nuevo hash: ${nuevoHash.substring(0, 50)}...\n`);
    
    // 2. Verificar que el hash funciona
    const verificación = await bcrypt.compare(NUEVA_CONTRASEÑA, nuevoHash);
    console.log(`¿El hash funciona? ${verificación ? '✅ SÍ' : '❌ NO'}\n`);
    
    if (!verificación) {
      throw new Error('El hash generado no es válido');
      
    }
    
    // 3. Buscar usuario
    console.log('Buscando usuario en la base de datos...');
    const usuario = await prisma.usuario.findUnique({
      where: { email: EMAIL }
    });
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado. Creando uno nuevo...');
      
      // Crear nuevo usuario
      const rolDocente = await prisma.rol.findFirst({
        where: { nombre: 'docente' }
      });
      
      if (!rolDocente) {
        throw new Error('No se encontró el rol "docente"');
      }
      
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre: 'Docente de Prueba',
          email: EMAIL,
          password_hash: nuevoHash,
          rol_id: rolDocente.id,
          activo: true
        }
      });
      
      console.log(`✅ Usuario creado: ${nuevoUsuario.email}`);
      
    } else {
      // 4. Actualizar contraseña existente
      console.log(`✅ Usuario encontrado: ${usuario.email}`);
      console.log('Actualizando contraseña...');
      
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { 
          password_hash: nuevoHash,
          activo: true 
        }
      });
      
      console.log('✅ Contraseña actualizada');
    }
    
    // 5. Mostrar credenciales finales
    console.log('\n✨ ¡ACTUALIZACIÓN COMPLETADA!');
    console.log('=============================');
    console.log('📋 CREDENCIALES PARA INICIAR SESIÓN:');
    console.log(`📧 Email: ${EMAIL}`);
    console.log(`🔑 Contraseña: ${NUEVA_CONTRASEÑA}`);
    console.log('\n💡 Ahora puedes iniciar sesión con estas credenciales.');
    
    // 6. Mostrar SQL por si necesitas ejecutarlo manualmente
    console.log('\n📝 SQL para ejecutar manualmente (por si acaso):');
    console.log('==================================================');
    console.log(`UPDATE usuarios SET password_hash = '${nuevoHash}' WHERE email = '${EMAIL}';`);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

actualizarDocente();