// models/hospitalModel.js
const db = require('../config/db');

/**
 * Obtener todos los hospitales activos con información de red y municipio activos
 * @returns {Promise} Promesa con los resultados
 */
const getAllHospitals = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT h.*, 
             CASE WHEN n.status = 1 THEN n.name ELSE NULL END as network_name, 
             CASE WHEN m.status = 1 THEN m.name ELSE NULL END as municipality_name
      FROM hospitals h
      LEFT JOIN networks n ON h.network_id = n.id
      LEFT JOIN municipalities m ON h.municipality_id = m.id
      WHERE h.status = 1
      ORDER BY h.name ASC
    `;
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

/**
 * Obtener un hospital por ID con información de red y municipio
 * @param {number} id - ID del hospital
 * @returns {Promise} Promesa con el resultado
 */
const getHospitalById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT h.*, 
             CASE WHEN n.status = 1 THEN n.name ELSE NULL END as network_name, 
             CASE WHEN m.status = 1 THEN m.name ELSE NULL END as municipality_name
      FROM hospitals h
      LEFT JOIN networks n ON h.network_id = n.id
      LEFT JOIN municipalities m ON h.municipality_id = m.id
      WHERE h.id = ? AND h.status = 1
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

/**
 * Crear un nuevo hospital
 * @param {Object} hospitalData - Datos del hospital
 * @returns {Promise} Promesa con el ID insertado
 */
const createHospital = (hospitalData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO hospitals SET ?', hospitalData, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);
    });
  });
};

/**
 * Actualizar un hospital
 * @param {number} id - ID del hospital
 * @param {Object} hospitalData - Datos del hospital
 * @returns {Promise} Promesa con el resultado de la operación
 */
const updateHospital = (id, hospitalData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE hospitals SET ? WHERE id = ?', [hospitalData, id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.affectedRows > 0);
    });
  });
};

/**
 * Eliminar lógicamente un hospital (cambiar status a 0)
 * @param {number} id - ID del hospital
 * @returns {Promise} Promesa con el resultado de la operación
 */
const deleteHospital = (id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE hospitals SET status = 0 WHERE id = ?', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.affectedRows > 0);
    });
  });
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};