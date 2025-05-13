// controllers/counterReferenceController.js
const db = require("../config/db");

/**
 * Obtener todas las contrareferencias
 * @param {Request} req
 * @param {Response} res
 */
exports.getAllCounterReferences = async (req, res) => {
  try {
    let query = `
      SELECT cr.*, 
             r.patient_id, r.source_hospital_id, r.destination_hospital_id,
             p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
             s.first_name AS staff_first_name, s.last_name AS staff_last_name,
             sh.name AS source_hospital_name, dh.name AS destination_hospital_name
      FROM counter_references cr
      JOIN referrals r ON cr.referral_id = r.id
      JOIN patients p ON r.patient_id = p.id
      JOIN staff s ON cr.receiving_staff_id = s.id
      JOIN hospitals sh ON r.source_hospital_id = sh.id
      JOIN hospitals dh ON r.destination_hospital_id = dh.id
      WHERE cr.active_status = 1
    `;
    
    const queryParams = [];
    
    // Filtrar según el rol y hospital del usuario
    if (!['admin', 'sedes_admin'].includes(req.user.role)) {
      // Hospital admin y personal médico sólo ven contrareferencias donde su hospital es origen o destino
      query += " AND (r.source_hospital_id = ? OR r.destination_hospital_id = ?)";
      queryParams.push(req.user.hospital_id, req.user.hospital_id);
    }
    
    // Orden: los más recientes primero
    query += " ORDER BY cr.created_at DESC";
    
    const [counterReferences] = await db.promise().query(query, queryParams);
    
    res.json(counterReferences);
  } catch (error) {
    console.error('Error al obtener contrareferencias:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Obtener una contrareferencia por ID
 * @param {Request} req
 * @param {Response} res
 */
exports.getCounterReferenceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT cr.*, 
             r.patient_id, r.source_hospital_id, r.destination_hospital_id,
             p.first_name AS patient_first_name, p.last_name AS patient_last_name, 
             s.first_name AS staff_first_name, s.last_name AS staff_last_name,
             sh.name AS source_hospital_name, dh.name AS destination_hospital_name
      FROM counter_references cr
      JOIN referrals r ON cr.referral_id = r.id
      JOIN patients p ON r.patient_id = p.id
      JOIN staff s ON cr.receiving_staff_id = s.id
      JOIN hospitals sh ON r.source_hospital_id = sh.id
      JOIN hospitals dh ON r.destination_hospital_id = dh.id
      WHERE cr.id = ? AND cr.active_status = 1
    `;
    
    const [counterReferences] = await db.promise().query(query, [id]);
    
    if (counterReferences.length === 0) {
      return res.status(404).json({ message: 'Contrareferencia no encontrada' });
    }
    
    // Verificar permisos
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        counterReferences[0].source_hospital_id !== req.user.hospital_id && 
        counterReferences[0].destination_hospital_id !== req.user.hospital_id) {
      return res.status(403).json({ message: 'No tiene permiso para ver esta contrareferencia' });
    }
    
    res.json(counterReferences[0]);
  } catch (error) {
    console.error('Error al obtener contrareferencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Crear una nueva contrareferencia
 * @param {Request} req
 * @param {Response} res
 */
exports.createCounterReference = async (req, res) => {
  try {
    // Iniciar transacción para asegurar integridad
    await db.promise().query("START TRANSACTION");
    
    const {
      referral_id,
      counter_reference_date,
      diagnosis_update,
      treatment_provided,
      recommendations,
      notes
    } = req.body;
    
    // Validación básica
    if (!referral_id || !counter_reference_date || !treatment_provided) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({
        message: 'Datos incompletos. Referencia, fecha y tratamiento proporcionado son obligatorios.'
      });
    }
    
    // Verificar que la referencia exista y obtener datos importantes
    const [referral] = await db.promise().query(
      `SELECT r.*, p.status AS patient_status, p.hospital_id AS current_hospital_id 
       FROM referrals r
       JOIN patients p ON r.patient_id = p.id
       WHERE r.id = ? AND r.active_status = 1`,
      [referral_id]
    );
    
    if (referral.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: 'Referencia no encontrada' });
    }
    
    // Verificar que el paciente esté activo
    if (referral[0].patient_status !== 1) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({ message: 'El paciente no está activo' });
    }
    
    // Verificar que la referencia esté en estado "Aceptada"
    if (referral[0].status !== 'Aceptada' && referral[0].status !== 'Completada') {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({ 
        message: 'No se puede crear contrareferencia porque la referencia no ha sido aceptada' 
      });
    }
    
    // Solo personal del hospital destino puede crear una contrareferencia
    // (ya que ellos recibieron al paciente)
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        referral[0].destination_hospital_id !== req.user.hospital_id) {
      await db.promise().query("ROLLBACK");
      return res.status(403).json({ 
        message: 'No tiene permiso para crear contrareferencia para esta referencia' 
      });
    }
    
    // Verificar si ya existe una contrareferencia para esta referencia
    const [existingCounterReference] = await db.promise().query(
      'SELECT id FROM counter_references WHERE referral_id = ? AND active_status = 1',
      [referral_id]
    );
    
    if (existingCounterReference.length > 0) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({ 
        message: 'Ya existe una contrareferencia para esta referencia' 
      });
    }
    
    // Obtener el ID del staff que hace la contrareferencia
    const [staff] = await db.promise().query(
      'SELECT id FROM staff WHERE user_id = ? AND status = 1',
      [req.user.id]
    );
    
    if (staff.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({ 
        message: 'No se encontró información del personal que realiza la contrareferencia' 
      });
    }
    
    // Insertar contrareferencia
    const [result] = await db.promise().query(
      `INSERT INTO counter_references 
        (referral_id, receiving_staff_id, counter_reference_date, 
         diagnosis_update, treatment_provided, recommendations, notes, active_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        referral_id,
        staff[0].id,
        counter_reference_date,
        diagnosis_update || null,
        treatment_provided,
        recommendations || null,
        notes || null
      ]
    );
    
    // Actualizar el estado de la referencia a "Completada"
    await db.promise().query(
      'UPDATE referrals SET status = "Completada" WHERE id = ?',
      [referral_id]
    );
    
    // IMPORTANTE: Decisión de negocio - ¿El paciente vuelve al hospital original o se queda en destino?
    // Aquí implementamos el retorno del paciente al hospital original, pero esto puede configurarse
    // según las necesidades específicas del sistema y la lógica clínica del programa de TB
    
    // Devolver al paciente al hospital de origen 
    await db.promise().query(
      'UPDATE patients SET hospital_id = ? WHERE id = ?',
      [referral[0].source_hospital_id, referral[0].patient_id]
    );
    
    // Registrar nota sobre la transferencia del paciente de vuelta al hospital original
    const transferNote = `[${new Date().toISOString().split('T')[0]}] ` +
                       `Paciente transferido de vuelta al hospital original después de completar el tratamiento.`;
                       
    await db.promise().query(
      'UPDATE counter_references SET notes = CONCAT(IFNULL(notes, ""), "\n", ?) WHERE id = ?',
      [transferNote, result.insertId]
    );
    
    // Confirmar la transacción
    await db.promise().query("COMMIT");
    
    res.status(201).json({
      id: result.insertId,
      message: 'Contrareferencia creada exitosamente. El paciente ha sido transferido de vuelta al hospital original.'
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await db.promise().query("ROLLBACK");
    console.error('Error al crear contrareferencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Actualizar una contrareferencia
 * @param {Request} req
 * @param {Response} res
 */
exports.updateCounterReference = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query("START TRANSACTION");
    
    const { id } = req.params;
    const {
      counter_reference_date,
      diagnosis_update,
      treatment_provided,
      recommendations,
      notes
    } = req.body;
    
    // Validación básica
    if (!counter_reference_date || !treatment_provided) {
      await db.promise().query("ROLLBACK");
      return res.status(400).json({
        message: 'Datos incompletos. Fecha y tratamiento proporcionado son obligatorios.'
      });
    }
    
    // Verificar que la contrareferencia exista y obtener datos relacionados
    const [counterRef] = await db.promise().query(
      `SELECT cr.*, r.destination_hospital_id, r.source_hospital_id, r.patient_id
       FROM counter_references cr
       JOIN referrals r ON cr.referral_id = r.id
       WHERE cr.id = ? AND cr.active_status = 1`,
      [id]
    );
    
    if (counterRef.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: 'Contrareferencia no encontrada' });
    }
    
    // Verificar permisos: solo personal del hospital que creó la contrareferencia puede editarla
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        counterRef[0].destination_hospital_id !== req.user.hospital_id) {
      await db.promise().query("ROLLBACK");
      return res.status(403).json({ message: 'No tiene permiso para editar esta contrareferencia' });
    }
    
    // Actualizar contrareferencia
    await db.promise().query(
      `UPDATE counter_references 
       SET counter_reference_date = ?, diagnosis_update = ?, 
           treatment_provided = ?, recommendations = ?, notes = ?
       WHERE id = ?`,
      [
        counter_reference_date,
        diagnosis_update || null,
        treatment_provided,
        recommendations || null,
        notes || null,
        id
      ]
    );
    
    // Confirmar transacción
    await db.promise().query("COMMIT");
    
    res.json({ message: 'Contrareferencia actualizada exitosamente' });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error('Error al actualizar contrareferencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Eliminar una contrareferencia (eliminación lógica)
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteCounterReference = async (req, res) => {
  try {
    // Iniciar transacción
    await db.promise().query("START TRANSACTION");
    
    const { id } = req.params;
    
    // Verificar que la contrareferencia exista
    const [counterRef] = await db.promise().query(
      `SELECT cr.*, r.destination_hospital_id, r.id AS referral_id, r.source_hospital_id, r.patient_id 
       FROM counter_references cr
       JOIN referrals r ON cr.referral_id = r.id
       WHERE cr.id = ? AND cr.active_status = 1`,
      [id]
    );
    
    if (counterRef.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: 'Contrareferencia no encontrada' });
    }
    
    // Verificar permisos: solo admins o personal del hospital destino pueden eliminar
    if (!['admin', 'sedes_admin'].includes(req.user.role) && 
        counterRef[0].destination_hospital_id !== req.user.hospital_id) {
      await db.promise().query("ROLLBACK");
      return res.status(403).json({ message: 'No tiene permiso para eliminar esta contrareferencia' });
    }
    
    // Eliminar lógicamente la contrareferencia
    await db.promise().query(
      'UPDATE counter_references SET active_status = 0 WHERE id = ?',
      [id]
    );
    
    // Restaurar el estado de la referencia a "Aceptada"
    await db.promise().query(
      'UPDATE referrals SET status = "Aceptada" WHERE id = ?',
      [counterRef[0].referral_id]
    );
    
    // Obtener el hospital actual del paciente
    const [patient] = await db.promise().query(
      'SELECT hospital_id FROM patients WHERE id = ?',
      [counterRef[0].patient_id]
    );
    
    // Si el paciente ya fue devuelto al hospital original, debemos devolverlo al hospital destino
    // ya que estamos "deshaciendo" la contrareferencia
    if (patient.length > 0 && patient[0].hospital_id === counterRef[0].source_hospital_id) {
      await db.promise().query(
        'UPDATE patients SET hospital_id = ? WHERE id = ?',
        [counterRef[0].destination_hospital_id, counterRef[0].patient_id]
      );
    }
    
    // Confirmar transacción
    await db.promise().query("COMMIT");
    
    res.json({ 
      message: 'Contrareferencia eliminada exitosamente. La referencia ha vuelto al estado Aceptada.'
    });
  } catch (error) {
    await db.promise().query("ROLLBACK");
    console.error('Error al eliminar contrareferencia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};