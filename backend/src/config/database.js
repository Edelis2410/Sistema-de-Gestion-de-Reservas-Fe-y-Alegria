// src/config/database.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  errorFormat: 'pretty'
});

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(' Conectado a la base de datos PostgreSQL: sistema_reservas_colegio');
  } catch (error) {
    console.error(' Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };