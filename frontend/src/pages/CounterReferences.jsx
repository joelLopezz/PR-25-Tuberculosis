/* eslint-disable no-unused-vars */
// src/pages/CounterReferences.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCounterReferences, deleteCounterReference } from '../services/counterReferenceService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const CounterReferences = () => {
  const [counterReferences, setCounterReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [counterRefToDelete, setCounterRefToDelete] = useState(null);
  const navigate = useNavigate();

  // Cargar contrareferencias al montar el componente
  useEffect(() => {
    fetchCounterReferences();
  }, []);

  // Función para cargar la lista de contrareferencias
  const fetchCounterReferences = async () => {
    try {
      setLoading(true);
      const data = await getAllCounterReferences();
      setCounterReferences(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar contrareferencias');
      toast.error(err.message || 'Error al cargar contrareferencias');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (counterRef) => {
    setCounterRefToDelete(counterRef);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleDeleteConfirm = async () => {
    if (!counterRefToDelete) return;
    
    try {
      await deleteCounterReference(counterRefToDelete.id);
      toast.success('Contrareferencia eliminada correctamente');
      fetchCounterReferences(); // Recargar la lista
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al eliminar contrareferencia');
    }
  };

  // Renderizado de tabla de contrareferencias
  const renderCounterReferencesTable = () => {
    if (counterReferences.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay contrareferencias registradas.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospitales</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {counterReferences.map((counterRef) => (
              <tr key={counterRef.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full">
                      {counterRef.patient_first_name.charAt(0)}{counterRef.patient_last_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {counterRef.patient_first_name} {counterRef.patient_last_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <span>{counterRef.source_hospital_name}</span>
                    <svg className="h-4 w-4 mx-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                    <span>{counterRef.destination_hospital_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(counterRef.counter_reference_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {counterRef.staff_first_name} {counterRef.staff_last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/ver-contrareferencia/${counterRef.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors duration-300"
                      title="Ver detalle"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteClick(counterRef)}
                      className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-300"
                      title="Eliminar contrareferencia"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-700 to-blue-700 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Contrareferencias</h1>
          <p className="mt-1 max-w-2xl text-sm text-purple-100">
            Listado de contrareferencias de pacientes
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchCounterReferences}
            className="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            Reintentar
          </button>
        </div>
      ) : (
        renderCounterReferencesTable()
      )}
      
      {/* Modal para eliminar contrareferencia */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName="esta contrareferencia"
        itemType="contrareferencia"
      />
    </div>
  );
};

export default CounterReferences;