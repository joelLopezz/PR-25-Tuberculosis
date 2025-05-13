// src/services/referralService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todas las referencias
export const getAllReferrals = async () => {
  try {
    const response = await axios.get(`${API_URL}/referrals`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener referencias' };
  }
};

// Obtener una referencia por ID
export const getReferralById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/referrals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener referencia' };
  }
};

// Crear una nueva referencia
export const createReferral = async (referralData) => {
  try {
    const response = await axios.post(`${API_URL}/referrals`, referralData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear referencia' };
  }
};

// Actualizar estado de una referencia
export const updateReferralStatus = async (id, statusData) => {
  try {
    const response = await axios.put(`${API_URL}/referrals/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar estado de referencia' };
  }
};

// Eliminar una referencia
export const deleteReferral = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/referrals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar referencia' };
  }
};