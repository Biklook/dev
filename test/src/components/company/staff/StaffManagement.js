import React from 'react';
import { User, Users } from 'lucide-react';
import StaffList from './StaffList';
import AddStaffMember from './AddStaffMember';
import { useStaff } from '../../../context/StaffContext';

const Card = ({ children }) => <div className="bg-white shadow rounded-lg overflow-hidden">{children}</div>;
const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-lg font-medium text-gray-900">{children}</h2>;
const CardContent = ({ children }) => <div className="p-6">{children}</div>;

function StaffManagement() {
  const { totalStaff } = useStaff();

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 bg-opacity-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Personnel</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un membre du personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <AddStaffMember />
        </CardContent>
      </Card>

      {/* Liste du personnel */}
      <Card>
        <CardHeader>
          <CardTitle>Liste du Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffList />
        </CardContent>
      </Card>
    </div>
  );
}

export default StaffManagement;