/* eslint-disable no-unused-vars */
// src/pages/StaffDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getStaffById, resetPassword } from '../services/staffService';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuccessModal from '../components/SuccessModal';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true);
        const data = await getStaffById(id);
        setStaff(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del personal');
        toast.error(err.message || 'Error al cargar los datos del personal');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [id]);

  // Función para ejecutar reset de contraseña
  const handleResetPasswordConfirm = async () => {
    try {
      const result = await resetPassword(id);
      setSuccessMessage('Contraseña restablecida. Se han enviado nuevas credenciales por correo electrónico.');
      setShowSuccessModal(true);
      setShowResetModal(false);
    } catch (err) {
      toast.error(err.message || 'Error al restablecer la contraseña');
      setShowResetModal(false);
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
          onClick={() => navigate('/personal')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver a la lista de personal
        </button>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Personal no encontrado</p>
        <button
          onClick={() => navigate('/personal')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver a la lista de personal
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detalle del Personal
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Información completa del miembro del personal médico.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/personal')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/editar-personal/${staff.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar
              </button>
              
              {staff.has_user && (
                <button
                  onClick={() => setShowResetModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  Resetear contraseña
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-teal-700 to-blue-700">
          <h3 className="text-lg leading-6 font-medium text-white">
            {staff.first_name} {staff.last_name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-teal-100">
            {staff.specialty || 'Sin especialidad específica'}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.first_name} {staff.last_name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Cédula de Identidad
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.ci}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Especialidad
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.specialty || <span className="text-gray-400 italic">No especificada</span>}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Hospital
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.hospital_name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.phone || <span className="text-gray-400 italic">No registrado</span>}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Dirección
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.address || <span className="text-gray-400 italic">No registrada</span>}
              </dd>
            </div>
            
            {/* Información del usuario si existe */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Cuenta de usuario
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {staff.has_user ? (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Activa
                  </span>
                ) : (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    No tiene cuenta de usuario
                  </span>
                )}
              </dd>
            </div>
            
            {staff.has_user && (
              <>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Nombre de usuario
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {staff.username}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Correo electrónico
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {staff.email}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
      
      {/* Modal de confirmación de reset de contraseña */}
      <DeleteConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetPasswordConfirm}
        itemName={staff ? `${staff.first_name} ${staff.last_name}` : ''}
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

export default StaffDetail;