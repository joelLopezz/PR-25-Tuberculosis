// src/pages/CreateStaff.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StaffForm from '../components/StaffForm';
import { createStaff } from '../services/staffService';

const CreateStaff = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await createStaff(values);
      toast.success('Personal creado correctamente');
      navigate('/personal');
    } catch (error) {
      toast.error(error.message || 'Error al crear el personal');
      throw error; // Propagamos el error para que el formulario lo maneje
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Personal</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete el formulario para registrar un nuevo miembro del personal médico.
        </p>
      </div>
      
      <StaffForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateStaff;