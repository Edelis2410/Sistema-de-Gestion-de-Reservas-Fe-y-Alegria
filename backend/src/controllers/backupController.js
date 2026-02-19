// backend/src/controllers/backupController.js
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { enviarCorreoConAdjunto } = require('../utils/mailer');

const generateBackup = async (req, res) => {
  let tempFile;
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return res.status(500).json({ error: 'DATABASE_URL no configurada' });
    }

    // Crear archivo temporal
    const tempDir = os.tmpdir();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const filename = `backup_${year}-${month}-${day}_${hours}-${minutes}.sql`;
    tempFile = path.join(tempDir, filename);

    // Ruta a pg_dump (ajústala si es necesario)
    const pgDumpPath = 'C:\\Archivos de programa\\PostgreSQL\\17\\bin\\pg_dump.exe';

    // Ejecutar pg_dump y escribir en archivo temporal
    const pgDump = spawn(pgDumpPath, [
      `--dbname=${databaseUrl}`,
      '--clean',
      '--if-exists',
      '--no-owner',
      '--no-privileges'
    ]);

    const writeStream = fs.createWriteStream(tempFile);
    pgDump.stdout.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      pgDump.stderr.on('data', (data) => {
        console.error('pg_dump error:', data.toString());
      });
      pgDump.on('error', reject);
    });

    // Enviar correo al administrador autenticado
    await enviarCorreoConAdjunto({
      to: req.user.email, // Correo del admin logueado
      subject: 'Backup de la base de datos',
      text: 'Se ha generado una copia de seguridad de la base de datos a su solicitud. El archivo se adjunta a este correo.',
      attachments: [
        {
          filename: filename,
          path: tempFile
        }
      ]
    });

    // Ahora enviar el archivo como descarga
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/sql');
    
    const fileStream = fs.createReadStream(tempFile);
    fileStream.pipe(res);

    fileStream.on('close', () => {
      // Eliminar archivo temporal después de enviar
      fs.unlink(tempFile, (err) => {
        if (err) console.error('Error al eliminar archivo temporal:', err);
      });
    });

  } catch (error) {
    console.error('Error en generateBackup:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error interno al generar el backup' });
    }
    // Limpiar archivo temporal si existe
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
};


module.exports = { generateBackup };