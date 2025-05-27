// models/networkModel.js
const db = require('../config/db');

/**
 * Obtener todas las redes de salud activas, incluyendo el conteo de hospitales y municipios.
 * @returns {Promise} Promesa con los resultados
 */
const getAllNetworks = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        n.id, 
        n.name, 
        n.code, 
        n.status, 
        n.created_at, 
        n.updated_at,
        COUNT(DISTINCT h.id) AS hospital_count,    -- Conteo de hospitales
        COUNT(DISTINCT m.id) AS municipality_count -- Conteo de municipios
      FROM 
        networks n
      LEFT JOIN 
        hospitals h ON n.id = h.network_id AND h.status = 1 -- Unir con hospitales
      LEFT JOIN 
        municipalities m ON n.id = m.network_id AND m.status = 1 -- Unir con municipios
      WHERE 
        n.status = 1
      GROUP BY 
        n.id, n.name, n.code, n.status, n.created_at, n.updated_at -- Agrupar por todos los campos de network
      ORDER BY 
        n.name ASC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error en getAllNetworks del modelo:", err); // Añadir log para depuración
        return reject(err);
      }
      resolve(results);
    });
  });
};

/**
 * Obtener una red de salud por ID
 * @param {number} id - ID de la red de salud
 * @returns {Promise} Promesa con el resultado
 */
const getNetworkById = (id) => {
  return new Promise((resolve, reject) => {
    // También puedes querer que esta función incluya conteos si la usas en otro lugar del frontend
    // Por ahora, solo la consulta básica
    db.query('SELECT * FROM networks WHERE id = ? AND status = 1', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

/**
 * Crear una nueva red de salud
 * @param {Object} networkData - Datos de la red de salud
 * @returns {Promise} Promesa con el ID insertado
 */
const createNetwork = (networkData) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO networks SET ?', networkData, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);
    });
  });
};

/**
 * Actualizar una red de salud
 * @param {number} id - ID de la red de salud
 * @param {Object} networkData - Datos de la red de salud
 * @returns {Promise} Promesa con el resultado de la operación
 */
const updateNetwork = (id, networkData) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE networks SET ? WHERE id = ?', [networkData, id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.affectedRows > 0);
    });
  });
};

/**
 * Eliminar lógicamente una red de salud (cambiar status a 0)
 * @param {number} id - ID de la red de salud
 * @returns {Promise} Promesa con el resultado de la operación
 */
const deleteNetwork = (id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE networks SET status = 0 WHERE id = ?', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.affectedRows > 0);
    });
  });
};

module.exports = {
  getAllNetworks,
  getNetworkById,
  createNetwork,
  updateNetwork,
  deleteNetwork
};