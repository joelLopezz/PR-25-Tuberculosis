/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllHospitals } from '../services/hospitalService';

const Dashboard = () => {
  const { user, isSuperAdmin, isSedesAdmin, isHospitalAdmin, isMedicalStaff } = useAuth();
  const [hospitalCount, setHospitalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Solo cargar hospitales si el usuario tiene acceso a ellos
        if (isSedesAdmin || isHospitalAdmin) {
          const hospitals = await getAllHospitals();
          setHospitalCount(hospitals.length);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isSedesAdmin, isHospitalAdmin]);

  // Determinar el tipo de rol para mostrar el saludo personalizado
  const getUserRoleLabel = () => {
    if (user.role === 'admin') return 'Administrador Principal';
    if (user.role === 'sedes_admin') return 'Administrador SEDES';
    if (user.role === 'hospital_admin') return 'Administrador de Hospital';
    if (user.role === 'doctor') return 'Médico';
    if (user.role === 'nurse') return 'Enfermero/a';
    return 'Usuario';
  };

  return (
    <div>
      {/* Encabezado de bienvenida */}
      <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-teal-700 to-blue-700">
          <h1 className="text-2xl font-bold text-white">
            Bienvenido/a, {user?.first_name || user?.username}
          </h1>
          <p className="mt-1 text-teal-100">
            Sistema de Transferencia de Pacientes con Tuberculosis - SEDES Cochabamba
          </p>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Usted ha ingresado como <span className="font-medium">{getUserRoleLabel()}</span>
            {user?.hospital && (
              <span> del <span className="font-medium">{user.hospital}</span></span>
            )}
          </p>
        </div>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* TARJETA 1: HOSPITALES */}
        {/* Vista completa (SEDES Admin y Super Admin) */}
        {isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-blue-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-800">Hospitales</h2>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-blue-600">{hospitalCount}</p>
                    <p className="text-sm text-gray-600 mt-1">Hospitales registrados</p>
                  </div>
                  <Link 
                    to="/hospitals" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-300"
                  >
                    Gestionar hospitales
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Vista de solo lectura para Hospital Admin */}
        {isHospitalAdmin && !isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-blue-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-800">Directorio de Hospitales</h2>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consulte información de hospitales de la red</p>
                </div>
                <Link 
                  to="/hospitals-view" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-300"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Ver hospitales
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Vista de solo lectura para médicos */}
        {isMedicalStaff && !isHospitalAdmin && !isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-blue-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-800">Directorio de Hospitales</h2>
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consulte información de hospitales de la red</p>
                </div>
                <Link 
                  to="/hospitals-view" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-300"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Ver hospitales
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TARJETA 2: PERSONAL MÉDICO - Solo para Hospital Admin (no SEDES Admin) */}
        {isHospitalAdmin && !isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-green-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Personal Médico</h2>
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gestione el personal médico de su hospital</p>
                </div>
                <Link 
                  to="/personal" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-300"
                >
                  Gestionar personal
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Vista solo lectura del personal para médicos */}
        {isMedicalStaff && !isHospitalAdmin && !isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-green-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Personal Médico</h2>
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consulte información del personal médico</p>
                </div>
                <Link 
                  to="/personal-view" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-300"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Ver personal
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TARJETA 3: ADMINISTRADORES DE HOSPITAL - Solo para SEDES Admin */}
        {isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-green-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Administradores de Hospital</h2>
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gestione los administradores de hospitales</p>
                </div>
                <Link 
                  to="/admins-hospital" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-300"
                >
                  Gestionar administradores
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TARJETA 4: REDES DE SALUD */}
        {/* Vista completa (SEDES Admin) */}
        {isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-purple-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-purple-800">Redes de Salud</h2>
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gestione las redes de salud</p>
                </div>
                <Link 
                  to="/redes" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-colors duration-300"
                >
                  Gestionar redes
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Vista solo lectura (Hospital Admin) */}
        {isHospitalAdmin && !isSedesAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:transform hover:scale-105">
            <div className="px-6 py-4 bg-purple-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-purple-800">Redes de Salud</h2>
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consulte información de redes de salud</p>
                </div>
                <Link 
                  to="/networks-view" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-colors duration-300"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Ver redes
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de configuración personal */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800">
          <h2 className="text-lg font-semibold text-white">Configuración de Cuenta</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cambiar su contraseña actual</p>
            </div>
            <Link 
              to="/cambiar-password" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-300"
            >
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              Cambiar contraseña
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;