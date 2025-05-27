// src/components/PatientSearchField.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useField } from 'formik';
import { getAllPatients } from '../services/patientService';
import { getAllReferrals } from '../services/referralService';

const PatientSearchField = ({ name, label, placeholder, required = false, onPatientChange = null }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [availablePatients, setAvailablePatients] = useState([]); // Pacientes disponibles (sin referencias pendientes)
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const resultsRef = useRef(null);
  
  // Cargar pacientes y referencias al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsData, referralsData] = await Promise.all([
          getAllPatients(),
          getAllReferrals()
        ]);
        
        // Filtrar pacientes que NO tienen referencias pendientes
        const patientsWithPendingReferrals = referralsData
          .filter(referral => referral.status === 'Pendiente')
          .map(referral => referral.patient_id);
        
        const availablePatientsData = patientsData.filter(
          patient => !patientsWithPendingReferrals.includes(patient.id)
        );
        
        setPatients(patientsData);
        setAvailablePatients(availablePatientsData);
        
        // Si ya hay un valor seleccionado, buscar el paciente correspondiente
        if (field.value) {
          const patient = patientsData.find(p => p.id.toString() === field.value.toString());
          if (patient) {
            setSelectedPatient(patient);
            setSearchTerm(`${patient.first_name} ${patient.last_name}`);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [field.value]);
  
  // Filtrar pacientes disponibles según término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients([]);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = availablePatients.filter(patient => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      return fullName.includes(term) || 
             (patient.ci && patient.ci.toLowerCase().includes(term));
    });
    
    setFilteredPatients(filtered);
  }, [searchTerm, availablePatients]);
  
  // Cerrar resultados al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // ⭐ ACTUALIZADA: Manejar la selección de un paciente
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.first_name} ${patient.last_name}`);
    setValue(patient.id.toString());
    setShowResults(false);
    
    // ⭐ NUEVO: Llamar a la función callback si existe
    if (onPatientChange) {
      onPatientChange(patient.id.toString());
    }
  };
  
  // ⭐ ACTUALIZADA: Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    // Si el campo está vacío, limpiar la selección
    if (e.target.value.trim() === '') {
      setSelectedPatient(null);
      setValue('');
      
      // ⭐ NUEVO: Notificar que no hay paciente seleccionado
      if (onPatientChange) {
        onPatientChange(null);
      }
    }
    
    setShowResults(true);
  };
  
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          id={name}
          className={`block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
            meta.touched && meta.error ? 'border-red-300' : ''
          }`}
          placeholder={placeholder || "Buscar paciente por nombre o CI..."}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm.trim() !== '' && setShowResults(true)}
          autoComplete="off"
        />
        
        {loading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : selectedPatient ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ) : (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {/* Resultados de búsqueda */}
      {showResults && filteredPatients.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
        >
          <ul className="divide-y divide-gray-200">
            {filteredPatients.map(patient => (
              <li 
                key={patient.id}
                className="px-4 py-2 hover:bg-teal-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleSelectPatient(patient)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                    {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{patient.first_name} {patient.last_name}</p>
                    <p className="text-xs text-gray-500">
                      {patient.ci ? `CI: ${patient.ci}` : 'Sin CI registrada'} • 
                      {` ${patient.tb_type}`}
                      {patient.hospital_name && ` • ${patient.hospital_name}`}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Mensaje si no hay resultados */}
      {showResults && searchTerm.trim() !== '' && filteredPatients.length === 0 && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden">
          <div className="px-4 py-3 text-sm text-gray-700">
            {availablePatients.length === 0 ? (
              <span className="text-orange-600">
                ⚠️ Todos los pacientes tienen referencias pendientes o no hay pacientes disponibles.
              </span>
            ) : (
              'No se encontraron pacientes disponibles. Intente con otro término de búsqueda.'
            )}
          </div>
        </div>
      )}
      
      {/* Mostrar error de Formik si existe */}
      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      )}
      
      {/* Información del paciente seleccionado */}
      {selectedPatient && (
        <div className="mt-2 bg-teal-50 p-2 rounded-md text-xs text-teal-800">
          <span className="font-medium">Paciente seleccionado:</span> {selectedPatient.first_name} {selectedPatient.last_name}
          {selectedPatient.hospital_name && (
            <span> • Hospital: {selectedPatient.hospital_name}</span>
          )}
        </div>
      )}
      
      {/* Información sobre pacientes filtrados */}
      {availablePatients.length !== patients.length && (
        <div className="mt-1 text-xs text-gray-500">
          ℹ️ Solo se muestran pacientes sin referencias pendientes ({availablePatients.length} de {patients.length} disponibles)
        </div>
      )}
    </div>
  );
};

export default PatientSearchField;