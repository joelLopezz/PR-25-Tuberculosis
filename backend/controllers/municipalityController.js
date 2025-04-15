// controllers/municipalityController.js
const municipalityModel = require('../models/municipalityModel');

/**
 * Obtener todos los municipios
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getAllMunicipalities = async (req, res) => {
  try {
    const municipalities = await municipalityModel.getAllMunicipalities();
    res.status(200).json(municipalities);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ message: 'Error al obtener los municipios' });
  }
};

/**
 * Obtener un municipio por ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getMunicipalityById = async (req, res) => {
  try {
    const id = req.params.id;
    const municipality = await municipalityModel.getMunicipalityById(id);
    
    if (!municipality) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    
    res.status(200).json(municipality);
  } catch (error) {
    console.error('Error al obtener el municipio:', error);
    res.status(500).json({ message: 'Error al obtener el municipio' });
  }
};

module.exports = {
  getAllMunicipalities,
  getMunicipalityById
};