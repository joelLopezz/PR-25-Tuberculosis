/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { changePassword } from '../services/staffService';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  // Estados para controlar la visibilidad de cada campo de contraseña
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user, updateUser } = useAuth(); // Asegúrate de obtener updateUser
  const navigate = useNavigate();

  // Esquema de validación
  const validationSchema = Yup.object({
    current_password: Yup.string()
      .required('La contraseña actual es obligatoria'),
    new_password: Yup.string()
      .required('La nueva contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      ),
    confirm_password: Yup.string()
      .required('Confirme la nueva contraseña')
      .oneOf([Yup.ref('new_password'), null], 'Las contraseñas deben coincidir')
  });

  // Valores iniciales
  const initialValues = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setLoading(true);
      const response = await changePassword({
        current_password: values.current_password,
        new_password: values.new_password
      });
      
      // Actualizar el estado del usuario para quitar la bandera de cambio de contraseña
      if (user && updateUser) { // Verificar que updateUser existe
        updateUser({
          ...user,
          password_change_required: false
        });
      } else {
        console.warn("No se pudo actualizar el estado del usuario - updateUser no disponible");
      }
      
      toast.success('Contraseña actualizada correctamente');
      resetForm();
      
      // Redirigir a la página principal después de cambiar la contraseña
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Función para renderizar el botón de toggle de visualización
  const renderPasswordToggle = (isVisible, setVisibility) => (
    <div
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm cursor-pointer z-10"
      onClick={(e) => {
        e.stopPropagation();
        setVisibility(!isVisible);
      }}
    >
      {isVisible ? (
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
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-blue-700">
          <h2 className="text-xl font-bold text-white">Cambiar Contraseña</h2>
        </div>
        
        <div className="p-6">
          {user && user.first_name && (
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-700">
                Bienvenido/a, <strong>{user.first_name} {user.last_name}</strong>. 
                {user.password_change_required 
                  ? ' Para continuar, por favor cambie su contraseña temporal por una permanente.'
                  : ' Puede cambiar su contraseña en cualquier momento para mayor seguridad.'}
              </p>
            </div>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Contraseña actual */}
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showCurrentPassword ? "text" : "password"}
                      name="current_password"
                      id="current_password"
                      placeholder="Ingrese su contraseña actual"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    />
                    {renderPasswordToggle(showCurrentPassword, setShowCurrentPassword)}
                  </div>
                  <ErrorMessage 
                    name="current_password" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>
                
                {/* Nueva contraseña */}
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      id="new_password"
                      placeholder="Ingrese su nueva contraseña"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    />
                    {renderPasswordToggle(showNewPassword, setShowNewPassword)}
                  </div>
                  <ErrorMessage 
                    name="new_password" 
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
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      id="confirm_password"
                      placeholder="Confirme su nueva contraseña"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    />
                    {renderPasswordToggle(showConfirmPassword, setShowConfirmPassword)}
                  </div>
                  <ErrorMessage 
                    name="confirm_password" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cambiando contraseña...
                      </span>
                    ) : (
                      'Cambiar contraseña'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;