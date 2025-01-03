import React, { createContext, useState, useContext } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);

  const addCompany = (company) => {
    setCompanies((prev) => [...prev, { ...company, id: Date.now() }]);
  };

  const updateCompany = (id, updates) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === id ? { ...company, ...updates } : company))
    );
  };

  const deleteCompany = (id) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  return (
    <CompanyContext.Provider value={{ companies, addCompany, updateCompany, deleteCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};