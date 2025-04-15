// controllers/hospitalController.js
const hospitalModel = require('../models/hospitalModel');

/**
 * Obtener todos los hospitales
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalModel.getAllHospitals();
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error al obtener hospitales:', error);
    res.status(500).json({ message: 'Error al obtener los hospitales' });
  }
};

/**
 * Obtener un hospital por ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getHospitalById = async (req, res) => {
  try {
    const id = req.params.id;
    const hospital = await hospitalModel.getHospitalById(id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital no encontrado' });
    }
    
    res.status(200).json(hospital);
  } catch (error) {
    console.error('Error al obtener el hospital:', error);
    res.status(500).json({ message: 'Error al obtener el hospital' });
  }
};

/**
 * Crear un nuevo hospital
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const createHospital = async (req, res) => {
  try {
    const { name, address, phone, email, network_id, municipality_id } = req.body;
    
    // Validación básica
    if (!name) {
      return res.status(400).json({ message: 'El nombre del hospital es requerido' });
    }
    
    const hospitalData = { 
      name, 
      address, 
      phone, 
      email, 
      network_id: network_id || null, 
      municipality_id: municipality_id || null 
    };
    
    const newHospitalId = await hospitalModel.createHospital(hospitalData);
    
    res.status(201).json({ 
      id: newHospitalId,
      message: 'Hospital creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear el hospital:', error);
    res.status(500).json({ message: 'Error al crear el hospital' });
  }
};

/**
 * Actualizar un hospital
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const updateHospital = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address, phone, email, network_id, municipality_id } = req.body;
    
    // Validación básica
    if (!name) {
      return res.status(400).json({ message: 'El nombre del hospital es requerido' });
    }
    
    const hospitalData = { 
      name, 
      address, 
      phone, 
      email, 
      network_id: network_id || null, 
      municipality_id: municipality_id || null 
    };
    
    const success = await hospitalModel.updateHospital(id, hospitalData);
    
    if (!success) {
      return res.status(404).json({ message: 'Hospital no encontrado o no actualizado' });
    }
    
    res.status(200).json({ message: 'Hospital actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el hospital:', error);
    res.status(500).json({ message: 'Error al actualizar el hospital' });
  }
};

/**
 * Eliminar un hospital (lógicamente)
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const deleteHospital = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await hospitalModel.deleteHospital(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Hospital no encontrado o no eliminado' });
    }
    
    res.status(200).json({ message: 'Hospital eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el hospital:', error);
    res.status(500).json({ message: 'Error al eliminar el hospital' });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};