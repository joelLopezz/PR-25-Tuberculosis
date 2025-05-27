// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  
  // ⭐ OPCIONES VÁLIDAS PARA POOL
  waitForConnections: true,        
  connectionLimit: 10,             
  queueLimit: 0,                   
  
  // ⭐ CAMBIO AQUÍ: Deshabilitar SSL explícitamente (ya lo tenías así, solo para confirmar)
  ssl: false, 
  
  // ⭐ CONFIGURACIONES ADICIONALES VÁLIDAS
  multipleStatements: false,       
  namedPlaceholders: false,        
  charset: 'utf8mb4',             
  timezone: 'local'               
});

// ⭐ MANEJO DE EVENTOS DEL POOL
pool.on('connection', function (connection) {
  console.log('✅ Nueva conexión MySQL establecida como id ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('❌ Error en el pool de conexiones MySQL:', err.message);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Conexión perdida, el pool la reemplazará automáticamente...');
  } else {
    console.error('💥 Error crítico en pool MySQL:', err);
  }
});

// ⭐ FUNCIÓN PARA PROBAR LA CONEXIÓN
const testConnection = async () => {
  try {
    // ⭐⭐ CAMBIO CLAVE AQUÍ: Usamos una consulta simple 'SELECT 1' para verificar la conexión
    const [rows] = await pool.promise().query('SELECT 1');
    console.log('✅ Conexión a la base de datos MySQL exitosa');
    // Ya no necesitamos la hora del servidor para la prueba básica de conexión
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    console.error('🔍 Detalles:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    return false;
  }
};

// ⭐ PROBAR CONEXIÓN AL INICIAR
testConnection();

// ⭐ MANTENER LA CONEXIÓN VIVA CON PING PERIÓDICO (cada 5 minutos)
setInterval(async () => {
  try {
    await pool.promise().query('SELECT 1');
    console.log('🔄 Ping a base de datos - conexión activa');
  } catch (error) {
    console.error('⚠️ Error en ping a base de datos:', error.message);
  }
}, 300000); // 300000ms = 5 minutos

module.exports = pool;