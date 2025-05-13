// src/services/counterReferenceService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todas las contrareferencias
export const getAllCounterReferences = async () => {
  try {
    const response = await axios.get(`${API_URL}/counter-references`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener contrareferencias' };
  }
};

// Obtener una contrareferencia por ID
export const getCounterReferenceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/counter-references/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener contrareferencia' };
  }
};

// Crear una nueva contrareferencia
export const createCounterReference = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/counter-references`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear contrareferencia' };
  }
};

// Actualizar una contrareferencia
export const updateCounterReference = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/counter-references/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar contrareferencia' };
  }
};

// Eliminar una contrareferencia
export const deleteCounterReference = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/counter-references/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar contrareferencia' };
  }
};