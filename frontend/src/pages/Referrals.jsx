/* eslint-disable no-unused-vars */
// src/pages/Referrals.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllReferrals,
  deleteReferral,
  updateReferralStatus,
} from "../services/referralService";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Notification from "../components/Notification";
import { useAuth } from "../context/AuthContext";

const ReferralStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Pendiente":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: (
            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      case "Aceptada":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: (
            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )
        };
      case "Rechazada":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: (
            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )
        };
      case "Completada":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: (
            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: null
        };
    }
  };

  const { bg, text, icon } = getStatusConfig();

  return (
    <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-medium rounded-full ${bg} ${text}`}>
      {icon}
      {status}
    </span>
  );
};

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [referralToUpdate, setReferralToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const { user, isHospitalAdmin } = useAuth();
  const navigate = useNavigate();

  // Cargar referencias al montar el componente y actualizar periódicamente
  useEffect(() => {
    fetchReferrals();
    
    // Configurar un intervalo para actualizar la lista cada 30 segundos
    const interval = setInterval(() => {
      fetchReferrals(false); // false indica que no debe mostrar el estado de carga
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para cargar la lista de referencias
  const fetchReferrals = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await getAllReferrals();
      setReferrals(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar referencias");
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar referencias'
      });
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (referral) => {
    setReferralToDelete(referral);
    setShowDeleteModal(true);
  };

  // Confirmar y ejecutar eliminación
  const handleDeleteConfirm = async () => {
    if (!referralToDelete) return;

    try {
      await deleteReferral(referralToDelete.id);
      setNotification({
        type: 'success',
        message: 'Referencia eliminada correctamente'
      });
      fetchReferrals(); // Recargar la lista
      setShowDeleteModal(false);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Error al eliminar referencia'
      });
    }
  };

  // Abrir modal para cambiar estado
  const handleStatusClick = (referral, status) => {
    setReferralToUpdate(referral);
    setNewStatus(status);
    setStatusNote("");
    setShowStatusModal(true);
  };

  // Función para confirmar cambio de estado con manejo de errores mejorado
  const handleStatusConfirm = async () => {
    try {
      setLoading(true);
      await updateReferralStatus(referralToUpdate.id, {
        status: newStatus,
        notes: statusNote
      });
      
      setNotification({
        type: 'success',
        message: `Estado de referencia actualizado a "${newStatus}"`
      });
      
      fetchReferrals(); // Recargar la lista
      setShowStatusModal(false);
    } catch (err) {
      // Mostrar error con mensaje más claro y descriptivo
      const errorMsg = err.response?.data?.message || 'Error al actualizar estado';
      
      setNotification({
        type: 'error',
        message: errorMsg
      });
      
      // Cerrar el modal después del error
      setShowStatusModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el color de badge según estado
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Aceptada":
        return "bg-green-100 text-green-800";
      case "Rechazada":
        return "bg-red-100 text-red-800";
      case "Completada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Renderizado de tabla de referencias
  const renderReferralsTable = () => {
    if (referrals.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay referencias registradas.</p>
          <Link
            to="/crear-referencia"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            Crear primera referencia
          </Link>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Paciente
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Origen → Destino
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Urgencia
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrals.map((referral) => (
              <tr key={referral.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full">
                      {referral.patient_first_name.charAt(0)}
                      {referral.patient_last_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {referral.patient_first_name}{" "}
                        {referral.patient_last_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <span>{referral.source_hospital_name}</span>
                    <svg
                      className="h-4 w-4 mx-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                    <span>{referral.destination_hospital_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(referral.reference_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      referral.urgency_level === "Alta"
                        ? "bg-red-100 text-red-800"
                        : referral.urgency_level === "Media"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {referral.urgency_level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ReferralStatusBadge status={referral.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/ver-referencia/${referral.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors duration-300"
                      title="Ver detalle"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    </Link>

                    {/* Botones de aceptar/rechazar SOLO para referencias PENDIENTES */}
                    {referral.status === 'Pendiente' && referral.destination_hospital_id === user.hospital_id && (
                      <>
                        <button
                          onClick={() => handleStatusClick(referral, 'Aceptada')}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 p-1.5 rounded-full transition-colors duration-300"
                          title="Aceptar referencia"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleStatusClick(referral, 'Rechazada')}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-300"
                          title="Rechazar referencia"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Hospital origen puede eliminar si está pendiente */}
                    {referral.status === "Pendiente" &&
                      referral.source_hospital_id === user.hospital_id && (
                        <button
                          onClick={() => handleDeleteClick(referral)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-300"
                          title="Eliminar referencia"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      )}

                    {/* Cualquier hospital puede crear contrareferencia cuando está aceptada */}
                    {referral.status === "Aceptada" && (
                      <Link
                        to={`/crear-contrareferencia/${referral.id}`}
                        className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Crear contrareferencia"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          ></path>
                        </svg>
                      </Link>
                    )}
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
      {/* Mostrar la notificación si existe */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-teal-700 to-blue-700 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Referencias de Pacientes
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-teal-100">
            Gestión de transferencias de pacientes entre hospitales
          </p>
        </div>
        <Link
          to="/crear-referencia"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
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
          Nueva Referencia
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
            onClick={fetchReferrals}
            className="mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            Reintentar
          </button>
        </div>
      ) : (
        renderReferralsTable()
      )}

      {/* Modal para eliminar referencia */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName="esta referencia"
        itemType="referencia"
      />

      {/* Modal para cambiar estado de referencia - VERSIÓN CORREGIDA */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setShowStatusModal(false)}
          ></div>

          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-50">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    newStatus === "Aceptada" ? "bg-green-100" : "bg-red-100"
                  } sm:mx-0 sm:h-10 sm:w-10`}
                >
                  {newStatus === "Aceptada" ? (
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {newStatus === "Aceptada" ? "Aceptar" : "Rechazar"}{" "}
                    Referencia
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Está seguro de que desea{" "}
                      {newStatus === "Aceptada" ? "aceptar" : "rechazar"} esta
                      referencia?
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="statusNote"
                        className="block text-sm font-medium text-gray-700"
                      >
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
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                  newStatus === "Aceptada"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
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
      )}
    </div>
  );
};

export default Referrals;