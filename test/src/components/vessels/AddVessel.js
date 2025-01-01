import React, { useState } from 'react';
import { useVessel } from '../../context/VesselContext';
import { Ship, Plus } from 'lucide-react';
import { shipTypes } from '../../config/shipTypes'; // Importez les types de navires

function AddVessel() {
  const { addVessel } = useVessel();
  const [vesselData, setVesselData] = useState({
    vesselName: '',
    imoNumber: '',
    vesselType: '',
    yearBuilt: '',
    flag: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVesselData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addVessel(vesselData); // Ajoutez le navire via le contexte
    // Réinitialiser le formulaire
    setVesselData({
      vesselName: '',
      imoNumber: '',
      vesselType: '',
      yearBuilt: '',
      flag: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Ship className="h-5 w-5 mr-2 text-blue-500" />
            Ajouter un Navire
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du Navire</label>
              <input
                type="text"
                name="vesselName"
                value={vesselData.vesselName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro IMO</label>
              <input
                type="text"
                name="imoNumber"
                value={vesselData.imoNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de Navire</label>
              <select
                name="vesselType"
                value={vesselData.vesselType}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                {shipTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Année de Construction</label>
              <input
                type="number"
                name="yearBuilt"
                value={vesselData.yearBuilt}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pavillon</label>
              <input
                type="text"
                name="flag"
                value={vesselData.flag}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2 inline" />
            Ajouter le Navire
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVessel;