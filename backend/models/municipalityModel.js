// models/municipalityModel.js
const db = require('../config/db');

/**
 * Obtener todos los municipios activos
 * @returns {Promise} Promesa con los resultados
 */
const getAllMunicipalities = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM municipalities WHERE status = 1 ORDER BY name ASC', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

/**
 * Obtener un municipio por ID
 * @param {number} id - ID del municipio
 * @returns {Promise} Promesa con el resultado
 */
const getMunicipalityById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM municipalities WHERE id = ? AND status = 1', [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

module.exports = {
  getAllMunicipalities,
  getMunicipalityById
};