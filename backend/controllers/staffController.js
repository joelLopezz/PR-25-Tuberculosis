// controllers/staffController.js
const db = require("../config/db");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Genera una contraseña aleatoria
 * @param {number} length - Longitud de la contraseña
 * @returns {string} - Contraseña generada
 */
const generateRandomPassword = (length = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
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
    const { email, username, password, first_name, last_name } = userData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Credenciales de acceso - Sistema SEDES Tuberculosis",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c3e50;">SEDES Cochabamba</h2>
            <p style="color: #7f8c8d;">Sistema de Transferencia de Pacientes con Tuberculosis</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">Bienvenido/a, ${first_name} ${last_name}</h3>
            <p>Se ha creado una cuenta para que puedas acceder al sistema.</p>
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
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
};

/**
 * Obtener todos los miembros del personal
 * @param {Request} req
 * @param {Response} res
 */
// Modificar la función getAllStaff en controllers/staffController.js
// Añadir esta función actualizada:

exports.getAllStaff = async (req, res) => {
  try {
    // Construir la consulta base - MODIFICADA PARA INCLUIR hospital_id
    let query = `
      SELECT s.id, s.first_name, s.last_name, s.ci, s.specialty, s.phone, 
            s.address, h.name as hospital_name, s.hospital_id, 
            CASE WHEN u.id IS NOT NULL THEN 1 ELSE 0 END as has_user
      FROM staff s
      JOIN hospitals h ON s.hospital_id = h.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.status = 1
    `;
    
    const queryParams = [];
    
    // Si es administrador de hospital, mostrar solo personal de su hospital
    if (req.user.role === 'hospital_admin') {
      query += " AND s.hospital_id = ?";
      queryParams.push(req.user.hospital_id);
    }
    
    // Agregar ordenamiento
    query += " ORDER BY s.last_name, s.first_name";
    
    // Ejecutar la consulta
    const [rows] = await db.promise().query(query, queryParams);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Obtener miembro del personal por ID
 * @param {Request} req
 * @param {Response} res
 */
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.promise().query(
      `SELECT s.id, s.first_name, s.last_name, s.ci, s.specialty, s.phone, 
              s.address, s.hospital_id, 
              CASE WHEN u.id IS NOT NULL THEN 1 ELSE 0 END as has_user,
              u.email, u.username, u.role_id
       FROM staff s
       JOIN hospitals h ON s.hospital_id = h.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.status = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Personal no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener personal por ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
/**
 * Crear nuevo miembro del personal
 * @param {Request} req
 * @param {Response} res
 */
exports.createStaff = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query("START TRANSACTION");

    const {
      first_name,
      last_name,
      ci,
      specialty,
      phone,
      address,
      hospital_id,
      create_user,
      email,
      role_id,
    } = req.body;

    // Validación básica
    if (!first_name || !last_name || !ci || !hospital_id) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({
        message: "Nombre, apellido, CI y hospital son obligatorios",
      });
    }

    // Verificar si la CI ya existe
    const [existingCI] = await db
      .promise()
      .query("SELECT id FROM staff WHERE ci = ? AND status = 1", [ci]);

    if (existingCI.length > 0) {
      await db.promise().query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Ya existe personal con esta CI" });
    }

    let userId = null;

    // Si se solicita crear usuario
    if (create_user) {
      // Validación para usuario
      if (!email || !role_id) {
        await db.promise().query("ROLLBACK");
        return res.status(400).json({
          message: "Email y rol son obligatorios para crear usuario",
        });
      }

      // Verificar si el correo ya existe
      const [existingEmail] = await db
        .promise()
        .query("SELECT id FROM users WHERE email = ? AND status = 1", [email]);

      if (existingEmail.length > 0) {
        await db.promise().query("ROLLBACK");
        return res
          .status(400)
          .json({ message: "Este correo ya está registrado" });
      }

      // Generar username (inicial del nombre + apellido, todo en minúsculas)
      const username = (first_name.charAt(0) + last_name)
        .toLowerCase()
        .replace(/\s+/g, "") // eliminar espacios
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // eliminar acentos

      // Generar contraseña aleatoria
      const randomPassword = generateRandomPassword();

      // Hash de la contraseña
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(randomPassword, salt);

      // Insertar usuario
      const [userResult] = await db.promise().query(
        `INSERT INTO users (username, email, password, role_id, hospital_id, status)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [username, email, hashedPassword, role_id, hospital_id]
      );

      userId = userResult.insertId;

      // Enviar credenciales por email
      await sendCredentialsByEmail({
        email,
        username,
        password: randomPassword,
        first_name,
        last_name,
      });
    }

    // Insertar miembro del personal
    const [staffResult] = await db.promise().query(
      `INSERT INTO staff 
        (first_name, last_name, ci, specialty, phone, address, hospital_id, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        first_name,
        last_name,
        ci,
        specialty,
        phone,
        address,
        hospital_id,
        userId,
      ]
    );

    // Si se creó usuario y hay un error al crear el staff, hacer rollback
    if (userId && !staffResult.insertId) {
      await db.promise().query("ROLLBACK");
      return res.status(500).json({ message: "Error al crear personal" });
    }

    await db.promise().query("COMMIT");

    res.status(201).json({
      id: staffResult.insertId,
      message: "Personal creado correctamente",
      user_created: create_user ? true : false,
    });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Error al crear personal:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Actualizar miembro del personal
 * @param {Request} req
 * @param {Response} res
 */
exports.updateStaff = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query("START TRANSACTION");

    const { id } = req.params;
    const {
      first_name,
      last_name,
      ci,
      specialty,
      phone,
      address,
      hospital_id,
      email,
      create_user,
      role_id, // Añadir estos campos
    } = req.body;

    // Validación básica
    if (!first_name || !last_name || !ci || !hospital_id) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({
        message: "Nombre, apellido, CI y hospital son obligatorios",
      });
    }

    // Verificar si la CI ya existe en otro registro
    const [existingCI] = await db
      .promise()
      .query("SELECT id FROM staff WHERE ci = ? AND id != ? AND status = 1", [
        ci,
        id,
      ]);

    if (existingCI.length > 0) {
      await db.promise().query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Ya existe personal con esta CI" });
    }

    // Verificar si el staff ya tiene usuario asociado
    const [staffData] = await db
      .promise()
      .query("SELECT user_id FROM staff WHERE id = ? AND status = 1", [id]);

    if (staffData.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: "Personal no encontrado" });
    }

    const hasUser = staffData[0].user_id !== null;
    let userId = staffData[0].user_id;

    // Si no tiene usuario y se solicita crear uno
    if (!hasUser && create_user) {
      // Validación para usuario
      if (!email || !role_id) {
        await db.promise().query("ROLLBACK");
        return res.status(400).json({
          message: "Email y rol son obligatorios para crear usuario",
        });
      }

      // Verificar si el correo ya existe
      const [existingEmail] = await db
        .promise()
        .query("SELECT id FROM users WHERE email = ? AND status = 1", [email]);

      if (existingEmail.length > 0) {
        await db.promise().query("ROLLBACK");
        return res
          .status(400)
          .json({ message: "Este correo ya está registrado" });
      }

      // Generar username (inicial del nombre + apellido, todo en minúsculas)
      const username = (first_name.charAt(0) + last_name)
        .toLowerCase()
        .replace(/\s+/g, "") // eliminar espacios
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // eliminar acentos

      // Generar contraseña aleatoria
      const randomPassword = generateRandomPassword();

      // Hash de la contraseña
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(randomPassword, salt);

      // Insertar usuario
      const [userResult] = await db.promise().query(
        `INSERT INTO users (username, email, password, role_id, hospital_id, status)
           VALUES (?, ?, ?, ?, ?, 1)`,
        [username, email, hashedPassword, role_id, hospital_id]
      );

      userId = userResult.insertId;

      // Enviar credenciales por email
      await sendCredentialsByEmail({
        email,
        username,
        password: randomPassword,
        first_name,
        last_name,
      });
    }

    // Actualizar miembro del personal
    await db.promise().query(
      `UPDATE staff 
         SET first_name = ?, last_name = ?, ci = ?, specialty = ?, 
             phone = ?, address = ?, hospital_id = ?, user_id = ?
         WHERE id = ? AND status = 1`,
      [
        first_name,
        last_name,
        ci,
        specialty,
        phone,
        address,
        hospital_id,
        userId,
        id,
      ]
    );

    // Si ya tiene usuario asociado y se proporcionó email, actualizar el email
    if (hasUser) {
      // Verificar si el nuevo email ya existe en otro usuario
      if (email) {
        const [existingEmail] = await db
          .promise()
          .query(
            "SELECT id FROM users WHERE email = ? AND id != ? AND status = 1",
            [email, userId]
          );

        if (existingEmail.length > 0) {
          await db.promise().query("ROLLBACK");
          return res
            .status(400)
            .json({
              message: "Este correo ya está registrado para otro usuario",
            });
        }

        // Actualizar email y rol del usuario
        await db
          .promise()
          .query(
            "UPDATE users SET email = ?, role_id = ? WHERE id = ? AND status = 1",
            [email, role_id, userId]
          );
      } else if (role_id) {
        // Si solo se actualiza el rol pero no el email
        await db
          .promise()
          .query("UPDATE users SET role_id = ? WHERE id = ? AND status = 1", [
            role_id,
            userId,
          ]);
      }
    }

    await db.promise().query("COMMIT");

    res.json({
      message: "Personal actualizado correctamente",
      user_created: !hasUser && create_user ? true : false,
    });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Error al actualizar personal:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Eliminar miembro del personal (eliminación lógica)
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteStaff = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query("START TRANSACTION");

    const { id } = req.params;

    // Verificar si existe
    const [staff] = await db
      .promise()
      .query("SELECT user_id FROM staff WHERE id = ? AND status = 1", [id]);

    if (staff.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: "Personal no encontrado" });
    }

    // Eliminar lógicamente al miembro del personal
    await db.promise().query("UPDATE staff SET status = 0 WHERE id = ?", [id]);

    // Si tiene usuario asociado, eliminarlo lógicamente también
    if (staff[0].user_id) {
      await db
        .promise()
        .query("UPDATE users SET status = 0 WHERE id = ?", [staff[0].user_id]);
    }

    await db.promise().query("COMMIT");

    res.json({
      message: "Personal eliminado correctamente",
    });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error("Error al eliminar personal:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Resetear contraseña de usuario
 * @param {Request} req
 * @param {Response} res
 */
exports.resetPassword = async (req, res) => {
  try {
    const { staff_id } = req.params;

    // Verificar si existe el personal y tiene usuario asociado
    const [staff] = await db.promise().query(
      `SELECT s.user_id, s.first_name, s.last_name, u.email, u.username 
       FROM staff s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.status = 1 AND u.status = 1`,
      [staff_id]
    );

    if (staff.length === 0 || !staff[0].user_id) {
      return res.status(404).json({
        message: "Personal no encontrado o no tiene usuario asociado",
      });
    }

    const userId = staff[0].user_id;

    // Generar nueva contraseña aleatoria
    const randomPassword = generateRandomPassword();

    // Hash de la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(randomPassword, salt);

    // Actualizar contraseña
    await db
      .promise()
      .query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);

    // Enviar nuevas credenciales por email
    await sendCredentialsByEmail({
      email: staff[0].email,
      username: staff[0].username,
      password: randomPassword,
      first_name: staff[0].first_name,
      last_name: staff[0].last_name,
    });

    res.json({ message: "Contraseña restablecida y enviada por correo" });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Cambiar contraseña del usuario
 * @param {Request} req
 * @param {Response} res
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Validación básica
    if (!current_password || !new_password) {
      return res.status(400).json({
        message: "La contraseña actual y la nueva son obligatorias",
      });
    }

    // Verificar que la nueva contraseña sea segura
    if (new_password.length < 8) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    // Obtener usuario actual
    const [users] = await db
      .promise()
      .query("SELECT password FROM users WHERE id = ? AND status = 1", [
        userId,
      ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    const isMatch = await bcryptjs.compare(current_password, users[0].password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "La contraseña actual es incorrecta" });
    }

    // Hash de la nueva contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(new_password, salt);

    // Actualizar contraseña
    await db
      .promise()
      .query("UPDATE users SET password = ?, last_login = NOW() WHERE id = ?", [
        hashedPassword,
        userId,
      ]);

    res.json({
      message: "Contraseña actualizada correctamente",
      password_change_required: false,
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
