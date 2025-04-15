//middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Verifica si el token JWT es válido
 */
exports.auth = (req, res, next) => {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar usuario al request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

/**
 * Verifica si el usuario tiene rol de superadmin
 */
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de superadministrador' });
  }
  next();
};

/**
 * Verifica si el usuario tiene rol de administrador SEDES
 */
exports.isSedesAdmin = (req, res, next) => {
  if (req.user.role !== 'sedes_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador SEDES' });
  }
  next();
};

/**
 * Verifica si el usuario tiene rol de administrador de hospital
 */
exports.isHospitalAdmin = (req, res, next) => {
  if (req.user.role !== 'hospital_admin' && req.user.role !== 'sedes_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador de hospital' });
  }
  next();
};

/**
 * Verifica si el usuario tiene rol de administrador (original para compatibilidad)
 */
exports.isAdmin = (req, res, next) => {
  if (!['admin', 'sedes_admin', 'hospital_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
  }
  next();
};

/**
 * Verifica si el usuario tiene rol médico o administrativo
 */
exports.isMedicalStaff = (req, res, next) => {
  if (!['doctor', 'nurse', 'admin', 'sedes_admin', 'hospital_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere personal médico o administrativo' });
  }
  next();
};