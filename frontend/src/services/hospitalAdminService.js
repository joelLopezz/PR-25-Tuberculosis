// src/services/hospitalAdminService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los administradores de hospital
 * @returns {Promise} Lista de administradores
 */
export const getAllHospitalAdmins = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital-admins`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Obtiene un administrador por su ID
 * @param {string} id - ID del administrador
 * @returns {Promise} Datos del administrador
 */
export const getHospitalAdminById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/hospital-admins/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Crea un nuevo administrador de hospital
 * @param {Object} adminData - Datos del nuevo administrador
 * @returns {Promise} Respuesta de la creación
 */
export const createHospitalAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/hospital-admins`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Actualiza un administrador existente
 * @param {string} id - ID del administrador
 * @param {Object} adminData - Datos actualizados
 * @returns {Promise} Respuesta de la actualización
 */
export const updateHospitalAdmin = async (id, adminData) => {
  try {
    const response = await axios.put(`${API_URL}/hospital-admins/${id}`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Elimina un administrador de hospital (eliminación lógica)
 * @param {string} id - ID del administrador
 * @returns {Promise} Respuesta de la eliminación
 */
export const deleteHospitalAdmin = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/hospital-admins/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Resetea la contraseña de un administrador
 * @param {string} id - ID del administrador
 * @returns {Promise} Respuesta del reseteo
 */
export const resetPassword = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/hospital-admins/${id}/reset-password`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};