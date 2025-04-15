/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
// src/pages/Staff.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllStaff, deleteStaff, resetPassword } from '../services/staffService';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Función para cargar datos del personal
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const data = await getAllStaff();
      setStaffList(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar el personal');
      toast.error(err.message || 'Error al cargar el personal');
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar eliminación
  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  // Función para ejecutar eliminación
  const handleDeleteConfirm = async () => {
    try {
      await deleteStaff(selectedStaff.id);
      toast.success('Personal eliminado correctamente');
      fetchStaffData(); // Recargar lista
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el personal');
    }
  };

  // Función para confirmar reset de contraseña
  const handleResetPasswordClick = (staff) => {
    if (!staff.has_user) {
      toast.warning('Este miembro del personal no tiene usuario asociado');
      return;
    }
    setSelectedStaff(staff);
    setShowResetModal(true);
  };

  // Función para ejecutar reset de contraseña
  const handleResetPasswordConfirm = async () => {
    try {
      const result = await resetPassword(selectedStaff.id);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Personal Médico
          </span>
        </h2>
        {isAdmin && (
          <Link 
            to="/crear-personal"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Personal
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
      ) : staffList.length === 0 ? (
        <div className="p-8 text-center text-gray-600">
          <p className="text-lg">No hay personal registrado</p>
          {isAdmin && (
            <button
              onClick={() => navigate('/crear-personal')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Registrar primer personal
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre completo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {staff.first_name} {staff.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staff.ci}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {staff.specialty || <span className="text-gray-400 italic">No especificada</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staff.hospital_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staff.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.has_user ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No tiene
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                        <button
                        onClick={() => navigate(`/ver-personal/${staff.id}`)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Ver detalles"
                        >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        </button>
                        
                        {isAdmin && (
                        <>
                            <button
                            onClick={() => navigate(`/editar-personal/${staff.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-1.5 rounded-full transition-colors duration-300"
                            title="Editar"
                            >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            </button>
                            
                            {Boolean(staff.has_user) ? (
                            <button
                                onClick={() => handleResetPasswordClick(staff)}
                                className="text-amber-600 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 p-1.5 rounded-full transition-colors duration-300"
                                title="Resetear contraseña"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                </svg>
                            </button>
                            ) : null}
                            
                            <button
                            onClick={() => handleDeleteClick(staff)}
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
        itemName={selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''}
        itemType="miembro del personal"
      />
      
      {/* Modal de confirmación de reset de contraseña */}
      <DeleteConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetPasswordConfirm}
        itemName={selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''}
        itemType="usuario"
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

export default Staff;