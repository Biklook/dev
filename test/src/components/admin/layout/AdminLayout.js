import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from '../dashboard/AdminDashboard';
import CompanyList from '../companies/CompanyList';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'companies' && <CompanyList />}
          {activeTab === 'settings' && (
            <div className="text-center text-gray-500 mt-10">
              Paramètres à venir
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;