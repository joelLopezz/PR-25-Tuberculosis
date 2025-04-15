/* eslint-disable react-hooks/exhaustive-deps */
// components/HospitalForm.jsx
import React, { useState, useEffect } from 'react';
import { getAllNetworks } from '../services/networkService';
import { getAllMunicipalities } from '../services/municipalityService';

const HospitalForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  buttonText = 'Guardar'
}) => {
  // Inicializar formData con initialData directamente aquí
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    network_id: initialData.network_id || '',
    municipality_id: initialData.municipality_id || ''
  });

  const [errors, setErrors] = useState({});
  const [networks, setNetworks] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Cargar redes y municipios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [networksData, municipalitiesData] = await Promise.all([
          getAllNetworks(),
          getAllMunicipalities()
        ]);
        setNetworks(networksData);
        setMunicipalities(municipalitiesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Actualizar el formulario si cambian los datos iniciales - SOLO UNA VEZ
  // y solo si el ID cambió (indicando que es un hospital diferente)
  useEffect(() => {
    // Solo actualizamos si initialData.id es diferente que antes
    // o si initialData tiene propiedades que no están en formData
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        network_id: initialData.network_id || '',
        municipality_id: initialData.municipality_id || ''
      });
    }
  }, [initialData.id]); // Solo dependemos del ID, no del objeto completo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al editar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato de email es inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(formData);
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Nombre del Hospital
        </label>
        <input
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingrese el nombre del hospital"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      {/* Nuevos campos para Red de Salud y Municipio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="network_id">
            Red de Salud
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${errors.network_id ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            id="network_id"
            name="network_id"
            value={formData.network_id || ''}
            onChange={handleChange}
          >
            <option value="">Seleccione una Red de Salud</option>
            {networks.map(network => (
              <option key={network.id} value={network.id}>{network.name}</option>
            ))}
          </select>
          {errors.network_id && <p className="text-red-500 text-xs mt-1">{errors.network_id}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="municipality_id">
            Municipio
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${errors.municipality_id ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
            id="municipality_id"
            name="municipality_id"
            value={formData.municipality_id || ''}
            onChange={handleChange}
          >
            <option value="">Seleccione un Municipio</option>
            {municipalities.map(municipality => (
              <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
            ))}
          </select>
          {errors.municipality_id && <p className="text-red-500 text-xs mt-1">{errors.municipality_id}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
          Dirección
        </label>
        <input
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Ingrese la dirección completa"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Teléfono
        </label>
        <input
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ingrese el número de teléfono"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ingrese el correo electrónico"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : buttonText}
        </button>
      </div>
    </form>
  );
};

export default HospitalForm;