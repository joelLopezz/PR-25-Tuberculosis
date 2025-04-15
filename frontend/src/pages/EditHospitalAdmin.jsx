// src/pages/EditHospitalAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HospitalAdminForm from '../components/HospitalAdminForm';
import { getHospitalAdminById, updateHospitalAdmin } from '../services/hospitalAdminService';

const EditHospitalAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const data = await getHospitalAdminById(id);
        setAdmin(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del administrador');
        toast.error(err.message || 'Error al cargar los datos del administrador');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await updateHospitalAdmin(id, values);
      toast.success('Administrador actualizado correctamente');
      navigate('/admins-hospital');
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el administrador');
      throw error; // Propagamos el error para que el formulario lo maneje
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
          onClick={() => navigate('/admins-hospital')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver a la lista de administradores
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Editar Administrador: {admin ? admin.username : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Actualice la información del administrador de hospital.
        </p>
      </div>
      
      {admin && (
        <HospitalAdminForm
          initialValues={{
            ...admin,
            hospital_id: admin.hospital_id.toString()
          }}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditHospitalAdmin;