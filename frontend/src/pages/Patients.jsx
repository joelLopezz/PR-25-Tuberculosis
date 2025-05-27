/* eslint-disable no-unused-vars */
// src/pages/Patients.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPatients, deletePatient } from '../services/patientService';
import { getAllReferrals } from '../services/referralService'; // ⭐ AGREGAR ESTA IMPORTACIÓN
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const navigate = useNavigate();

  // ⭐ MODIFICAR ESTE useEffect - Cargar pacientes y referencias
  useEffect(() => {
    fetchPatientsWithReferralStatus();
  }, []);

  // ⭐ NUEVA FUNCIÓN - Cargar pacientes con estado de referencias
  const fetchPatientsWithReferralStatus = async () => {
    try {
      setLoading(true);
      // Cargar pacientes y referencias al mismo tiempo
      const [patientsData, referralsData] = await Promise.all([
        getAllPatients(),
        getAllReferrals()
      ]);
      
      // Crear un mapa de pacientes con referencias pendientes
      const patientsWithPendingReferrals = referralsData
        .filter(referral => referral.status === 'Pendiente')
        .reduce((acc, referral) => {
          acc[referral.patient_id] = referral;
          return acc;
        }, {});
      
      // Agregar información de referencia pendiente a cada paciente
      const patientsWithReferralInfo = patientsData.map(patient => ({
        ...patient,
        hasPendingReferral: !!patientsWithPendingReferrals[patient.id],
        pendingReferral: patientsWithPendingReferrals[patient.id] || null
      }));
      
      setPatients(patientsWithReferralInfo);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pacientes');
      toast.error(err.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ MODIFICAR ESTA FUNCIÓN - Recargar con estado de referencias
  const fetchPatients = async () => {
    await fetchPatientsWithReferralStatus();
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    
    try {
      await deletePatient(patientToDelete.id);
      toast.success(`Paciente ${patientToDelete.first_name} ${patientToDelete.last_name} eliminado correctamente`);
      fetchPatients(); // Recargar la lista
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al eliminar paciente');
    }
  };

  // Renderizado de tabla de pacientes
  const renderPatientsTable = () => {
    if (patients.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay pacientes registrados.</p>
          <Link to="/crear-paciente" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
            Registrar primer paciente
          </Link>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CI</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo TB</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
              {/* ⭐ AGREGAR NUEVA COLUMNA */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => {
              // Calcular edad basada en fecha de nacimiento
              const birthDate = new Date(patient.birthdate);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              
              return (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full">
                        {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.ci || <span className="text-gray-400 italic">No registrado</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.tb_type === 'Pulmonar' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {patient.tb_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {age} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.hospital_name}
                  </td>
                  {/* ⭐ NUEVA CELDA - Estado de referencia */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {patient.hasPendingReferral ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Ref. Pendiente
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Disponible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/ver-paciente/${patient.id}`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Ver detalle"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </Link>
                      <Link
                        to={`/editar-paciente/${patient.id}`}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Editar paciente"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </Link>
                      
                      {/* ⭐ MODIFICAR BOTÓN CREAR REFERENCIA - Condicional */}
                      {patient.hasPendingReferral ? (
                        <div className="relative">
                          <button
                            disabled
                            className="text-gray-400 bg-gray-100 p-1.5 rounded-full cursor-not-allowed opacity-50"
                            title={`Este paciente ya tiene una referencia pendiente hacia ${patient.pendingReferral?.destination_hospital_name || 'otro hospital'}`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </button>
                          {/* Badge de referencia pendiente */}
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">!</span>
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={`/crear-referencia?patient=${patient.id}`}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 p-1.5 rounded-full transition-colors duration-300"
                          title="Crear referencia"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                          </svg>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Eliminar paciente"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-teal-700 to-blue-700 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Pacientes con Tuberculosis</h1>
          <p className="mt-1 max-w-2xl text-sm text-teal-100">
            Registro y gestión de pacientes de TB en el sistema
          </p>
        </div>
        <Link
          to="/crear-paciente"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Registrar Paciente
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchPatients}
            className="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            Reintentar
          </button>
        </div>
      ) : (
        renderPatientsTable()
      )}
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName={patientToDelete ? `${patientToDelete.first_name} ${patientToDelete.last_name}` : ''}
        itemType="paciente"
      />
    </div>
  );
};

export default Patients;