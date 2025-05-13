// src/pages/CreateReferral.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReferralForm from '../components/ReferralForm';
import { createReferral } from '../services/referralService';

const CreateReferral = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patientId, setPatientId] = useState(null);

  // Extraer patientId de query params si existe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patient = params.get('patient');
    if (patient) {
      setPatientId(patient);
    }
  }, [location]);

  const handleSubmit = async (referralData) => {
    try {
      await createReferral(referralData);
      toast.success('Referencia creada exitosamente');
      navigate('/referencias');
    } catch (error) {
      toast.error(error.message || 'Error al crear referencia');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Referencia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete la información para referir un paciente a otro hospital
        </p>
      </div>
      
      <ReferralForm 
        onSubmit={handleSubmit} 
        patientId={patientId}
      />
    </div>
  );
};

export default CreateReferral;