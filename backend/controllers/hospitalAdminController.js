// controllers/hospitalAdminController.js
const bcryptjs = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Genera una contraseña aleatoria
 * @param {number} length - Longitud de la contraseña
 * @returns {string} - Contraseña generada
 */
const generateRandomPassword = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

/**
 * Envía credenciales por correo electrónico
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<boolean>} - True si se envió correctamente
 */
const sendCredentialsByEmail = async (userData) => {
  try {
    const { email, username, password, hospital_name } = userData;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Credenciales de acceso - Administrador de Hospital - Sistema SEDES Tuberculosis',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c3e50;">SEDES Cochabamba</h2>
            <p style="color: #7f8c8d;">Sistema de Transferencia de Pacientes con Tuberculosis</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">Bienvenido/a, Administrador de Hospital</h3>
            <p>Se ha creado una cuenta para administrar el hospital: <strong>${hospital_name}</strong>.</p>
            <p>Tus credenciales de acceso son:</p>
            <ul style="list-style-type: none; padding-left: 10px;">
              <li><strong>Usuario:</strong> ${username}</li>
              <li><strong>Contraseña:</strong> ${password}</li>
            </ul>
            <p><strong>Importante:</strong> Por seguridad, deberás cambiar tu contraseña en el primer inicio de sesión.</p>
          </div>
          
          <div style="font-size: 14px; color: #7f8c8d; text-align: center;">
            <p>Este es un mensaje automático, por favor no responder.</p>
            <p>© ${new Date().getFullYear()} SEDES Cochabamba - Programa de Tuberculosis</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return false;
  }
};

/**
 * Obtener todos los administradores de hospital
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getAllHospitalAdmins = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT u.id, u.username, u.email, h.name as hospital_name, 
              u.created_at, u.last_login, u.status
       FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN hospitals h ON u.hospital_id = h.id
       WHERE r.name = 'hospital_admin' AND u.status = 1
       ORDER BY u.created_at DESC`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener administradores de hospital:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Obtener administrador de hospital por ID
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getHospitalAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.promise().query(
      `SELECT u.id, u.username, u.email, u.hospital_id, h.name as hospital_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN hospitals h ON u.hospital_id = h.id
       WHERE u.id = ? AND r.name = 'hospital_admin' AND u.status = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Administrador de hospital no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener administrador de hospital:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Crear nuevo administrador de hospital
 * @param {Request} req 
 * @param {Response} res 
 */
exports.createHospitalAdmin = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query('START TRANSACTION');
    
    const { username, email, hospital_id } = req.body;
    
    // Validación básica
    if (!username || !email || !hospital_id) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ 
        message: 'Nombre de usuario, email y hospital son obligatorios' 
      });
    }
    
    // Verificar si el correo ya existe
    const [existingEmail] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND status = 1',
      [email]
    );
    
    if (existingEmail.length > 0) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }
    
    // Verificar si el hospital existe
    const [hospital] = await db.promise().query(
      'SELECT name FROM hospitals WHERE id = ? AND status = 1',
      [hospital_id]
    );
    
    if (hospital.length === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ message: 'Hospital no encontrado' });
    }
    
    // Verificar si ya existe un admin para este hospital
    const [existingAdmin] = await db.promise().query(
      `SELECT u.id FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.hospital_id = ? AND r.name = 'hospital_admin' AND u.status = 1`,
      [hospital_id]
    );
    
    if (existingAdmin.length > 0) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ message: 'Este hospital ya tiene un administrador asignado' });
    }
    
    // Obtener el ID del rol hospital_admin
    const [roles] = await db.promise().query(
      "SELECT id FROM roles WHERE name = 'hospital_admin'"
    );
    
    if (roles.length === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(500).json({ message: 'Rol de administrador de hospital no encontrado' });
    }
    
    const roleId = roles[0].id;
    
    // Generar contraseña aleatoria
    const randomPassword = generateRandomPassword();
    
    // Hash de la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(randomPassword, salt);
    
    // Insertar usuario administrador de hospital
    const [result] = await db.promise().query(
      `INSERT INTO users (username, email, password, role_id, hospital_id, status)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [username, email, hashedPassword, roleId, hospital_id]
    );
    
    // Enviar credenciales por email
    await sendCredentialsByEmail({
      email,
      username,
      password: randomPassword,
      hospital_name: hospital[0].name
    });
    
    await db.promise().query('COMMIT');
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Administrador de hospital creado correctamente'
    });
    
  } catch (error) {
    await db.promise().query('ROLLBACK');
    console.error('Error al crear administrador de hospital:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Actualizar administrador de hospital
 * @param {Request} req 
 * @param {Response} res 
 */
exports.updateHospitalAdmin = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query('START TRANSACTION');
    
    const { id } = req.params;
    const { username, email } = req.body;
    
    // Validación básica
    if (!username || !email) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ 
        message: 'Nombre de usuario y email son obligatorios' 
      });
    }
    
    // Verificar si existe el administrador
    const [admin] = await db.promise().query(
      `SELECT u.id FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND r.name = 'hospital_admin' AND u.status = 1`,
      [id]
    );
    
    if (admin.length === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(404).json({ message: 'Administrador de hospital no encontrado' });
    }
    
    // Verificar si el nuevo email ya existe en otro usuario
    const [existingEmail] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND id != ? AND status = 1',
      [email, id]
    );
    
    if (existingEmail.length > 0) {
      await db.promise().query('ROLLBACK');
      return res.status(400).json({ message: 'Este correo ya está registrado para otro usuario' });
    }
    
    // Actualizar administrador
    await db.promise().query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, id]
    );
    
    await db.promise().query('COMMIT');
    
    res.json({ 
      message: 'Administrador de hospital actualizado correctamente' 
    });
    
  } catch (error) {
    await db.promise().query('ROLLBACK');
    console.error('Error al actualizar administrador de hospital:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Eliminar administrador de hospital (eliminación lógica)
 * @param {Request} req 
 * @param {Response} res 
 */
exports.deleteHospitalAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const [admin] = await db.promise().query(
      `SELECT u.id FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND r.name = 'hospital_admin' AND u.status = 1`,
      [id]
    );
    
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Administrador de hospital no encontrado' });
    }
    
    // Eliminar lógicamente
    await db.promise().query(
      'UPDATE users SET status = 0 WHERE id = ?',
      [id]
    );
    
    res.json({ 
      message: 'Administrador de hospital eliminado correctamente' 
    });
    
  } catch (error) {
    console.error('Error al eliminar administrador de hospital:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Resetear contraseña de administrador de hospital
 * @param {Request} req 
 * @param {Response} res 
 */
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe
    const [rows] = await db.promise().query(
      `SELECT u.id, u.username, u.email, h.name as hospital_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN hospitals h ON u.hospital_id = h.id
       WHERE u.id = ? AND r.name = 'hospital_admin' AND u.status = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Administrador de hospital no encontrado' });
    }
    
    // Generar nueva contraseña aleatoria
    const randomPassword = generateRandomPassword();
    
    // Hash de la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(randomPassword, salt);
    
    // Actualizar contraseña
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    // Enviar nuevas credenciales por email
    await sendCredentialsByEmail({
      email: rows[0].email,
      username: rows[0].username,
      password: randomPassword,
      hospital_name: rows[0].hospital_name
    });
    
    res.json({ message: 'Contraseña restablecida y enviada por correo' });
    
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};