// controllers/userController.js
const bcryptjs = require('bcryptjs');
const db = require('../config/db');

/**
 * Obtiene lista de usuarios con información adicional
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query(
      `SELECT u.id, u.username, u.email, r.name as role, h.name as hospital, 
              CONCAT(s.first_name, ' ', s.last_name) as staff_name, 
              u.created_at, u.last_login, u.status
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN hospitals h ON u.hospital_id = h.id
       LEFT JOIN staff s ON u.id = s.user_id
       WHERE u.status = 1
       ORDER BY u.created_at DESC`
    );

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Crea un nuevo usuario en el sistema
 */
exports.createUser = async (req, res) => {
  const { username, email, password, role_id, hospital_id } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'El usuario ya existe con ese email o nombre de usuario' 
      });
    }

    // Encriptar contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Insertar usuario
    const [result] = await db.promise().query(
      'INSERT INTO users (username, email, password, role_id, hospital_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role_id, hospital_id]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user_id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Actualiza información de un usuario existente
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role_id, hospital_id, status } = req.body;

  try {
    // Actualizar usuario
    await db.promise().query(
      'UPDATE users SET username = ?, email = ?, role_id = ?, hospital_id = ?, status = ? WHERE id = ?',
      [username, email, role_id, hospital_id, status, id]
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Cambia la contraseña de un usuario
 */
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // Encriptar nueva contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Actualizar contraseña
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Elimina lógicamente un usuario (status = 0)
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(
      'UPDATE users SET status = 0 WHERE id = ?',
      [id]
    );

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};