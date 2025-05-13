// controllers/referralController.js
const db = require("../config/db");

/**
 * Obtener todas las referencias
 * @param {Request} req
 * @param {Response} res
 */
exports.getAllReferrals = async (req, res) => {
  try {
    let query = `
      SELECT r.*, 
             p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
             s.first_name AS staff_first_name, s.last_name AS staff_last_name,
             sh.name AS source_hospital_name, dh.name AS destination_hospital_name
      FROM referrals r
      JOIN patients p ON r.patient_id = p.id
      JOIN staff s ON r.referring_staff_id = s.id
      JOIN hospitals sh ON r.source_hospital_id = sh.id
      JOIN hospitals dh ON r.destination_hospital_id = dh.id
      WHERE r.active_status = 1
    `;
    
    const queryParams = [];
    
    // Filtrar según el rol y hospital del usuario
    if (!['admin', 'sedes_admin'].includes(req.user.role)) {
      // Hospital admin y personal médico sólo ven referencias de su hospital
      query += " AND (r.source_hospital_id = ? OR r.destination_hospital_id = ?)";
      queryParams.push(req.user.hospital_id, req.user.hospital_id);
    }
    
    // Orden: los más recientes primero
    query += " ORDER BY r.created_at DESC";
    
    const [referrals] = await db.promise().query(query, queryParams);
    
    res.json(referrals);
  } catch (error) {
    console.error('Error al obtener referencias:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Obtener una referencia por ID
 * @param {Request} req
 * @param {Response} res
 */
exports.getReferralById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT r.*, 
             p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
             s.first_name AS staff_first_name, s.last_name AS staff_last_name,
             sh.name AS source_hospital_name, dh.name AS destination_hospital_name
      FROM referrals r
      JOIN patients p ON r.patient_id = p.id
      JOIN staff s ON r.referring_staff_id = s.id
      JOIN hospitals sh ON r.source_hospital_id = sh.id
      JOIN hospitals dh ON r.destination_hospital_id = dh.id
      WHERE r.id = ? AND r.active_status = 1
    `;
    
    const [referrals] = await db.promise().query(query, [id]);
    
    if (referrals.length === 0) {
      return res.status(404).json({ message: 'Referencia no encontrada' });
    }
    
    // Verificar permisos - sólo admin, sedes_admin o usuarios del hospital origen/destino pueden ver
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        referrals[0].source_hospital_id !== req.user.hospital_id && 
        referrals[0].destination_hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para ver esta referencia' });
    }
    
    res.json(referrals[0]);
  } catch (error) {
    console.error('Error al obtener referencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Crear una nueva referencia
 * @param {Request} req
 * @param {Response} res
 */
exports.createReferral = async (req, res) => {
  try {
    const {
      patient_id,
      destination_hospital_id,
      reference_date,
      reason,
      diagnosis,
      clinical_summary,
      urgency_level,
      notes
    } = req.body;
    
    // Validación básica
    if (!patient_id || !destination_hospital_id || !reference_date || !reason) {
      return res.status(400).json({
        message: 'Datos incompletos. Paciente, hospital destino, fecha y motivo son obligatorios.'
      });
    }
    
    // Verificar que el paciente exista y pertenezca al hospital del usuario
    const [patient] = await db.promise().query(
      'SELECT hospital_id FROM patients WHERE id = ? AND status = 1',
      [patient_id]
    );
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Solo personal del hospital donde está el paciente puede crear una referencia
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        patient[0].hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para referir este paciente' });
    }
    
    // Verificar que el hospital destino exista
    const [hospital] = await db.promise().query(
      'SELECT id FROM hospitals WHERE id = ? AND status = 1',
      [destination_hospital_id]
    );
    
    if (hospital.length === 0) {
      return res.status(404).json({ message: 'Hospital destino no encontrado' });
    }
    
    // No permitir referencia al mismo hospital
    if (patient[0].hospital_id === parseInt(destination_hospital_id)) {
      return res.status(400).json({ message: 'No se puede referir al mismo hospital' });
    }
    
    // Obtener el ID del staff que hace la referencia (es el usuario autenticado)
    const [staff] = await db.promise().query(
      'SELECT id FROM staff WHERE user_id = ? AND status = 1',
      [req.user.id]
    );
    
    if (staff.length === 0) {
      return res.status(400).json({ message: 'No se encontró información del personal que realiza la referencia' });
    }
    
    // Insertar referencia
    const [result] = await db.promise().query(
      `INSERT INTO referrals 
        (patient_id, referring_staff_id, source_hospital_id, destination_hospital_id, 
         reference_date, reason, diagnosis, clinical_summary, urgency_level, status, notes, active_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?, 1)`,
      [
        patient_id,
        staff[0].id,
        patient[0].hospital_id,
        destination_hospital_id,
        reference_date,
        reason,
        diagnosis || null,
        clinical_summary || null,
        urgency_level || 'Media',
        notes || null
      ]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Referencia creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear referencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Actualizar el estado de una referencia
 * @param {Request} req
 * @param {Response} res
 */
// Modifica la función updateReferralStatus en controllers/referralController.js

exports.updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Validación del estado
    if (!['Pendiente', 'Aceptada', 'Rechazada', 'Completada'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    
    // Verificar que la referencia exista - MODIFICADO: ahora incluye el campo status
    const [referral] = await db.promise().query(
      'SELECT source_hospital_id, destination_hospital_id, patient_id, status FROM referrals WHERE id = ? AND active_status = 1',
      [id]
    );
    
    if (referral.length === 0) {
      return res.status(404).json({ message: 'Referencia no encontrada' });
    }
    
    // Verificar permisos: solo admins o personal del hospital destino pueden actualizar el estado
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        referral[0].destination_hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para actualizar esta referencia' });
    }

    // MODIFICADO: Ahora verifica el campo status (que sí existe) en lugar de current_status
    // Verificar que no se esté cambiando de un estado final a otro
    if (referral[0].status !== 'Pendiente') {
      return res.status(400).json({ message: 'No se puede cambiar el estado de una referencia que ya no está pendiente' });
    }

    // Si el estado es "Aceptada", actualizar el hospital del paciente
    if (status === 'Aceptada') {
      await db.promise().query(
        'UPDATE patients SET hospital_id = ? WHERE id = ?',
        [referral[0].destination_hospital_id, referral[0].patient_id]
      );
    }
    
    // ELIMINADOS: los comandos de transacción innecesarios (COMMIT)
    
    // Actualizar el estado
    await db.promise().query(
      'UPDATE referrals SET status = ?, notes = CONCAT(IFNULL(notes, ""), "\n", ?) WHERE id = ?',
      [
        status,
        notes ? `[${new Date().toISOString().split('T')[0]}] Estado cambiado a "${status}": ${notes}` : 
                `[${new Date().toISOString().split('T')[0]}] Estado cambiado a "${status}"`,
        id
      ]
    );
    
    res.json({ message: 'Estado de referencia actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado de referencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Eliminar una referencia (eliminación lógica)
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteReferral = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la referencia exista
    const [referral] = await db.promise().query(
      'SELECT source_hospital_id FROM referrals WHERE id = ? AND active_status = 1',
      [id]
    );
    
    if (referral.length === 0) {
      return res.status(404).json({ message: 'Referencia no encontrada' });
    }
    
    // Verificar permisos: solo admins o personal del hospital origen pueden eliminar
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        referral[0].source_hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para eliminar esta referencia' });
    }
    
    // Eliminar lógicamente
    await db.promise().query(
      'UPDATE referrals SET active_status = 0 WHERE id = ?',
      [id]
    );
    
    res.json({ message: 'Referencia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar referencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};