/* eslint-disable no-unused-vars */
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, setupAxiosInterceptors } from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Primer useEffect: Inicialización al montar el componente
  useEffect(() => {
    const initAuth = async () => {
      setupAxiosInterceptors();
      
      try {
        const userData = await getCurrentUser();
        console.log("Datos del usuario cargados:", userData); // Añadido para debug
        setUser(userData);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    if (!initialized) {
      initAuth();
    }
  }, [initialized]);

  // Segundo useEffect: Manejo de recuperación de sesión
  useEffect(() => {
    // Este efecto se ejecuta cuando:
    // 1. El componente ya está inicializado (initialized = true)
    // 2. No hay usuario autenticado (user = null)
    // 3. No se está cargando actualmente (loading = false)
    // 4. Existe un token en localStorage
    const checkAuth = async () => {
      if (initialized && !user && !loading && localStorage.getItem('token')) {
        setLoading(true);
        try {
          const userData = await getCurrentUser();
          if (userData) {
            console.log("Recuperando sesión, datos del usuario:", userData);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          // Si hay error, probablemente el token es inválido o expiró
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
  }, [user, loading, initialized]);

  const updateUser = (userData) => {
    setUser({
      ...userData,
      password_change_required: userData.password_change_required || false
    });
  };
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Determinar los roles correctamente con mayor precisión
  const isSuperAdminRole = user?.role === 'admin';
  const isSedesAdminRole = user?.role === 'sedes_admin';
  const isHospitalAdminRole = user?.role === 'hospital_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        isAuthenticated: !!user,
        // Roles específicos
        isSuperAdmin: isSuperAdminRole,
        // SEDES Admin también incluye al Super Admin
        isSedesAdmin: isSedesAdminRole || isSuperAdminRole,
        // Hospital Admin es solo hospital_admin (no hereda permisos de SEDES)
        isHospitalAdmin: isHospitalAdminRole,
        // Admin incluye cualquier tipo de administrador
        isAdmin: isSuperAdminRole || isSedesAdminRole || isHospitalAdminRole,
        // Personal médico
        isMedicalStaff: ['doctor', 'nurse'].includes(user?.role),
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};