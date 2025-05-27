//controllers/authController.js
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ⭐ CORREGIDO: createTransport (sin la 's')
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * ⭐ FUNCIÓN AUXILIAR: Ejecutar consulta con reintentos
 */
const executeQuery = async (query, params, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [results] = await db.promise().query(query, params);
      return results;
    } catch (error) {
      console.error(`❌ Intento ${attempt}/${maxRetries} falló:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Esperar antes del siguiente intento (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

/**
 * Login de usuario
 * @param {Request} req 
 * @param {Response} res 
 */
exports.login = async (req, res) => {
  try {
    console.log('🔐 Intento de login para:', req.body.identifier);
    const { identifier, password } = req.body;

    // ⭐ MEJORADO: Usar función con reintentos
    const users = await executeQuery(
      `SELECT u.*, r.name as role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE (u.email = ? OR u.username = ?) AND u.status = 1`,
      [identifier, identifier]
    );

    if (users.length === 0) {
      console.log('❌ Usuario no encontrado:', identifier);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = users[0];
    console.log('👤 Usuario encontrado:', user.username, 'Role:', user.role_name);

    // Verificar la contraseña
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta para:', user.username);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Determinar si es primer inicio de sesión
    const firstLogin = user.last_login === null;
    console.log('🆕 Primer login?', firstLogin);

    // Solo actualizar último login si no es primer inicio
    if (!firstLogin) {
      try {
        await executeQuery(
          'UPDATE users SET last_login = NOW() WHERE id = ?',
          [user.id]
        );
        console.log('📅 Last login actualizado para:', user.username);
      } catch (updateError) {
        console.error('⚠️ Error al actualizar last_login:', updateError.message);
        // No fallar el login por esto
      }
    }

    // Generar token JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_name,
        hospital_id: user.hospital_id,
        password_change_required: firstLogin
      }
    };
    
    // Firmar el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
      (err, token) => {
        if (err) {
          console.error('❌ Error al generar JWT:', err.message);
          return res.status(500).json({ message: 'Error en el servidor' });
        }
        console.log('✅ Login exitoso para:', user.username);
        res.json({ token, password_change_required: firstLogin });
      }
    );
  } catch (error) {
    console.error('💥 Error en login:', error.message);
    console.error('📍 Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener información del usuario autenticado
 * @param {Request} req 
 * @param {Response} res 
 */
exports.getUser = async (req, res) => {
  try {
    console.log('👤 Obteniendo información del usuario:', req.user.id);
    
    // ⭐ MEJORADO: Usar función con reintentos
    const users = await executeQuery(
      `SELECT u.id, u.username, u.email, r.name as role, h.name as hospital, h.id as hospital_id,
              s.first_name, s.last_name, s.specialty, u.last_login
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN hospitals h ON u.hospital_id = h.id
       LEFT JOIN staff s ON u.id = s.user_id
       WHERE u.id = ? AND u.status = 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      console.log('❌ Usuario no encontrado en getUser:', req.user.id);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agregar bandera de cambio de contraseña
    const userData = {
      ...users[0],
      password_change_required: req.user.password_change_required // Tomar del token JWT
    };

    console.log('✅ Información de usuario obtenida:', userData.username);
    res.json(userData);
  } catch (error) {
    console.error('💥 Error al obtener usuario:', error.message);
    res.status(500).json({ 
      message: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Solicitar recuperación de contraseña
 * @param {Request} req 
 * @param {Response} res 
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    console.log('🔑 Solicitud de recuperación de contraseña para:', identifier);

    if (!identifier) {
      return res.status(400).json({ message: 'Por favor proporcione un correo electrónico o nombre de usuario' });
    }

    // ⭐ MEJORADO: Usar función con reintentos
    const users = await executeQuery(
      'SELECT id, email, username FROM users WHERE (email = ? OR username = ?) AND status = 1',
      [identifier, identifier]
    );

    // Por seguridad, no revelar si el usuario existe o no
    if (users.length === 0) {
      console.log('⚠️ Usuario no encontrado para recuperación:', identifier);
      return res.status(200).json({ message: 'Si el usuario existe, se enviará un correo con instrucciones para restablecer la contraseña' });
    }

    const user = users[0];
    console.log('👤 Usuario encontrado para recuperación:', user.username);
    
    // Generar token único para restablecimiento (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
    
    // Almacenar token en la base de datos
    await executeQuery(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );
    
    console.log('🔐 Token de recuperación generado para:', user.username);
    
    // URL del frontend para restablecer contraseña
    const frontendResetPageUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Enviar correo con enlace de restablecimiento
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperación de contraseña - SEDES Tuberculosis',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2c3e50;">SEDES Cochabamba</h2>
            <p style="color: #7f8c8d;">Sistema de Transferencia de Pacientes con Tuberculosis</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">Recuperación de contraseña</h3>
            <p>Hola ${user.username},</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
            <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${frontendResetPageUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
            </div>
            <p>Este enlace es válido por 1 hora. Después de ese tiempo, deberás solicitar un nuevo enlace de recuperación.</p>
          </div>
          
          <div style="font-size: 14px; color: #7f8c8d; text-align: center;">
            <p>Este es un mensaje automático, por favor no responder.</p>
            <p>© ${new Date().getFullYear()} SEDES Cochabamba - Programa de Tuberculosis</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('📧 Correo de recuperación enviado a:', user.email);
    
    res.status(200).json({ message: 'Si el usuario existe, se enviará un correo con instrucciones para restablecer la contraseña' });
    
  } catch (error) {
    console.error('💥 Error en recuperación de contraseña:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

/**
 * Verificar token de restablecimiento de contraseña
 * @param {Request} req 
 * @param {Response} res 
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('🔍 Verificando token de reset:', token.substring(0, 8) + '...');
    
    // ⭐ MEJORADO: Usar función con reintentos
    const users = await executeQuery(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW() AND status = 1',
      [token]
    );
    
    if (users.length === 0) {
      console.log('❌ Token inválido o expirado');
      return res.status(400).json({ message: 'El token no es válido o ha expirado' });
    }
    
    console.log('✅ Token válido para usuario ID:', users[0].id);
    res.status(200).json({ valid: true });
    
  } catch (error) {
    console.error('💥 Error al verificar token:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Restablecer contraseña con token
 * @param {Request} req 
 * @param {Response} res 
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log('🔄 Restableciendo contraseña con token:', token.substring(0, 8) + '...');
    
    if (!token || !password) {
      return res.status(400).json({ message: 'El token y la contraseña son obligatorios' });
    }
    
    // ⭐ MEJORADO: Usar función con reintentos
    const users = await executeQuery(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW() AND status = 1',
      [token]
    );
    
    if (users.length === 0) {
      console.log('❌ Token inválido o expirado para reset');
      return res.status(400).json({ message: 'El token no es válido o ha expirado' });
    }
    
    const userId = users[0].id;
    
    // Validar complejidad de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log('❌ Contraseña no cumple con requisitos de complejidad');
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y caracteres especiales' 
      });
    }
    
    // Encriptar nueva contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    // Actualizar contraseña y limpiar token
    await executeQuery(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL, last_login = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );
    
    console.log('✅ Contraseña restablecida exitosamente para usuario ID:', userId);
    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    
  } catch (error) {
    console.error('💥 Error al restablecer contraseña:', error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};