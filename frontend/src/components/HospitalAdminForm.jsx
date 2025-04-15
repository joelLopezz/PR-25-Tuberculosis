/* eslint-disable no-unused-vars */
// src/components/HospitalAdminForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getAllHospitals } from '../services/hospitalService';

const HospitalAdminForm = ({ initialValues, onSubmit, isEditing = false }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Esquema de validación
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('El nombre de usuario es obligatorio')
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(50, 'El nombre de usuario no puede tener más de 50 caracteres'),
    email: Yup.string()
      .email('Ingrese un correo electrónico válido')
      .required('El correo electrónico es obligatorio'),
    hospital_id: Yup.number()
      .required('El hospital es obligatorio')
      .positive('Debe seleccionar un hospital válido')
  });

  // Valores por defecto
  const defaultValues = {
    username: '',
    email: '',
    hospital_id: ''
  };

  // Cargar hospitales al montar el componente
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals();
        // Filtrar hospitales que ya tienen un administrador asignado si estamos creando un nuevo admin
        if (!isEditing) {
          // Aquí deberíamos filtrar, pero necesitaríamos una API que nos diga qué hospitales
          // ya tienen un administrador asignado. Por ahora, dejaremos todos los hospitales.
        }
        setHospitals(data);
      } catch (error) {
        toast.error('Error al cargar hospitales');
      }
    };

    fetchHospitals();
  }, [isEditing]);

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await onSubmit(values);
      toast.success(`Administrador de hospital ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      navigate('/admins-hospital');
    } catch (error) {
      toast.error(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} administrador de hospital`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ ...defaultValues, ...initialValues }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-blue-700">
              <h3 className="text-lg font-medium text-white">
                {isEditing ? 'Editar Administrador de Hospital' : 'Registrar Nuevo Administrador de Hospital'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre de usuario */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de usuario <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Ingrese nombre de usuario"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Correo electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Ingrese correo electrónico"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Hospital */}
                <div className="md:col-span-2">
                  <label htmlFor="hospital_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="hospital_id"
                    id="hospital_id"
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    disabled={isEditing} // No permitir cambiar el hospital en modo edición
                  >
                    <option value="">Seleccione un hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="hospital_id" component="div" className="mt-1 text-sm text-red-600" />
                  
                  {isEditing && (
                    <div className="mt-1 text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        El hospital no se puede cambiar después de crear el administrador.
                      </div>
                    </div>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="md:col-span-2">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700">
                            Se generará una contraseña automáticamente y se enviará 
                            al correo electrónico proporcionado. El administrador 
                            deberá cambiarla en su primer inicio de sesión.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admins-hospital')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  `${isEditing ? 'Actualizar' : 'Guardar'}`
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HospitalAdminForm;