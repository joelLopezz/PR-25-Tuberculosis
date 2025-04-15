// pages/Networks.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNetworks, createNetwork, updateNetwork, deleteNetwork } from '../services/networkService';
import NetworkTable from '../components/NetworkTable';
import NetworkForm from '../components/NetworkForm';
import SuccessModal from '../components/SuccessModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Networks = () => {
  const navigate = useNavigate();
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    setLoading(true);
    try {
      const data = await getAllNetworks();
      setNetworks(data);
    } catch (error) {
      console.error('Error al obtener redes de salud:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setCurrentNetwork(null);
    setShowForm(true);
  };

  const handleEdit = (network) => {
    setCurrentNetwork(network);
    setShowForm(true);
  };

  const handleDelete = (network) => {
    setNetworkToDelete(network);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);
    try {
      if (currentNetwork) {
        // Actualizar
        await updateNetwork(currentNetwork.id, formData);
        setSuccessMessage('Red de salud actualizada exitosamente');
      } else {
        // Crear
        await createNetwork(formData);
        setSuccessMessage('Red de salud creada exitosamente');
      }
      setShowSuccessModal(true);
      setShowForm(false);
      fetchNetworks();
    } catch (error) {
      console.error('Error al guardar red de salud:', error);
      alert('Error al guardar. Por favor intente nuevamente.');
    } finally {
      setFormSubmitting(false);
    }
  };

// pages/Networks.jsx (fragmento de la función confirmDelete)

const confirmDelete = async () => {
    if (!networkToDelete) return;
    
    try {
      const response = await deleteNetwork(networkToDelete.id);
      fetchNetworks();
      
      // Verificar si hay una advertencia en la respuesta
      if (response.warning) {
        setSuccessMessage(`${response.message} ${response.warning}`);
      } else {
        setSuccessMessage(response.message || 'Red de salud eliminada exitosamente');
      }
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al eliminar red de salud:', error);
      
      // Si la API devuelve un error de hospitales asociados
      if (error.response && error.response.data && error.response.data.hasAssociatedHospitals) {
        alert('No se puede eliminar esta red porque tiene hospitales asociados. Debe reasignar los hospitales primero.');
      } else {
        alert('Error al eliminar. Por favor intente nuevamente.');
      }
    } finally {
      setShowDeleteModal(false);
      setNetworkToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Redes de Salud</h1>
          <button
            onClick={() => navigate('/')}
            className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm flex items-center"
            title="Volver a hospitales"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver al Inicio
          </button>
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-md transition-colors duration-300"
          onClick={handleCreateClick}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Crear nueva Red de Salud
        </button>
      </div>
      
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {currentNetwork ? 'Editar Red de Salud' : 'Crear Nueva Red de Salud'}
          </h2>
          <NetworkForm 
            network={currentNetwork}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            loading={formSubmitting}
          />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <NetworkTable 
          networks={networks} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
      
      {/* Modal de éxito */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal} 
        message={successMessage}
      />
      
      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
        itemName={networkToDelete?.name || ''}
        itemType="red de salud"
      />
    </div>
  );
};

export default Networks;