// src/pages/ResetPassword.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { resetPassword, verifyResetToken } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verificar token al cargar
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        // Verificamos si el token es válido
        await verifyResetToken(token);
        setTokenValid(true);
      } catch (error) {
        console.error('Error al verificar token:', error);
        setTokenValid(false);
        toast.error('El enlace de recuperación no es válido o ha expirado');
      } finally {
        setTokenChecked(true);
        setIsLoading(false);
      }
    };
    
    if (token) {
      checkToken();
    } else {
      setTokenChecked(true);
      setTokenValid(false);
    }
  }, [token]);
  
  // Esquema de validación
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      ),
    confirmPassword: Yup.string()
      .required('Confirme su contraseña')
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
  });
  
  // Valores iniciales
  const initialValues = {
    password: '',
    confirmPassword: ''
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      
      // Llamada al servicio de API para restablecer la contraseña
      await resetPassword(token, values.password);
      
      // Mostrar mensaje de éxito
      toast.success('Contraseña restablecida correctamente');
      
      // Redirigir al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast.error(error.response?.data?.message || 'Error al restablecer la contraseña. Intente nuevamente.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600">Verificando enlace de recuperación...</p>
        </div>
      </div>
    );
  }
  
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center">
              <svg 
                className="h-16 w-16 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Enlace no válido</h2>
            <p className="mt-2 text-sm text-gray-600">
              El enlace de recuperación no es válido o ha expirado. Por favor, solicite un nuevo enlace.
            </p>
            <div className="mt-5">
              <Link 
                to="/olvide-password" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <svg 
              className="h-16 w-16 text-teal-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Crear nueva contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor ingrese su nueva contraseña para completar el proceso de recuperación.
          </p>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {/* Nueva contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Ingrese su nueva contraseña"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-2.796 0-5.487-1.2-7.938-3.562A19.937 19.937 0 012.282 12a19.937 19.937 0 014.578-3.562C9.5 6.55 12.033 5.75 14.815 6.15c3.6.52 6.525 2.462 8.902 5.85-1.274 2.25-2.849 4.087-4.994 5.212"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.94 10.94l3.12 3.12M6.94 6.94l6.12 6.12"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
                <p className="mt-1 text-xs text-gray-500">
                  La contraseña debe tener al menos 8 caracteres e incluir letras mayúsculas, 
                  minúsculas, números y caracteres especiales.
                </p>
              </div>
              
              {/* Confirmar contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirme su nueva contraseña"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-2.796 0-5.487-1.2-7.938-3.562A19.937 19.937 0 012.282 12a19.937 19.937 0 014.578-3.562C9.5 6.55 12.033 5.75 14.815 6.15c3.6.52 6.525 2.462 8.902 5.85-1.274 2.25-2.849 4.087-4.994 5.212"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.94 10.94l3.12 3.12M6.94 6.94l6.12 6.12"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="mt-1 text-sm text-red-600" 
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Guardar nueva contraseña'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SEDES Cochabamba - Programa de Tuberculosis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;