// src/pages/ReferralDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getReferralById, updateReferralStatus } from '../services/referralService';
import { useAuth } from '../context/AuthContext';

const ReferralDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const { isMedicalStaff } = useAuth();

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        setLoading(true);
        const data = await getReferralById(id);
        setReferral(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar la referencia');
        toast.error(err.message || 'Error al cargar la referencia');
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, [id]);

  // Manejar cambio de estado
  const handleStatusClick = (status) => {
    setNewStatus(status);
    setStatusNote('');
    setShowStatusModal(true);
  };

  // Confirmar cambio de estado
  const handleStatusConfirm = async () => {
    try {
      await updateReferralStatus(id, {
        status: newStatus,
        notes: statusNote
      });
      toast.success(`Estado de referencia actualizado a "${newStatus}"`);
      
      // Recargar los datos de la referencia
      const updatedData = await getReferralById(id);
      setReferral(updatedData);
      
      setShowStatusModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al actualizar estado');
    }
  };

  // Obtener color para el badge de estado
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aceptada':
        return 'bg-green-100 text-green-800';
      case 'Rechazada':
        return 'bg-red-100 text-red-800';
      case 'Completada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/referencias')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Referencia no encontrada</p>
        <button
          onClick={() => navigate('/referencias')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detalle de Referencia
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Información completa de la referencia del paciente
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/referencias')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
          
          {isMedicalStaff && referral.status === 'Pendiente' && (
            <>
              <button
                onClick={() => handleStatusClick('Aceptada')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Aceptar
              </button>
              
              <button
                onClick={() => handleStatusClick('Rechazada')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Rechazar
              </button>
            </>
          )}
          
          {isMedicalStaff && referral.status === 'Aceptada' && (
            <Link
              to={`/crear-contrareferencia/${referral.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              Crear Contrareferencia
            </Link>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Cabecera con estado y datos principales */}
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-teal-700 to-blue-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-white">
              Referencia #{referral.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-teal-100">
              Fecha: {new Date(referral.reference_date).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            getStatusBadgeColor(referral.status)
          }`}>
            {referral.status}
          </span>
        </div>
        
        {/* Información del paciente */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-blue-50">
          <h4 className="text-md font-semibold text-blue-800 mb-3">Información del Paciente</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre:</p>
              <p className="font-medium">{referral.patient_first_name} {referral.patient_last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgencia:</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                referral.urgency_level === 'Alta' 
                  ? 'bg-red-100 text-red-800' 
                  : referral.urgency_level === 'Media'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {referral.urgency_level}
              </span>
            </div>
          </div>
        </div>
        
        {/* Información de los hospitales */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Hospitales</h4>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Hospital de origen:</p>
              <p className="font-medium">{referral.source_hospital_name}</p>
            </div>
            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <div className="flex-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Hospital de destino:</p>
              <p className="font-medium">{referral.destination_hospital_name}</p>
            </div>
          </div>
        </div>
        
        {/* Detalles clínicos */}
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Motivo de referencia
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {referral.reason}
              </dd>
            </div>
            {referral.diagnosis && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Diagnóstico
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {referral.diagnosis}
                </dd>
              </div>
            )}
            {referral.clinical_summary && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Resumen clínico
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {referral.clinical_summary}
                </dd>
              </div>
            )}
            
            {referral.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Notas
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {referral.notes}
                </dd>
              </div>
            )}
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Médico referente
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {referral.staff_first_name} {referral.staff_last_name}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Modal para cambiar estado */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowStatusModal(false)}
              aria-hidden="true"
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    newStatus === 'Aceptada' ? 'bg-green-100' : 'bg-red-100'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    {newStatus === 'Aceptada' ? (
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {newStatus === 'Aceptada' ? 'Aceptar' : 'Rechazar'} Referencia
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Está seguro de que desea {newStatus === 'Aceptada' ? 'aceptar' : 'rechazar'} esta referencia?
                      </p>
                      
                      <div className="mt-4">
                        <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700">
                          Observaciones (opcional)
                        </label>
                        <textarea
                          id="statusNote"
                          name="statusNote"
                          rows="3"
                          className="shadow-sm focus:ring-teal-500 focus:border-teal-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Ingrese observaciones sobre esta decisión..."
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    newStatus === 'Aceptada' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleStatusConfirm}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralDetail;