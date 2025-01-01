import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext(null);

const userRoles = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator'
};

// Utilisateurs prédéfinis pour la démonstration
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@marine.com',
    name: 'Administrateur',
    role: userRoles.ADMIN,
    permissions: ['all'],
    status: 'active',
    dateCreated: '2024-01-01',
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    username: 'supervisor',
    email: 'supervisor@marine.com',
    name: 'Chef Mécanicien',
    role: userRoles.SUPERVISOR,
    permissions: ['view', 'edit', 'create'],
    status: 'active',
    dateCreated: '2024-01-01',
    lastLogin: new Date().toISOString()
  },
  {
    id: 3,
    username: 'operator1',
    email: 'operator1@marine.com',
    name: 'John Smith',
    role: userRoles.OPERATOR,
    permissions: ['view', 'create'],
    status: 'active',
    dateCreated: '2024-01-01',
    lastLogin: new Date().toISOString()
  },
  {
    id: 4,
    username: 'operator2',
    email: 'operator2@marine.com',
    name: 'Jane Doe',
    role: userRoles.OPERATOR,
    permissions: ['view'],
    status: 'active',
    dateCreated: '2024-01-01',
    lastLogin: new Date().toISOString()
  }
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
      dateCreated: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active'
    };
    setUsers(prev => {
      const updated = [...prev, newUser];
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUser = (id, updates) => {
    setUsers(prev => {
      const updated = prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      );
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteUser = (id) => {
    setUsers(prev => {
      const updated = prev.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(updated));
      return updated;
    });
  };

  const hasPermission = (user, permission) => {
    if (!user) return false;
    if (user.role === userRoles.ADMIN) return true;
    return user.permissions.includes(permission);
  };

  return (
    <UserContext.Provider 
      value={{ 
        users, 
        addUser, 
        updateUser, 
        deleteUser, 
        hasPermission,
        userRoles 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export default UserContext;