// src/pages/CounterReferenceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCounterReferenceById } from '../services/counterReferenceService';

const CounterReferenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counterRef, setCounterRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounterRef = async () => {
      try {
        setLoading(true);
        const data = await getCounterReferenceById(id);
        setCounterRef(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar la contrareferencia');
        toast.error(err.message || 'Error al cargar la contrareferencia');
      } finally {
        setLoading(false);
      }
    };

    fetchCounterRef();
  }, [id]);

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
          onClick={() => navigate('/contrareferencias')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  if (!counterRef) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Contrareferencia no encontrada</p>
        <button
          onClick={() => navigate('/contrareferencias')}
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
            Detalle de Contrareferencia
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Información completa de la contrareferencia del paciente
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate('/contrareferencias')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Cabecera */}
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-700 to-blue-700">
          <h3 className="text-lg leading-6 font-medium text-white">
            Contrareferencia del paciente {counterRef.patient_first_name} {counterRef.patient_last_name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-purple-100">
            Fecha: {new Date(counterRef.counter_reference_date).toLocaleDateString()}
          </p>
        </div>
        
        {/* Información de los hospitales */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Hospitales</h4>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Hospital de origen:</p>
              <p className="font-medium">{counterRef.source_hospital_name}</p>
            </div>
            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <div className="flex-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Hospital de destino:</p>
              <p className="font-medium">{counterRef.destination_hospital_name}</p>
            </div>
          </div>
        </div>
        
        {/* Detalles clínicos */}
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Tratamiento proporcionado
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {counterRef.treatment_provided}
              </dd>
            </div>
            
            {counterRef.diagnosis_update && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Actualización de diagnóstico
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {counterRef.diagnosis_update}
                </dd>
              </div>
            )}
            
            {counterRef.recommendations && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Recomendaciones
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {counterRef.recommendations}
                </dd>
              </div>
            )}
            
            {counterRef.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Notas
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {counterRef.notes}
                </dd>
              </div>
            )}
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Médico responsable
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {counterRef.staff_first_name} {counterRef.staff_last_name}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Fecha de contrareferencia
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(counterRef.counter_reference_date).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CounterReferenceDetail;