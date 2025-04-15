// models/networkModel.js
const db = require('../config/db');

/**
 * Obtener todas las redes de salud activas
 * @returns {Promise} Promesa con los resultados
 */
const getAllNetworks = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM networks WHERE status = 1 ORDER BY name ASC', (err, results) => {
      if (err) {
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