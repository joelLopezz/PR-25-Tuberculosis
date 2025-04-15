// src/pages/HospitalAdmins.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllHospitalAdmins, deleteHospitalAdmin, resetPassword } from '../services/hospitalAdminService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';

const HospitalAdmins = () => {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isSedesAdmin } = useAuth();
  const navigate = useNavigate();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Función para cargar datos de admins
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await getAllHospitalAdmins();
      setAdminList(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar administradores de hospital');
      toast.error(err.message || 'Error al cargar administradores de hospital');
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar eliminación
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  // Función para ejecutar eliminación
  const handleDeleteConfirm = async () => {
    try {
      await deleteHospitalAdmin(selectedAdmin.id);
      toast.success('Administrador eliminado correctamente');
      fetchAdminData(); // Recargar lista
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al eliminar administrador');
    }
  };

  // Función para confirmar reset de contraseña
  const handleResetPasswordClick = (admin) => {
    setSelectedAdmin(admin);
    setShowResetModal(true);
  };

  // Función para ejecutar reset de contraseña
  const handleResetPasswordConfirm = async () => {
    try {
      await resetPassword(selectedAdmin.id);
      setSuccessMessage('Contraseña restablecida. Se han enviado nuevas credenciales por correo electrónico.');
      setShowSuccessModal(true);
      setShowResetModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al restablecer la contraseña');
      setShowResetModal(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-200 bg-gradient-to-r from-teal-700 to-blue-700 px-5 py-4">
        <h2 className="text-2xl font-bold text-white">
          <span className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Administradores de Hospital
          </span>
        </h2>
        {isSedesAdmin && (
          <Link 
            to="/crear-admin-hospital"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Administrador
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : adminList.length === 0 ? (
        <div className="p-8 text-center text-gray-600">
          <p className="text-lg">No hay administradores de hospital registrados</p>
          {isSedesAdmin && (
            <button
              onClick={() => navigate('/crear-admin-hospital')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Registrar primer administrador
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo electrónico
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital asignado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminList.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {admin.hospital_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {admin.last_login 
                        ? new Date(admin.last_login).toLocaleString() 
                        : <span className="text-gray-400 italic">Nunca</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      {isSedesAdmin && (
                        <>
                          <button
                            onClick={() => navigate(`/editar-admin-hospital/${admin.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-1.5 rounded-full transition-colors duration-300"
                            title="Editar"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleResetPasswordClick(admin)}
                            className="text-amber-600 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 p-1.5 rounded-full transition-colors duration-300"
                            title="Resetear contraseña"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(admin)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-300"
                            title="Eliminar"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedAdmin ? selectedAdmin.username : ''}
        itemType="administrador de hospital"
      />
      
      {/* Modal de confirmación de reset de contraseña */}
      <DeleteConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetPasswordConfirm}
        itemName={selectedAdmin ? selectedAdmin.username : ''}
        itemType="administrador"
        title="Confirmar restablecimiento de contraseña"
        message="¿Está seguro de que desea restablecer la contraseña? Se generará una nueva contraseña aleatoria y se enviará por correo electrónico."
      />
      
      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default HospitalAdmins;