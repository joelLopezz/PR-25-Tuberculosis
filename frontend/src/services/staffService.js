// src/services/staffService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los miembros del personal
 * @returns {Promise} - Promise con la lista de personal
 */
export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${API_URL}/staff`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener personal' };
  }
};

/**
 * Obtiene un miembro del personal por su ID
 * @param {number} id - ID del miembro del personal
 * @returns {Promise} - Promise con los datos del miembro del personal
 */
export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener datos del personal' };
  }
};

/**
 * Crea un nuevo miembro del personal
 * @param {Object} staffData - Datos del miembro del personal
 * @returns {Promise} - Promise con la respuesta del servidor
 */
export const createStaff = async (staffData) => {
  try {
    const response = await axios.post(`${API_URL}/staff`, staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear personal' };
  }
};

/**
 * Actualiza un miembro del personal
 * @param {number} id - ID del miembro del personal
 * @param {Object} staffData - Datos actualizados
 * @returns {Promise} - Promise con la respuesta del servidor
 */
export const updateStaff = async (id, staffData) => {
  try {
    const response = await axios.put(`${API_URL}/staff/${id}`, staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar personal' };
  }
};

/**
 * Elimina un miembro del personal (eliminación lógica)
 * @param {number} id - ID del miembro del personal
 * @returns {Promise} - Promise con la respuesta del servidor
 */
export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar personal' };
  }
};

/**
 * Restablece la contraseña de un usuario asociado a un miembro del personal
 * @param {number} staffId - ID del miembro del personal
 * @returns {Promise} - Promise con la respuesta del servidor
 */
export const resetPassword = async (staffId) => {
  try {
    const response = await axios.post(`${API_URL}/staff/${staffId}/reset-password`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al restablecer contraseña' };
  }
};

/**
 * Cambia la contraseña del usuario actual
 * @param {Object} passwordData - Contraseña actual y nueva
 * @returns {Promise} - Promise con la respuesta del servidor
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(`${API_URL}/staff/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al cambiar contraseña' };
  }
};