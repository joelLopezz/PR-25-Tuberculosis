// src/pages/CreatePatient.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PatientForm from '../components/PatientForm';
import { createPatient } from '../services/patientService';

const CreatePatient = () => {
  const navigate = useNavigate();

  const handleSubmit = async (patientData) => {
    try {
      await createPatient(patientData);
      toast.success('Paciente registrado exitosamente');
      navigate('/pacientes');
    } catch (error) {
      toast.error(error.message || 'Error al registrar paciente');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Paciente</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete la información para registrar un nuevo paciente con tuberculosis
        </p>
      </div>
      
      <PatientForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePatient;