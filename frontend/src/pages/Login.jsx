/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { login, getCurrentUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  // Esquema de validación modificado para permitir username o email
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required('El usuario o correo electrónico es obligatorio'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
  });

  // Valores iniciales del formulario
  const initialValues = {
    identifier: '',
    password: ''
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    
    try {
      // Realizar login con identifier en lugar de email
      const response = await login({
        identifier: values.identifier,
        password: values.password
      });
      
      if (response.token) {
        // Si login fue exitoso, obtener datos del usuario
        try {
          const userData = await getCurrentUser();
          
          // Añadir la bandera de password_change_required desde la respuesta del login
          userData.password_change_required = response.password_change_required;
          
          updateUser(userData);
          
          toast.success('¡Inicio de sesión exitoso!');
          
          // Modificado: Ahora redirige al dashboard en lugar de a hospitals
          setTimeout(() => {
            if (response.password_change_required) {
              navigate('/cambiar-password');
            } else {
              navigate('/dashboard');  // Cambiado de '/hospitals' a '/dashboard'
            }
          }, 500);
        } catch (userError) {
          console.error('Error al obtener datos del usuario:', userError);
          toast.error('Sesión iniciada pero no se pudieron cargar los datos de usuario');
        }
      }
    } catch (error) {
      console.error('Error de login:', error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
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
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">SEDES Cochabamba</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Transferencia de Pacientes con Tuberculosis
          </p>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md -space-y-px">
                <div className="mb-4">
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario o correo electrónico
                  </label>
                  <Field
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Ingrese su usuario o correo electrónico"
                  />
                  <ErrorMessage 
                    name="identifier" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="appearance-none rounded-md relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                      placeholder="Ingrese su contraseña"
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
                </div>
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
                    'Iniciar sesión'
                  )}
                </button>
                <div className="text-center mt-3">
                  <Link 
                    to="/olvide-password" 
                    className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
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

export default Login;