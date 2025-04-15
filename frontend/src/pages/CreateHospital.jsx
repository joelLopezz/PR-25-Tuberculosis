// pages/CreateHospital.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHospital } from '../services/hospitalService';
import HospitalForm from '../components/HospitalForm';

const CreateHospital = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await createHospital(formData);
      // Redirigir a la página principal con parámetro de éxito
      navigate('/?success=created');
    } catch (error) {
      console.error('Error al crear hospital:', error);
      alert('Error al crear hospital. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Hospital</h1>
      
      <HospitalForm 
        initialData={{}} // Asegurarse de pasar un objeto vacío explícito
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        loading={loading}
        buttonText="Crear Hospital"
      />
    </div>
  );
};

export default CreateHospital;