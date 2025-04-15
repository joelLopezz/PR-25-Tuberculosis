// services/networkService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtener todas las redes de salud
 * @returns {Promise} Promesa con los datos
 */
export const getAllNetworks = async () => {
  try {
    const response = await axios.get(`${API_URL}/networks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching networks:', error);
    throw error;
  }
};

/**
 * Obtener una red de salud por ID
 * @param {number} id - ID de la red de salud
 * @returns {Promise} Promesa con los datos
 */
export const getNetworkById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/networks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching network with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crear una nueva red de salud
 * @param {Object} networkData - Datos de la red de salud
 * @returns {Promise} Promesa con la respuesta
 */
export const createNetwork = async (networkData) => {
  try {
    const response = await axios.post(`${API_URL}/networks`, networkData);
    return response.data;
  } catch (error) {
    console.error('Error creating network:', error);
    throw error;
  }
};

/**
 * Actualizar una red de salud
 * @param {number} id - ID de la red de salud
 * @param {Object} networkData - Datos de la red de salud
 * @returns {Promise} Promesa con la respuesta
 */
export const updateNetwork = async (id, networkData) => {
  try {
    const response = await axios.put(`${API_URL}/networks/${id}`, networkData);
    return response.data;
  } catch (error) {
    console.error(`Error updating network with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar una red de salud
 * @param {number} id - ID de la red de salud
 * @returns {Promise} Promesa con la respuesta
 */
export const deleteNetwork = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/networks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting network with ID ${id}:`, error);
    throw error;
  }
};