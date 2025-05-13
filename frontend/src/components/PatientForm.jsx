/* eslint-disable no-unused-vars */
// src/components/PatientForm.jsx
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const PatientForm = ({ initialValues = {}, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Esquema de validación
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'El nombre no puede tener más de 100 caracteres'),
    last_name: Yup.string()
      .required('El apellido es requerido')
      .max(100, 'El apellido no puede tener más de 100 caracteres'),
    ci: Yup.string()
      .nullable()
      .max(20, 'La CI no puede tener más de 20 caracteres'),
    birthdate: Yup.date()
      .required('La fecha de nacimiento es requerida'),
    gender: Yup.string()
      .required('El género es requerido')
      .oneOf(['M', 'F', 'O'], 'Seleccione un género válido'),
    phone: Yup.string()
      .nullable()
      .max(20, 'El teléfono no puede tener más de 20 caracteres'),
    address: Yup.string()
      .nullable()
      .max(255, 'La dirección no puede tener más de 255 caracteres'),
    diagnosis_date: Yup.date()
      .nullable(),
    tb_type: Yup.string()
      .required('El tipo de tuberculosis es requerido')
      .oneOf(['Pulmonar', 'Extrapulmonar'], 'Seleccione un tipo válido'),
  });
  
  // Valores por defecto
  const defaultValues = {
    first_name: '',
    last_name: '',
    ci: '',
    birthdate: '',
    gender: '',
    phone: '',
    address: '',
    diagnosis_date: '',
    tb_type: '',
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        // No es necesario formatear aquí si ya lo hacemos en el backend
      };
      await onSubmit(values);
      // No navegamos aquí, dejamos que el componente padre maneje la redirección
    } catch (error) {
      console.error('Error en el formulario:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-blue-700">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
        </h2>
      </div>
      
      <Formik
        initialValues={{ ...defaultValues, ...initialValues }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <Field
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="first_name" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Apellido */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-600">*</span>
                </label>
                <Field
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="last_name" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* CI */}
              <div>
                <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-1">
                  CI
                </label>
                <Field
                  type="text"
                  name="ci"
                  id="ci"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="ci" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Fecha de nacimiento */}
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de nacimiento <span className="text-red-600">*</span>
                </label>
                <Field
                  type="date"
                  name="birthdate"
                  id="birthdate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="birthdate" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Género */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Género <span className="text-red-600">*</span>
                </label>
                <Field
                  as="select"
                  name="gender"
                  id="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Fecha de diagnóstico */}
              <div>
                <label htmlFor="diagnosis_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de diagnóstico
                </label>
                <Field
                  type="date"
                  name="diagnosis_date"
                  id="diagnosis_date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="diagnosis_date" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Tipo de tuberculosis */}
              <div>
                <label htmlFor="tb_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de tuberculosis <span className="text-red-600">*</span>
                </label>
                <Field
                  as="select"
                  name="tb_type"
                  id="tb_type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Pulmonar">Pulmonar</option>
                  <option value="Extrapulmonar">Extrapulmonar</option>
                </Field>
                <ErrorMessage name="tb_type" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            {/* Dirección (fila completa) */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <Field
                as="textarea"
                name="address"
                id="address"
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
              <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/pacientes')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  `${isEditing ? 'Actualizar' : 'Guardar'} paciente`
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PatientForm;