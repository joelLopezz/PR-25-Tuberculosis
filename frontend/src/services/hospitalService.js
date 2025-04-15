// services/hospitalService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtener todos los hospitales
 * @returns {Promise} Promesa con los datos
 */
export const getHospitals = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospitals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

// Alias para mantener consistencia con otros servicios
export const getAllHospitals = getHospitals;

/**
 * Obtener un hospital por ID
 * @param {number} id - ID del hospital
 * @returns {Promise} Promesa con los datos
 */
export const getHospitalById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/hospitals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hospital with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo hospital
 * @param {Object} hospitalData - Datos del hospital
 * @returns {Promise} Promesa con la respuesta
 */
export const createHospital = async (hospitalData) => {
  try {
    const response = await axios.post(`${API_URL}/hospitals`, hospitalData);
    return response.data;
  } catch (error) {
    console.error('Error creating hospital:', error);
    throw error;
  }
};

/**
 * Actualizar un hospital
 * @param {number} id - ID del hospital
 * @param {Object} hospitalData - Datos del hospital
 * @returns {Promise} Promesa con la respuesta
 */
export const updateHospital = async (id, hospitalData) => {
  try {
    const response = await axios.put(`${API_URL}/hospitals/${id}`, hospitalData);
    return response.data;
  } catch (error) {
    console.error(`Error updating hospital with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar un hospital
 * @param {number} id - ID del hospital
 * @returns {Promise} Promesa con la respuesta
 */
export const deleteHospital = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/hospitals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting hospital with ID ${id}:`, error);
    throw error;
  }
};