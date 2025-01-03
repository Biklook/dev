import React from 'react';
import { useCompany } from '../../context/CompanyContext';

function CompanyManagement() {
  const { companies, addCompany, deleteCompany } = useCompany();

  return (
    <div>
      <h1>Gestion des Entreprises</h1>
      <button onClick={() => addCompany({ name: 'Nouvelle Entreprise' })}>
        Ajouter une Entreprise
      </button>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name}
            <button onClick={() => deleteCompany(company.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyManagement;