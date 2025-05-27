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
 * ⭐ MODIFICADA: Ahora valida si el paciente tiene referencias antes de eliminar
 * @param {Request} req
 * @param {Response} res
 */
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el paciente exista
    const [patient] = await db.promise().query(
      'SELECT hospital_id, first_name, last_name FROM patients WHERE id = ? AND status = 1',
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
    
    // ⭐ NUEVA VALIDACIÓN: Verificar si el paciente tiene referencias existentes
    const [references] = await db.promise().query(
      `SELECT COUNT(*) as reference_count, 
              SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) as pending_count,
              SUM(CASE WHEN status = 'Aceptada' THEN 1 ELSE 0 END) as accepted_count,
              SUM(CASE WHEN status = 'Completada' THEN 1 ELSE 0 END) as completed_count,
              SUM(CASE WHEN status = 'Rechazada' THEN 1 ELSE 0 END) as rejected_count
       FROM referrals 
       WHERE patient_id = ? AND active_status = 1`,
      [id]
    );
    
    const totalReferences = references[0].reference_count;
    
    if (totalReferences > 0) {
      // Construir mensaje detallado sobre las referencias existentes
      const refDetails = [];
      if (references[0].pending_count > 0) refDetails.push(`${references[0].pending_count} pendiente(s)`);
      if (references[0].accepted_count > 0) refDetails.push(`${references[0].accepted_count} aceptada(s)`);
      if (references[0].completed_count > 0) refDetails.push(`${references[0].completed_count} completada(s)`);
      if (references[0].rejected_count > 0) refDetails.push(`${references[0].rejected_count} rechazada(s)`);
      
      return res.status(409).json({ 
        message: `No se puede eliminar al paciente ${patient[0].first_name} ${patient[0].last_name} porque tiene ${totalReferences} referencia(s) existente(s): ${refDetails.join(', ')}. Para eliminar este paciente, primero debe gestionar o eliminar todas sus referencias.`,
        hasReferences: true,
        referenceDetails: {
          total: totalReferences,
          pending: references[0].pending_count,
          accepted: references[0].accepted_count,
          completed: references[0].completed_count,
          rejected: references[0].rejected_count
        }
      });
    }
    
    // ⭐ VALIDACIÓN ADICIONAL: Verificar si tiene contrareferencias
    const [counterReferences] = await db.promise().query(
      `SELECT COUNT(*) as counter_reference_count
       FROM counter_references cr
       JOIN referrals r ON cr.referral_id = r.id
       WHERE r.patient_id = ? AND cr.status = 1`,
      [id]
    );
    
    if (counterReferences[0].counter_reference_count > 0) {
      return res.status(409).json({ 
        message: `No se puede eliminar al paciente ${patient[0].first_name} ${patient[0].last_name} porque tiene ${counterReferences[0].counter_reference_count} contrareferencia(s) asociada(s). Para eliminar este paciente, primero debe gestionar todas sus contrareferencias.`,
        hasCounterReferences: true,
        counterReferenceCount: counterReferences[0].counter_reference_count
      });
    }
    
    // Si llegamos aquí, el paciente no tiene referencias ni contrareferencias, proceder con la eliminación lógica
    await db.promise().query(
      'UPDATE patients SET status = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
    
    res.json({ 
      message: `Paciente ${patient[0].first_name} ${patient[0].last_name} eliminado exitosamente` 
    });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};