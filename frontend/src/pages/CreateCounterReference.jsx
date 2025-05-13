// src/pages/CreateCounterReference.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CounterReferenceForm from '../components/CounterReferenceForm';
import { createCounterReference } from '../services/counterReferenceService';

const CreateCounterReference = () => {
  const { referralId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createCounterReference(data);
      toast.success('Contrareferencia creada exitosamente');
      navigate('/contrareferencias');
    } catch (error) {
      toast.error(error.message || 'Error al crear contrareferencia');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Contrareferencia</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete la información para hacer la contrareferencia del paciente
        </p>
      </div>
      
      <CounterReferenceForm 
        onSubmit={handleSubmit} 
        referralId={referralId}
        initialValues={{ referral_id: referralId }}
      />
    </div>
  );
};

export default CreateCounterReference;