// controllers/patientController.js
const db = require("../config/db");

/**
 * Formatea una fecha en formato ISO a formato MySQL (YYYY-MM-DD)
 * @param {string} dateString - Fecha en formato ISO o cualquier formato válido
 * @returns {string|null} - Fecha formateada o null si no hay fecha
 */
const formatDateForMySQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extrae solo la parte YYYY-MM-DD
  };

/**
 * Obtener todos los pacientes (filtrados por hospital del usuario)
 * @param {Request} req
 * @param {Response} res
 */
exports.getAllPatients = async (req, res) => {
  try {
    let query = `
      SELECT p.*, h.name as hospital_name 
      FROM patients p
      JOIN hospitals h ON p.hospital_id = h.id
      WHERE p.status = 1
    `;
    
    const queryParams = [];
    
    // Si no es admin o sedes_admin, filtrar por el hospital del usuario
    if (!['admin', 'sedes_admin'].includes(req.user.role)) {
      query += " AND p.hospital_id = ?";
      queryParams.push(req.user.hospital_id);
    }
    
    // Orden: los más recientes primero
    query += " ORDER BY p.created_at DESC";
    
    const [patients] = await db.promise().query(query, queryParams);
    
    res.json(patients);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Obtener un paciente por ID
 * @param {Request} req
 * @param {Response} res
 */
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT p.*, h.name as hospital_name 
      FROM patients p
      JOIN hospitals h ON p.hospital_id = h.id
      WHERE p.id = ? AND p.status = 1
    `;
    
    const [patients] = await db.promise().query(query, [id]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Si no es admin o sedes_admin, verificar que el paciente pertenezca al hospital del usuario
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        patients[0].hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para ver este paciente' });
    }
    
    res.json(patients[0]);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Crear un nuevo paciente
 * @param {Request} req
 * @param {Response} res
 */
exports.createPatient = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      ci,
      birthdate,
      gender,
      phone,
      address,
      diagnosis_date,
      tb_type,
    } = req.body;
    
    // Validación básica
    if (!first_name || !last_name || !birthdate || !gender || !tb_type) {
      return res.status(400).json({
        message: 'Datos incompletos. Por favor proporcione todos los campos requeridos.'
      });
    }
    
    // Si se proporciona CI, verificar que no exista ya
    if (ci) {
      const [existingPatient] = await db.promise().query(
        'SELECT id FROM patients WHERE ci = ? AND status = 1',
        [ci]
      );
      
      if (existingPatient.length > 0) {
        return res.status(400).json({ message: 'Ya existe un paciente con este CI' });
      }
    }
    
    // Usar el hospital del usuario que hace la petición si no es admin/sedes_admin
    let hospital_id = req.body.hospital_id;
    
    if (!['admin', 'sedes_admin'].includes(req.user.role)) {
      hospital_id = req.user.hospital_id;
    }
    
    // Si es admin/sedes_admin pero no se proporcionó hospital_id
    if (['admin', 'sedes_admin'].includes(req.user.role) && !hospital_id) {
      return res.status(400).json({ message: 'Debe especificar un hospital para el paciente' });
    }
    
    // Formatear fechas para MySQL
    const formattedBirthdate = formatDateForMySQL(birthdate);
    const formattedDiagnosisDate = formatDateForMySQL(diagnosis_date);

    // Insertar paciente
    const [result] = await db.promise().query(
        `INSERT INTO patients 
          (first_name, last_name, ci, birthdate, gender, phone, address, 
           diagnosis_date, tb_type, hospital_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          first_name,
          last_name,
          ci || null,
          formattedBirthdate,
          gender,
          phone || null,
          address || null,
          formattedDiagnosisDate,
          tb_type,
          hospital_id
        ]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Paciente creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Actualizar un paciente existente
 * @param {Request} req
 * @param {Response} res
 */
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      ci,
      birthdate,
      gender,
      phone,
      address,
      diagnosis_date,
      tb_type,
    } = req.body;
    
    // Validación básica
    if (!first_name || !last_name || !birthdate || !gender || !tb_type) {
      return res.status(400).json({
        message: 'Datos incompletos. Por favor proporcione todos los campos requeridos.'
      });
    }
    
    // Verificar que el paciente exista
    const [patient] = await db.promise().query(
      'SELECT hospital_id FROM patients WHERE id = ? AND status = 1',
      [id]
    );
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Verificar permisos
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        patient[0].hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para editar este paciente' });
    }
    
    // Si se proporciona CI, verificar que no esté en uso por otro paciente
    if (ci) {
      const [existingPatient] = await db.promise().query(
        'SELECT id FROM patients WHERE ci = ? AND id != ? AND status = 1',
        [ci, id]
      );
      
      if (existingPatient.length > 0) {
        return res.status(400).json({ message: 'Ya existe otro paciente con este CI' });
      }
    }
    
    // Determinar si se puede cambiar el hospital
    let hospital_id = req.body.hospital_id;
    
    if (!['admin', 'sedes_admin'].includes(req.user.role)) {
      // Si no es admin, no puede cambiar el hospital
      hospital_id = req.user.hospital_id;
    }
    // Formatear fechas para MySQL
    const formattedBirthdate = formatDateForMySQL(birthdate);
    const formattedDiagnosisDate = formatDateForMySQL(diagnosis_date);
    // Actualizar paciente
    await db.promise().query(
      `UPDATE patients 
       SET first_name = ?, last_name = ?, ci = ?, birthdate = ?, 
           gender = ?, phone = ?, address = ?, diagnosis_date = ?, 
           tb_type = ?, hospital_id = ?
       WHERE id = ? AND status = 1`,
      [
        first_name,
        last_name,
        ci || null,
        formattedBirthdate,
        gender,
        phone || null,
        address || null,
        formattedDiagnosisDate,
        tb_type,
        hospital_id,
        id
      ]
    );
    
    res.json({ message: 'Paciente actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Eliminar un paciente (eliminación lógica)
 * @param {Request} req
 * @param {Response} res
 */
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el paciente exista
    const [patient] = await db.promise().query(
      'SELECT hospital_id FROM patients WHERE id = ? AND status = 1',
      [id]
    );
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Verificar permisos
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        patient[0].hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para eliminar este paciente' });
    }
    
    // Eliminar lógicamente
    await db.promise().query(
      'UPDATE patients SET status = 0 WHERE id = ?',
      [id]
    );
    
    res.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};