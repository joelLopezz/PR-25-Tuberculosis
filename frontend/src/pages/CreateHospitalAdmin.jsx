// src/pages/CreateHospitalAdmin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HospitalAdminForm from '../components/HospitalAdminForm';
import { createHospitalAdmin } from '../services/hospitalAdminService';

const CreateHospitalAdmin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await createHospitalAdmin(values);
      toast.success('Administrador de hospital creado correctamente');
      navigate('/admins-hospital');
    } catch (error) {
      toast.error(error.message || 'Error al crear el administrador de hospital');
      throw error; // Propagamos el error para que el formulario lo maneje
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Administrador de Hospital</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete el formulario para registrar un nuevo administrador de hospital.
        </p>
      </div>
      
      <HospitalAdminForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateHospitalAdmin;