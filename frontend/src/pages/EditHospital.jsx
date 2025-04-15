// pages/EditHospital.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHospitalById, updateHospital } from '../services/hospitalService';
import HospitalForm from '../components/HospitalForm';

const EditHospital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        const hospitalData = await getHospitalById(id);
        setHospital(hospitalData);
        setError(null);
      } catch (error) {
        console.error('Error al obtener hospital:', error);
        setError('Error al cargar los datos del hospital');
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await updateHospital(id, formData);
      // Redirigir a la página principal con parámetro de éxito de actualización
      navigate('/?success=updated');
    } catch (error) {
      console.error('Error al actualizar hospital:', error);
      alert('Error al actualizar hospital. Por favor intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Hospital</h1>
      
      <HospitalForm 
        initialData={hospital}
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        loading={submitting}
        buttonText="Actualizar Hospital"
      />
    </div>
  );
};

export default EditHospital;