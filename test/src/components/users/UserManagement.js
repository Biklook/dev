import React, { useState } from 'react';
import { Trash2, User, Edit, X } from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const Card = ({ children }) => <div className="bg-white shadow rounded-lg overflow-hidden">{children}</div>;
const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-lg font-medium text-gray-900">{children}</h2>;
const CardContent = ({ children }) => <div className="p-6">{children}</div>;

function UserManagement() {
  const { users, updateUser, deleteUser, userRoles } = useUsers();
  const { auth } = useAuth();
  const [editingUser, setEditingUser] = useState(null);

  const isAdmin = auth.role === 'admin';

  const availablePermissions = ['view', 'create', 'edit', 'delete'];

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      newRole: user.role,
      newPermissions: [...user.permissions]
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    updateUser(editingUser.id, {
      role: editingUser.newRole,
      permissions: editingUser.newPermissions
    });

    setEditingUser(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const togglePermission = (permission) => {
    if (!editingUser) return;

    const newPermissions = editingUser.newPermissions.includes(permission)
      ? editingUser.newPermissions.filter(p => p !== permission)
      : [...editingUser.newPermissions, permission];

    setEditingUser({
      ...editingUser,
      newPermissions
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  {isAdmin && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.newRole}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            newRole: e.target.value
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {Object.values(userRoles).map(role => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'supervisor'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <div className="flex flex-wrap gap-2">
                          {availablePermissions.map(permission => (
                            <label key={permission} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={editingUser.newPermissions.includes(permission)}
                                onChange={() => togglePermission(permission)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-700">{permission}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          {editingUser?.id === user.id ? (
                            <>
                              <button
                                onClick={handleUpdateUser}
                                className="text-green-600 hover:text-green-900"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserManagement;