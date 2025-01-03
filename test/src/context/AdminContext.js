import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // État pour les entreprises
  const [companies, setCompanies] = useState([]);
  
  // État pour les statistiques globales
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalVessels: 0,
    totalAlerts: 0
  });

  // Fonction pour mettre à jour les statistiques
  const updateGlobalStats = () => {
    const stats = {
      totalCompanies: companies.length,
      totalVessels: companies.reduce((acc, company) => 
        acc + (company.vessels?.length || 0), 0
      ),
      totalAlerts: companies.reduce((acc, company) => 
        acc + (company.alerts?.length || 0), 0
      )
    };
    setGlobalStats(stats);
  };

  // Fonction pour ajouter une entreprise
  const addCompany = (newCompany) => {
    setCompanies(prev => [...prev, newCompany]);
    updateGlobalStats();
  };

  // Fonction pour mettre à jour une entreprise
  const updateCompany = (companyId, updatedData) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { ...company, ...updatedData }
          : company
      )
    );
    updateGlobalStats();
  };

  // Fonction pour supprimer une entreprise
  const deleteCompany = (companyId) => {
    setCompanies(prev => 
      prev.filter(company => company.id !== companyId)
    );
    updateGlobalStats();
  };

  // Fonction pour changer le statut d'une entreprise
  const toggleCompanyStatus = (companyId) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { 
              ...company, 
              status: company.status === 'active' ? 'inactive' : 'active' 
            }
          : company
      )
    );
  };

  return (
    <AdminContext.Provider value={{
      companies,
      globalStats,
      addCompany,
      updateCompany,
      deleteCompany,
      toggleCompanyStatus,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};