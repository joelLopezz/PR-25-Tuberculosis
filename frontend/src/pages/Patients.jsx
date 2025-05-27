/* eslint-disable no-unused-vars */
// src/pages/Patients.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPatients, deletePatient } from '../services/patientService';
import { getAllReferrals } from '../services/referralService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  // ⭐ NUEVO ESTADO para manejar errores específicos de eliminación
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientsWithReferralStatus();
  }, []);

  const fetchPatientsWithReferralStatus = async () => {
    try {
      setLoading(true);
      const [patientsData, referralsData] = await Promise.all([
        getAllPatients(),
        getAllReferrals()
      ]);
      
      const patientsWithPendingReferrals = referralsData
        .filter(referral => referral.status === 'Pendiente')
        .reduce((acc, referral) => {
          acc[referral.patient_id] = referral;
          return acc;
        }, {});
      
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

  const fetchPatients = async () => {
    await fetchPatientsWithReferralStatus();
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setDeleteError(null); // ⭐ Limpiar errores previos
    setShowDeleteModal(true);
  };

  // ⭐ MODIFICADA: Manejo mejorado de errores de eliminación
  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    
    try {
      await deletePatient(patientToDelete.id);
      toast.success(`Paciente ${patientToDelete.first_name} ${patientToDelete.last_name} eliminado correctamente`);
      fetchPatients();
      setShowDeleteModal(false);
      setDeleteError(null);
    } catch (err) {
      console.error('Error al eliminar paciente:', err);
      
      // ⭐ NUEVO: Manejo específico para errores 409 (Conflict) - paciente con referencias
      if (err.status === 409 || (err.response && err.response.status === 409)) {
        const errorData = err.response?.data || err;
        setDeleteError({
          type: 'references',
          message: errorData.message,
          details: errorData.referenceDetails || null,
          hasReferences: errorData.hasReferences || false,
          hasCounterReferences: errorData.hasCounterReferences || false,
          counterReferenceCount: errorData.counterReferenceCount || 0
        });
      } else {
        // Error genérico
        setDeleteError({
          type: 'generic',
          message: err.message || 'Error al eliminar paciente'
        });
        toast.error(err.message || 'Error al eliminar paciente');
      }
    }
  };

  // ⭐ NUEVA FUNCIÓN: Cerrar modal y limpiar errores
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
    setPatientToDelete(null);
  };

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => {
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
      
      {/* ⭐ MODAL MEJORADO: Ahora muestra información detallada sobre referencias */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
            {/* Overlay de fondo */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
              aria-hidden="true"
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg transform transition-all">
              {!deleteError ? (
                // Modal normal de confirmación
                <>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar eliminación</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            ¿Está seguro de que desea eliminar al paciente "{patientToDelete?.first_name} {patientToDelete?.last_name}"? Esta acción no se puede deshacer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
                      onClick={handleDeleteConfirm}
                    >
                      Eliminar
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                // Modal de error con información detallada
                <>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">No se puede eliminar el paciente</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700 mb-3">
                            {deleteError.message}
                          </p>
                          
                          {deleteError.type === 'references' && deleteError.details && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                              <h4 className="text-sm font-medium text-yellow-800 mb-2">Detalle de referencias:</h4>
                              <ul className="text-xs text-yellow-700 space-y-1">
                                {deleteError.details.pending > 0 && (
                                  <li>• {deleteError.details.pending} referencia(s) pendiente(s)</li>
                                )}
                                {deleteError.details.accepted > 0 && (
                                  <li>• {deleteError.details.accepted} referencia(s) aceptada(s)</li>
                                )}
                                {deleteError.details.completed > 0 && (
                                  <li>• {deleteError.details.completed} referencia(s) completada(s)</li>
                                )}
                                {deleteError.details.rejected > 0 && (
                                  <li>• {deleteError.details.rejected} referencia(s) rechazada(s)</li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                            <p><strong>Sugerencia:</strong> Para eliminar este paciente, primero gestione o elimine todas sus referencias a través del módulo de Referencias.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <Link
                      to="/referencias"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
                      onClick={handleCloseModal}
                    >
                      Ver Referencias
                    </Link>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-300"
                      onClick={handleCloseModal}
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;