// src/pages/EditPatient.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PatientForm from '../components/PatientForm';
import { getPatientById, updatePatient } from '../services/patientService';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await getPatientById(id);
        setPatient(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar el paciente');
        toast.error(err.message || 'Error al cargar el paciente');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (patientData) => {
    try {
      await updatePatient(id, patientData);
      toast.success('Paciente actualizado exitosamente');
      navigate('/pacientes');
    } catch (error) {
      toast.error(error.message || 'Error al actualizar paciente');
      throw error;
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
          onClick={() => navigate('/pacientes')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Editar Paciente: {patient ? `${patient.first_name} ${patient.last_name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Actualice la información del paciente con tuberculosis
        </p>
      </div>
      
      {patient && (
        <PatientForm
          initialValues={patient}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditPatient;