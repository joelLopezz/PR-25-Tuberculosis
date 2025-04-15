// src/pages/EditStaff.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StaffForm from '../components/StaffForm';
import { getStaffById, updateStaff } from '../services/staffService';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await getStaffById(id);

        // Si el staff tiene un usuario, asegúrate de que role_id esté disponible
        if (data.has_user && !data.role_id) {
          // Si el backend no envía el role_id, podríamos necesitar una petición adicional
          // o asegurarnos de que el backend incluya este dato
          console.warn("El role_id no está disponible para este usuario");
        }

        setStaff(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del personal');
        toast.error(err.message || 'Error al cargar los datos del personal');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await updateStaff(id, values);
      toast.success('Personal actualizado correctamente');
      navigate('/personal');
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el personal');
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Editar Personal: {staff ? `${staff.first_name} ${staff.last_name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Actualice la información del miembro del personal.
        </p>
      </div>
      
      {staff && (
        <StaffForm
          initialValues={{
            ...staff,
            hospital_id: staff.hospital_id.toString(),
            role_id: staff.role_id?.toString() || '',
            create_user: !!staff.has_user
          }}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditStaff;