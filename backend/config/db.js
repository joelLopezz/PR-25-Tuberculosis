// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// ⭐ SOLUCION: Usar pool de conexiones en lugar de conexión única
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  
  // ⭐ CONFIGURACIONES IMPORTANTES PARA RENDER/CLOUD
  waitForConnections: true,
  connectionLimit: 10,          // Máximo 10 conexiones simultáneas
  queueLimit: 0,               // Sin límite de cola
  acquireTimeout: 60000,       // 60 segundos para obtener conexión
  timeout: 60000,              // 60 segundos timeout por consulta
  reconnect: true,             // Reconectar automáticamente
  
  // ⭐ CONFIGURACIONES PARA MANTENER CONEXIÓN VIVA
  keepAliveInitialDelay: 0,
  enableKeepAlive: true,
  
  // ⭐ CONFIGURACIONES SSL (importante para bases de datos remotas)
  ssl: {
    rejectUnauthorized: false  // Para evitar problemas de certificados
  }
});

// ⭐ MANEJO DE EVENTOS DEL POOL
pool.on('connection', function (connection) {
  console.log('Nueva conexión establecida como id ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('Error en el pool de conexiones MySQL:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Conexión perdida, reconectando...');
  } else {
    throw err;
  }
});

// ⭐ FUNCIÓN PARA PROBAR LA CONEXIÓN
const testConnection = async () => {
  try {
    const [rows] = await pool.promise().query('SELECT 1 as test');
    console.log('✅ Conexión a la base de datos MySQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    return false;
  }
};

// ⭐ PROBAR CONEXIÓN AL INICIAR
testConnection();

// ⭐ MANTENER LA CONEXIÓN VIVA CON PING PERIÓDICO
setInterval(async () => {
  try {
    await pool.promise().query('SELECT 1');
    console.log('🔄 Ping a base de datos - conexión activa');
  } catch (error) {
    console.error('⚠️ Error en ping a base de datos:', error.message);
  }
}, 300000); // Cada 5 minutos

module.exports = pool;