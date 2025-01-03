import React, { useState } from 'react';
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';

const CompanyActions = ({ company, onView, onEdit, onDelete, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Gérer le changement de statut
  const handleStatusChange = (newStatus) => {
    onStatusChange(company.id, newStatus);
    setShowDropdown(false);
  };

  // Gérer la suppression avec confirmation
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      onDelete(company.id);
    }
    setShowDropdown(false);
  };

  // Gérer la vue des détails
  const handleView = () => {
    onView(company.id);
    setShowDropdown(false);
  };

  // Gérer l'édition
  const handleEdit = () => {
    onEdit(company.id);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Actions rapides */}
      <div className="flex space-x-2">
        {/* Bouton Voir */}
        <button
          onClick={handleView}
          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
          title="Voir les détails"
        >
          <Eye className="h-5 w-5" />
        </button>

        {/* Bouton Éditer */}
        <button
          onClick={handleEdit}
          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
          title="Modifier"
        >
          <Edit2 className="h-5 w-5" />
        </button>

        {/* Bouton Supprimer */}
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {/* Menu déroulant pour plus d'actions */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Plus d'actions"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {/* Option de statut */}
                <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <p className="font-medium mb-1">Changer le statut</p>
                  <select
                    value={company.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>

                {/* Actions supplémentaires */}
                <button
                  onClick={() => {
                    // Action pour voir l'historique
                    console.log('Voir historique');
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Voir l'historique
                </button>

                <button
                  onClick={() => {
                    // Action pour générer un rapport
                    console.log('Générer rapport');
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Générer un rapport
                </button>

                <button
                  onClick={() => {
                    // Action pour réinitialiser les accès
                    if (window.confirm('Réinitialiser les accès de cette entreprise ?')) {
                      console.log('Réinitialiser accès');
                    }
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  Réinitialiser les accès
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badge de statut */}
      <div className="ml-4">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          company.status === 'active' 
            ? 'bg-green-100 text-green-800'
            : company.status === 'inactive'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default CompanyActions;