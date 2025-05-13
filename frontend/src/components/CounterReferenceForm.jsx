/* eslint-disable no-unused-vars */
// src/components/CounterReferenceForm.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getReferralById } from '../services/referralService';

const CounterReferenceForm = ({ initialValues = {}, onSubmit, referralId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState(null);
  const [loadingReferral, setLoadingReferral] = useState(false);

  // Esquema de validación
  const validationSchema = Yup.object({
    referral_id: Yup.number()
      .required('La referencia es requerida'),
    counter_reference_date: Yup.date()
      .required('La fecha de contrareferencia es requerida'),
    diagnosis_update: Yup.string()
      .nullable()
      .max(1000, 'La actualización de diagnóstico no puede tener más de 1000 caracteres'),
    treatment_provided: Yup.string()
      .required('El tratamiento proporcionado es requerido')
      .max(2000, 'El tratamiento no puede tener más de 2000 caracteres'),
    recommendations: Yup.string()
      .nullable()
      .max(1000, 'Las recomendaciones no pueden tener más de 1000 caracteres'),
    notes: Yup.string()
      .nullable()
      .max(1000, 'Las notas no pueden tener más de 1000 caracteres'),
  });

  // Valores por defecto
  const defaultValues = {
    referral_id: referralId || '',
    counter_reference_date: new Date().toISOString().substr(0, 10), // Fecha actual en formato YYYY-MM-DD
    diagnosis_update: '',
    treatment_provided: '',
    recommendations: '',
    notes: '',
  };

  // Cargar datos de la referencia al montar el componente
  useEffect(() => {
    const fetchReferral = async () => {
      if (!referralId) return;
      
      try {
        setLoadingReferral(true);
        const data = await getReferralById(referralId);
        setReferral(data);
      } catch (error) {
        console.error("Error al cargar referencia:", error);
      } finally {
        setLoadingReferral(false);
      }
    };
    
    fetchReferral();
  }, [referralId]);

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
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
      <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-blue-700">
        <h2 className="text-xl font-semibold text-white">
          Crear Contrareferencia
        </h2>
      </div>
      
      {loadingReferral ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando datos de la referencia...</p>
        </div>
      ) : (
        <Formik
          initialValues={{ ...defaultValues, ...initialValues }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="p-6 space-y-4">
              {/* Información de la referencia (si está disponible) */}
              {referral && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-semibold text-blue-800">Información de la Referencia</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Paciente:</p>
                      <p className="font-medium">{referral.patient_first_name} {referral.patient_last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de referencia:</p>
                      <p className="font-medium">{new Date(referral.reference_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital origen:</p>
                      <p className="font-medium">{referral.source_hospital_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital destino:</p>
                      <p className="font-medium">{referral.destination_hospital_name}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Motivo de referencia:</p>
                      <p className="font-medium">{referral.reason}</p>
                    </div>
                    {referral.diagnosis && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Diagnóstico inicial:</p>
                        <p className="font-medium">{referral.diagnosis}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha de contrareferencia */}
                <div>
                  <label htmlFor="counter_reference_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de contrareferencia <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="date"
                    name="counter_reference_date"
                    id="counter_reference_date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  <ErrorMessage name="counter_reference_date" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Campo vacío para alinear grid */}
                <div></div>
              </div>
              
              {/* Actualización de diagnóstico */}
              <div>
                <label htmlFor="diagnosis_update" className="block text-sm font-medium text-gray-700 mb-1">
                  Actualización de diagnóstico
                </label>
                <Field
                  as="textarea"
                  name="diagnosis_update"
                  id="diagnosis_update"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="diagnosis_update" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Tratamiento proporcionado */}
              <div>
                <label htmlFor="treatment_provided" className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento proporcionado <span className="text-red-600">*</span>
                </label>
                <Field
                  as="textarea"
                  name="treatment_provided"
                  id="treatment_provided"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="treatment_provided" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Recomendaciones */}
              <div>
                <label htmlFor="recommendations" className="block text-sm font-medium text-gray-700 mb-1">
                  Recomendaciones
                </label>
                <Field
                  as="textarea"
                  name="recommendations"
                  id="recommendations"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="recommendations" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Notas adicionales */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <Field
                  as="textarea"
                  name="notes"
                  id="notes"
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/contrareferencias')}
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
                    'Crear Contrareferencia'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default CounterReferenceForm;