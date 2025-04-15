import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHospitals, deleteHospital } from '../services/hospitalService';
import HospitalTable from '../components/HospitalTable';
import SuccessModal from '../components/SuccessModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchHospitals();
    
    // Verificar si hay un parámetro de éxito
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    
    if (success === 'created') {
      setSuccessMessage('Hospital creado exitosamente');
      setShowSuccessModal(true);
      navigate('/', { replace: true });
    } else if (success === 'updated') {
      setSuccessMessage('Hospital actualizado exitosamente');
      setShowSuccessModal(true);
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  const fetchHospitals = () => {
    setLoading(true);
    getHospitals()
      .then(data => setHospitals(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreateClick = () => {
    navigate('/crear-hospital');
  };

  const handleEdit = (id) => {
    navigate(`/editar-hospital/${id}`);
  };

  const handleDelete = (id, name) => {
    setHospitalToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!hospitalToDelete) return;
    
    try {
      await deleteHospital(hospitalToDelete.id);
      // Actualizar la lista de hospitales después de eliminar
      fetchHospitals();
      setSuccessMessage('Hospital eliminado exitosamente');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al eliminar hospital:', error);
      alert('Error al eliminar hospital. Por favor intente nuevamente.');
    } finally {
      setShowDeleteModal(false);
      setHospitalToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospitales Registrados</h1>
        <div className="flex space-x-4">
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
            Crear nuevo Hospital
          </button>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-md transition-colors duration-300"
            onClick={() => navigate('/redes')}
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            Gestionar Redes de Salud
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <HospitalTable 
          hospitals={hospitals} 
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
        itemName={hospitalToDelete?.name || ''}
        itemType="hospital"
      />
    </div>
  );
};

export default Hospitals;