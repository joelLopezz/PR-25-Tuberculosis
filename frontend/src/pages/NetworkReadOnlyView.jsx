// src/pages/NetworkReadOnlyView.jsx
import React, { useState, useEffect } from 'react';
import { getAllNetworks } from '../services/networkService';
import { toast } from 'react-toastify';

const NetworkReadOnlyView = () => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        setLoading(true);
        const data = await getAllNetworks();
        setNetworks(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la lista de redes de salud');
        console.error(err);
        toast.error('Error al cargar datos de redes de salud');
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

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
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Redes de Salud</h1>
        <div className="text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Vista de solo lectura
          </span>
        </div>
      </div>
      
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mx-auto flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600">
          <h2 className="text-xl font-bold text-white">Directorio de Redes de Salud</h2>
          <p className="text-purple-100 text-sm">Información actualizada de las redes de salud del departamento</p>
        </div>
        
        {networks.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No hay redes de salud registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospitales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipios</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {networks.map((network, index) => (
                  <tr 
                    key={network.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors duration-150 ease-in-out`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
                          {network.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{network.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {network.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{network.hospital_count || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{network.municipality_count || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${network.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {network.status === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Mostrando {networks.length} redes de salud en total
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkReadOnlyView;