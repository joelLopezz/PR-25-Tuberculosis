// services/municipalityService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtener todos los municipios
 * @returns {Promise} Promesa con los datos
 */
export const getAllMunicipalities = async () => {
  try {
    const response = await axios.get(`${API_URL}/municipalities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    throw error;
  }
};

/**
 * Obtener un municipio por ID
 * @param {number} id - ID del municipio
 * @returns {Promise} Promesa con los datos
 */
export const getMunicipalityById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/municipalities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching municipality with ID ${id}:`, error);
    throw error;
  }
};