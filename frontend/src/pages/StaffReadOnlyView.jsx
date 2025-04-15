// src/pages/StaffReadOnlyView.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllStaff } from '../services/staffService';

const StaffReadOnlyView = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Función para cargar datos del personal
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const data = await getAllStaff();
      
      console.log("Usuario actual:", user);
      console.log("Lista completa de personal:", data);
      
      // Filtrar personal para mostrar solo los del mismo hospital que el usuario actual
      if (user && ['doctor', 'nurse'].includes(user.role) && user.hospital_id) {
        // Convertir hospital_id a número para asegurar comparación correcta
        const userHospitalId = parseInt(user.hospital_id, 10);
        console.log("Hospital ID del usuario:", userHospitalId);
        
        const filteredData = data.filter(staff => {
          // Convertir también el hospital_id del staff a número
          const staffHospitalId = parseInt(staff.hospital_id, 10);
          console.log(`Comparando: Staff ${staff.first_name} ${staff.last_name} - Hospital ID: ${staffHospitalId}`);
          return staffHospitalId === userHospitalId;
        });
        
        console.log("Personal filtrado:", filteredData);
        setStaffList(filteredData);
      } else {
        setStaffList(data);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar el personal');
      toast.error(err.message || 'Error al cargar el personal');
    } finally {
      setLoading(false);
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
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

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
        <div className="text-sm text-white">
          <span className="bg-blue-800 px-3 py-1 rounded-full">Vista de solo lectura</span>
          {user && user.hospital && (
            <span className="ml-2 bg-teal-800 px-3 py-1 rounded-full">
              {user.hospital}
            </span>
          )}
        </div>
      </div>
      
      {staffList.length === 0 ? (
        <div className="p-8 text-center text-gray-600">
          <p className="text-lg">No hay personal registrado para mostrar en tu hospital</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center">
                      <Link
                        to={`/ver-personal/${staff.id}`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors duration-300"
                        title="Ver detalles"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffReadOnlyView;