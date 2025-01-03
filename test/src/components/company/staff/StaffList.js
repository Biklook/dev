import React, { useState } from 'react';
import { Trash2, User, Edit, X } from 'lucide-react';
import { useStaff } from '../../../context/StaffContext';
import { STAFF_ROLES } from './StaffRoles';

function StaffList() {
  const { staff, updateStaffMember, deleteStaffMember } = useStaff();
  const [editingStaff, setEditingStaff] = useState(null);

  const handleEdit = (member) => {
    setEditingStaff({
      ...member,
      newRole: member.role,
      newPermissions: [...member.permissions]
    });
  };

  const handleUpdate = () => {
    if (!editingStaff) return;

    updateStaffMember(editingStaff.id, {
      role: editingStaff.newRole,
      permissions: editingStaff.newPermissions
    });

    setEditingStaff(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      deleteStaffMember(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Navires assignés</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staff.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.position}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingStaff?.id === member.id ? (
                  <select
                    value={editingStaff.newRole}
                    onChange={(e) => setEditingStaff({
                      ...editingStaff,
                      newRole: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {Object.entries(STAFF_ROLES).map(([key, role]) => (
                      <option key={key} value={key}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {STAFF_ROLES[member.role]?.label || member.role}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {member.assignedVessels?.map((vessel) => (
                    <span key={vessel.id} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                      {vessel.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2 justify-end">
                  {editingStaff?.id === member.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:text-green-900"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingStaff(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffList;