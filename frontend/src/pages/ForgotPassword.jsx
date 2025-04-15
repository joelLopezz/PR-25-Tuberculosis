// src/pages/ForgotPassword.jsx
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Esquema de validación
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required('Por favor ingrese su correo electrónico o nombre de usuario')
  });
  
  // Valores iniciales
  const initialValues = {
    identifier: ''
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      
      // Llamada al servicio de API para solicitar restablecimiento de contraseña
      await forgotPassword(values.identifier);
      
      // Mostrar mensaje de éxito
      setEmailSent(true);
      toast.success('Se ha enviado un enlace de recuperación a su correo electrónico');
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud. Intente nuevamente.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              >
              </path>
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Recuperar contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingrese su correo electrónico o nombre de usuario y le enviaremos instrucciones para restablecer su contraseña.
          </p>
        </div>
        
        {emailSent ? (
          <div className="mt-8">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Solicitud enviada</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Hemos enviado un correo electrónico con las instrucciones para restablecer su contraseña. Por favor revise su bandeja de entrada.</p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-teal-600 hover:text-teal-500"
                    >
                      Volver a iniciar sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico o nombre de usuario
                  </label>
                  <Field
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="email"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Ingrese su correo electrónico o usuario"
                  />
                  <ErrorMessage 
                    name="identifier" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
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
                      'Enviar instrucciones'
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    Volver a iniciar sesión
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SEDES Cochabamba - Programa de Tuberculosis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;