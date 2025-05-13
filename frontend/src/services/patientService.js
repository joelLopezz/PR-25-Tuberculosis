// src/services/patientService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los pacientes
export const getAllPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener pacientes' };
  }
};

// Obtener un paciente por ID
export const getPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener paciente' };
  }
};

// Crear un nuevo paciente
export const createPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_URL}/patients`, patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear paciente' };
  }
};

// Actualizar un paciente existente
export const updatePatient = async (id, patientData) => {
  try {
    const response = await axios.put(`${API_URL}/patients/${id}`, patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar paciente' };
  }
};

// Eliminar un paciente
export const deletePatient = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar paciente' };
  }
};