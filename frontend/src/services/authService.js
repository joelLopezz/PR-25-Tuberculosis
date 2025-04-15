/* eslint-disable no-useless-catch */
//src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Email y password
 * @returns {Promise} - Promise con respuesta del servidor
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cierra sesión de usuario
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Obtiene información del usuario autenticado
 * @returns {Promise} - Promise con datos del usuario
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    logout();
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

/**
 * Solicita recuperación de contraseña
 * @param {string} identifier - Email o nombre de usuario
 * @returns {Promise} - Promise con respuesta del servidor
 */
export const forgotPassword = async (identifier) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { identifier });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica si un token de recuperación es válido
 * @param {string} token - Token de recuperación
 * @returns {Promise} - Promise con respuesta del servidor
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Restablece la contraseña usando un token de recuperación
 * @param {string} token - Token de recuperación
 * @param {string} password - Nueva contraseña
 * @returns {Promise} - Promise con respuesta del servidor
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Configura interceptores globales de Axios
 */
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};