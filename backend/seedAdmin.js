// seedAdmin.js
const bcryptjs = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedAdminUser() {
  console.log('Iniciando creación de usuario administrador...');
  
  let connection;
  
  try {
    // Establecer conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('Conexión a la base de datos establecida');
    
    // Verificar si ya existe un usuario admin
    const [existingAdmins] = await connection.query(`
      SELECT u.* FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE r.name = 'admin' AND u.status = 1
    `);
    
    if (existingAdmins.length > 0) {
      console.log('Ya existe un usuario administrador. No se creará otro.');
      console.log('Email del administrador existente:', existingAdmins[0].email);
      return;
    }
    
    // Obtener el ID del rol admin
    const [adminRoles] = await connection.query("SELECT id FROM roles WHERE name = 'admin'");
    
    if (adminRoles.length === 0) {
      console.log('Error: No se encontró el rol de administrador en la base de datos.');
      console.log('Por favor, asegúrate de que la tabla "roles" tenga un registro con name="admin"');
      return;
    }
    
    const adminRoleId = adminRoles[0].id;
    
    // Datos del usuario administrador
    const adminData = {
      username: 'admin',
      email: 'admin@sedes.gob.bo',
      password: 'Sedes2025', // Esta contraseña será hasheada
      role_id: adminRoleId,
      hospital_id: null // El admin no está asignado a un hospital específico
    };
    
    // Hashear la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(adminData.password, salt);
    
    // Insertar el usuario administrador
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password, role_id, hospital_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [adminData.username, adminData.email, hashedPassword, adminData.role_id, adminData.hospital_id]
    );
    
    console.log('¡Usuario administrador creado exitosamente!');
    console.log('ID:', result.insertId);
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Contraseña:', adminData.password, '(almacenada de forma segura como hash)');
    console.log('\nPuedes iniciar sesión con estas credenciales en el sistema.');
    
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar la función
seedAdminUser();