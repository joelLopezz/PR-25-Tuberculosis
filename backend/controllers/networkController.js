// controllers/networkController.js
const networkModel = require('../models/networkModel');
const db = require('../config/db');

/**
 * Obtener todas las redes de salud
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getAllNetworks = async (req, res) => {
  try {
    const networks = await networkModel.getAllNetworks();
    res.status(200).json(networks);
  } catch (error) {
    console.error('Error al obtener redes de salud:', error);
    res.status(500).json({ message: 'Error al obtener las redes de salud' });
  }
};

/**
 * Obtener una red de salud por ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getNetworkById = async (req, res) => {
  try {
    const id = req.params.id;
    const network = await networkModel.getNetworkById(id);
    
    if (!network) {
      return res.status(404).json({ message: 'Red de salud no encontrada' });
    }
    
    res.status(200).json(network);
  } catch (error) {
    console.error('Error al obtener la red de salud:', error);
    res.status(500).json({ message: 'Error al obtener la red de salud' });
  }
};

/**
 * Crear una nueva red de salud
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const createNetwork = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    // Validación básica
    if (!name || !code) {
      return res.status(400).json({ message: 'Nombre y código son requeridos' });
    }
    
    const networkData = { name, code };
    const newNetworkId = await networkModel.createNetwork(networkData);
    
    res.status(201).json({ 
      id: newNetworkId,
      message: 'Red de salud creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear la red de salud:', error);
    res.status(500).json({ message: 'Error al crear la red de salud' });
  }
};

/**
 * Actualizar una red de salud
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const updateNetwork = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, code } = req.body;
    
    // Validación básica
    if (!name || !code) {
      return res.status(400).json({ message: 'Nombre y código son requeridos' });
    }
    
    const networkData = { name, code };
    const success = await networkModel.updateNetwork(id, networkData);
    
    if (!success) {
      return res.status(404).json({ message: 'Red de salud no encontrada o no actualizada' });
    }
    
    res.status(200).json({ message: 'Red de salud actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la red de salud:', error);
    res.status(500).json({ message: 'Error al actualizar la red de salud' });
  }
};

/**
 * Verificar si una red tiene hospitales asociados
 * @param {number} networkId - ID de la red
 * @returns {Promise<boolean>} - True si tiene hospitales asociados
 */
const hasAssociatedHospitals = (networkId) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT COUNT(*) as count FROM hospitals WHERE network_id = ? AND status = 1',
      [networkId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0].count > 0);
      }
    );
  });
};

/**
 * Eliminar una red de salud (lógicamente)
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const deleteNetwork = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar si hay hospitales asociados
    const hasHospitals = await hasAssociatedHospitals(id);
    
    if (hasHospitals) {
      // Opciones:
      // 1. No permitir eliminar y mostrar advertencia
      // return res.status(400).json({ 
      //   message: 'No se puede eliminar la red porque tiene hospitales asociados',
      //   hasAssociatedHospitals: true
      // });
      
      // 2. Permitir eliminar pero enviar advertencia (implementamos esta opción)
      const success = await networkModel.deleteNetwork(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Red de salud no encontrada o no eliminada' });
      }
      
      return res.status(200).json({ 
        message: 'Red de salud eliminada exitosamente', 
        warning: 'Algunos hospitales estaban asociados a esta red. Se han desvinculado automáticamente.'
      });
    }
    
    // Caso normal: no hay hospitales asociados
    const success = await networkModel.deleteNetwork(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Red de salud no encontrada o no eliminada' });
    }
    
    res.status(200).json({ message: 'Red de salud eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la red de salud:', error);
    res.status(500).json({ message: 'Error al eliminar la red de salud' });
  }
};

module.exports = {
  getAllNetworks,
  getNetworkById,
  createNetwork,
  updateNetwork,
  deleteNetwork
};