/* eslint-disable no-unused-vars */
// src/components/ReferralForm.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getAllHospitals } from '../services/hospitalService';
import { getPatientById } from '../services/patientService';
import { checkPatientPendingReferrals } from '../services/referralService'; // ⭐ AGREGAR ESTA IMPORTACIÓN
import { useAuth } from '../context/AuthContext';
import PatientSearchField from './PatientSearchField';

const ReferralForm = ({ initialValues = {}, onSubmit, patientId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [pendingReferralError, setPendingReferralError] = useState(''); // ⭐ AGREGAR ESTE ESTADO
  const { user } = useAuth();

  // Esquema de validación
  const validationSchema = Yup.object({
    patient_id: Yup.string()
      .required('El paciente es requerido'),
    destination_hospital_id: Yup.number()
      .required('El hospital de destino es requerido'),
    reference_date: Yup.date()
      .required('La fecha de referencia es requerida'),
    reason: Yup.string()
      .required('El motivo de referencia es requerido')
      .max(1000, 'El motivo no puede tener más de 1000 caracteres'),
    diagnosis: Yup.string()
      .nullable()
      .max(1000, 'El diagnóstico no puede tener más de 1000 caracteres'),
    clinical_summary: Yup.string()
      .nullable()
      .max(2000, 'El resumen clínico no puede tener más de 2000 caracteres'),
    urgency_level: Yup.string()
      .required('El nivel de urgencia es requerido')
      .oneOf(['Baja', 'Media', 'Alta'], 'Seleccione un nivel válido'),
    notes: Yup.string()
      .nullable()
      .max(1000, 'Las notas no pueden tener más de 1000 caracteres'),
  });

  // Valores por defecto
  const defaultValues = {
    patient_id: patientId || '',
    destination_hospital_id: '',
    reference_date: new Date().toISOString().substr(0, 10),
    reason: '',
    diagnosis: '',
    clinical_summary: '',
    urgency_level: 'Media',
    notes: '',
  };

  // Cargar hospitales y datos del paciente al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalsData = await getAllHospitals();
        setHospitals(hospitalsData);
        
        if (patientId) {
          setLoadingPatient(true);
          const patientData = await getPatientById(patientId);
          setPatient(patientData);
          
          const filtered = hospitalsData.filter(hospital => {
            const hospitalId = typeof hospital.id === 'string' ? parseInt(hospital.id, 10) : hospital.id;
            const patientHospitalId = typeof patientData.hospital_id === 'string' ? 
              parseInt(patientData.hospital_id, 10) : patientData.hospital_id;
            
            return hospitalId !== patientHospitalId;
          });
          
          setFilteredHospitals(filtered);
        } else {
          setFilteredHospitals(hospitalsData);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoadingPatient(false);
      }
    };
    
    fetchData();
  }, [patientId]);

  // Actualizar datos del paciente cuando cambia el ID
  const handlePatientChange = async (formikProps, patientId) => {
    if (!patientId) {
      setPatient(null);
      setPendingReferralError(''); // ⭐ LIMPIAR ERROR AL CAMBIAR PACIENTE
      return;
    }

    try {
      setLoadingPatient(true);
      setPendingReferralError(''); // ⭐ LIMPIAR ERROR AL CAMBIAR PACIENTE
      
      const patientData = await getPatientById(patientId);
      setPatient(patientData);
      
      if (hospitals.length > 0) {
        const filtered = hospitals.filter(hospital => {
          const hospitalId = typeof hospital.id === 'string' ? parseInt(hospital.id, 10) : hospital.id;
          const patientHospitalId = typeof patientData.hospital_id === 'string' ? 
            parseInt(patientData.hospital_id, 10) : patientData.hospital_id;
          
          return hospitalId !== patientHospitalId;
        });
        
        setFilteredHospitals(filtered);
        
        if (formikProps.values.destination_hospital_id) {
          const destHospitalId = parseInt(formikProps.values.destination_hospital_id, 10);
          if (destHospitalId === patientData.hospital_id) {
            formikProps.setFieldValue('destination_hospital_id', '');
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del paciente:", error);
    } finally {
      setLoadingPatient(false);
    }
  };

  // ⭐ MODIFICAR ESTA FUNCIÓN - Agregar validación de referencias pendientes
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setLoading(true);
      setPendingReferralError(''); // Limpiar errores previos
      
      // ⭐ NUEVA VALIDACIÓN: verificar referencias pendientes antes de enviar
      if (values.patient_id) {
        const hasPendingReferral = await checkPatientPendingReferrals(values.patient_id);
        if (hasPendingReferral) {
          setPendingReferralError('Este paciente ya tiene una referencia pendiente. No se puede crear otra referencia hasta que la actual sea procesada.');
          setFieldError('patient_id', 'Paciente con referencia pendiente');
          return;
        }
      }
      
      await onSubmit(values);
    } catch (error) {
      console.error('Error en el formulario:', error);
      // Si el error viene del backend sobre referencia pendiente, mostrarlo
      if (error.message && error.message.includes('referencia pendiente')) {
        setPendingReferralError(error.message);
        setFieldError('patient_id', 'Paciente con referencia pendiente');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-blue-700">
        <h2 className="text-xl font-semibold text-white">
          Crear Nueva Referencia
        </h2>
      </div>
      
      {loadingPatient ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando datos del paciente...</p>
        </div>
      ) : (
        <Formik
          initialValues={{ ...defaultValues, ...initialValues }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formikProps) => (
            <Form className="p-6 space-y-4">
              {/* ⭐ AGREGAR MENSAJE DE ERROR DE REFERENCIA PENDIENTE */}
              {pendingReferralError && (
                <div className="col-span-2 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        No se puede crear la referencia
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{pendingReferralError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Información del paciente (si está disponible) */}
              {patient && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-semibold text-blue-800">Información del Paciente</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre:</p>
                      <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CI:</p>
                      <p className="font-medium">{patient.ci || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de TB:</p>
                      <p className="font-medium">{patient.tb_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital actual:</p>
                      <p className="font-medium">{patient.hospital_name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paciente - Reemplazado con el buscador inteligente */}
                {!patientId && (
                  <div>
                    <PatientSearchField
                      name="patient_id"
                      label="Paciente"
                      placeholder="Buscar paciente por nombre o CI..."
                      required={true}
                    />
                  </div>
                )}
                
                {/* Hospital de destino */}
                <div>
                  <label htmlFor="destination_hospital_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital de destino <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="destination_hospital_id"
                    id="destination_hospital_id"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  >
                    <option value="">Seleccionar hospital</option>
                    {filteredHospitals.map(hospital => {
                      const hospitalId = typeof hospital.id === 'string' ? parseInt(hospital.id, 10) : hospital.id;
                      const userHospitalId = user?.hospital_id ? 
                        (typeof user.hospital_id === 'string' ? parseInt(user.hospital_id, 10) : user.hospital_id) : null;
                      
                      if (userHospitalId && hospitalId === userHospitalId) {
                        return null;
                      }
                      
                      return (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage name="destination_hospital_id" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Fecha de referencia */}
                <div>
                  <label htmlFor="reference_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de referencia <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="date"
                    name="reference_date"
                    id="reference_date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  <ErrorMessage name="reference_date" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                {/* Nivel de urgencia */}
                <div>
                  <label htmlFor="urgency_level" className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel de urgencia <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="urgency_level"
                    id="urgency_level"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </Field>
                  <ErrorMessage name="urgency_level" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              {/* Motivo de referencia */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de referencia <span className="text-red-600">*</span>
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  id="reason"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="reason" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Diagnóstico */}
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico
                </label>
                <Field
                  as="textarea"
                  name="diagnosis"
                  id="diagnosis"
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="diagnosis" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {/* Resumen clínico */}
              <div>
                <label htmlFor="clinical_summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Resumen clínico
                </label>
                <Field
                  as="textarea"
                  name="clinical_summary"
                  id="clinical_summary"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
                <ErrorMessage name="clinical_summary" component="div" className="mt-1 text-sm text-red-600" />
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
                  onClick={() => navigate('/referencias')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formikProps.isSubmitting || loading || !!pendingReferralError} // ⭐ DESHABILITAR SI HAY ERROR
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
                    'Crear Referencia'
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

export default ReferralForm;