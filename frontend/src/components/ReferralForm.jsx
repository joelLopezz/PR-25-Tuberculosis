/* eslint-disable no-unused-vars */
// src/components/ReferralForm.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getPatientById } from '../services/patientService';
import { 
  checkPatientPendingReferrals,
  getAvailableHospitalsForReferral,
  getPatientHospitalHistory 
} from '../services/referralService';
import { useAuth } from '../context/AuthContext';
import PatientSearchField from './PatientSearchField';

const ReferralForm = ({ initialValues = {}, onSubmit, patientId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableHospitals, setAvailableHospitals] = useState([]); // ⭐ Cambiado de hospitals
  const [hospitalHistory, setHospitalHistory] = useState([]); // ⭐ Nuevo estado
  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [pendingReferralError, setPendingReferralError] = useState('');
  const [noHospitalsAvailable, setNoHospitalsAvailable] = useState(false); // ⭐ Nuevo estado
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

  // ⭐ NUEVA FUNCIÓN: Cargar hospitales disponibles y historial
  const loadPatientHospitalData = async (selectedPatientId) => {
    if (!selectedPatientId) {
      setAvailableHospitals([]);
      setHospitalHistory([]);
      setNoHospitalsAvailable(false);
      return;
    }

    try {
      setLoadingPatient(true);
      
      // Cargar en paralelo: hospitales disponibles e historial
      const [availableData, historyData] = await Promise.all([
        getAvailableHospitalsForReferral(selectedPatientId),
        getPatientHospitalHistory(selectedPatientId)
      ]);
      
      setAvailableHospitals(availableData.availableHospitals || []);
      setHospitalHistory(historyData.hospitalHistory || []);
      setNoHospitalsAvailable(availableData.availableHospitals.length === 0);
      
      console.log('Hospitales disponibles:', availableData.availableHospitals.length);
      console.log('Historial:', historyData.hospitalHistory.length);
      
    } catch (error) {
      console.error("Error al cargar datos de hospitalización:", error);
      setAvailableHospitals([]);
      setHospitalHistory([]);
      setNoHospitalsAvailable(true);
    } finally {
      setLoadingPatient(false);
    }
  };

  // Cargar datos del paciente al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (patientId) {
        setLoadingPatient(true);
        try {
          const patientData = await getPatientById(patientId);
          setPatient(patientData);
          
          // Cargar hospitales disponibles para este paciente
          await loadPatientHospitalData(patientId);
        } catch (error) {
          console.error("Error al cargar datos del paciente:", error);
        } finally {
          setLoadingPatient(false);
        }
      }
    };
    
    fetchData();
  }, [patientId]);

  // ⭐ MODIFICADA: Manejar cambio de paciente
  const handlePatientChange = async (formikProps, selectedPatientId) => {
    if (!selectedPatientId) {
      setPatient(null);
      setPendingReferralError('');
      setAvailableHospitals([]);
      setHospitalHistory([]);
      setNoHospitalsAvailable(false);
      return;
    }

    try {
      setLoadingPatient(true);
      setPendingReferralError('');
      
      const patientData = await getPatientById(selectedPatientId);
      setPatient(patientData);
      
      // Cargar hospitales disponibles para este paciente
      await loadPatientHospitalData(selectedPatientId);
      
      // Limpiar hospital de destino seleccionado porque la lista cambió
      if (formikProps.values.destination_hospital_id) {
        formikProps.setFieldValue('destination_hospital_id', '');
      }
      
    } catch (error) {
      console.error("Error al cargar datos del paciente:", error);
    } finally {
      setLoadingPatient(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setLoading(true);
      setPendingReferralError('');
      
      // Verificar referencias pendientes antes de enviar
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
      
      // Manejar errores específicos del historial
      if (error.message && error.message.includes('ya estuvo allí')) {
        setPendingReferralError(error.message);
        setFieldError('destination_hospital_id', 'Hospital no disponible');
      } else if (error.message && error.message.includes('referencia pendiente')) {
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
              {/* Mensaje de error general */}
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

              {/* ⭐ NUEVO: Mensaje si no hay hospitales disponibles */}
              {noHospitalsAvailable && patient && (
                <div className="col-span-2 bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-orange-800">
                        Sin hospitales disponibles
                      </h3>
                      <div className="mt-2 text-sm text-orange-700">
                        <p>Este paciente ya ha estado en todos los hospitales disponibles del sistema. No se pueden crear más referencias.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ⭐ NUEVO: Mostrar historial de hospitales */}
              {hospitalHistory.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-semibold text-blue-800 mb-2">📍 Historial de Hospitales</h3>
                  <div className="text-sm text-blue-700">
                    <p className="mb-2">Hospitales donde ha estado este paciente:</p>
                    <div className="flex flex-wrap gap-2">
                      {hospitalHistory.map((hospital, index) => (
                        <span 
                          key={hospital.id} 
                          className={`px-2 py-1 rounded-full text-xs ${
                            hospital.tipo === 'actual' 
                              ? 'bg-green-100 text-green-800 font-semibold' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {hospital.name} {hospital.tipo === 'actual' && '(Actual)'}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs italic">
                      ℹ️ Solo se mostrarán hospitales donde el paciente NO ha estado antes.
                    </p>
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
                {/* Paciente - Solo si no viene pre-seleccionado */}
                {!patientId && (
                  <div>
                    <PatientSearchField
                      name="patient_id"
                      label="Paciente"
                      placeholder="Buscar paciente por nombre o CI..."
                      required={true}
                      onPatientChange={(patientId) => handlePatientChange(formikProps, patientId)}
                    />
                  </div>
                )}
                
                {/* ⭐ MODIFICADO: Hospital de destino */}
                <div>
                  <label htmlFor="destination_hospital_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital de destino <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="destination_hospital_id"
                    id="destination_hospital_id"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    disabled={noHospitalsAvailable}
                  >
                    <option value="">
                      {noHospitalsAvailable 
                        ? "No hay hospitales disponibles" 
                        : "Seleccionar hospital"}
                    </option>
                    {availableHospitals.map(hospital => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                        {hospital.network_name && ` - ${hospital.network_name}`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="destination_hospital_id" component="div" className="mt-1 text-sm text-red-600" />
                  {availableHospitals.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      ✅ {availableHospitals.length} hospital(es) disponible(s) para referencia
                    </p>
                  )}
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
                  disabled={formikProps.isSubmitting || loading || !!pendingReferralError || noHospitalsAvailable}
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