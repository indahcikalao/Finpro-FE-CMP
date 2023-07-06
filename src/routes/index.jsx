import { useRoutes, Navigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/use-local-storage';
import React from 'react';
import { Dashboard } from '../Components/Layout';
import Homepage from '../pages/admin/Homepage';
import { UserManagement, UserRoleManagement } from '../pages/admin';
import MonitoringVA from '../pages/admin/MonitoringVA';
import DownloadVA from '../pages/admin/DownloadVA';

const AppRoutes = () => {
	const tokenStorage = useLocalStorage('token');

	const element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        { path: "/", element: <Homepage /> },
        { path: "/role-management", element: <UserRoleManagement /> },
        { path: "/user-management", element: <UserManagement /> },
        { path: "/monitoring-va", element: <MonitoringVA /> },
        { path: "/download-va", element: <DownloadVA /> },
      ],
    },
  ]);

	if (!tokenStorage.get()) {
		return <Navigate to='/login' />;
	}

	return <>{element}</>;
};

export default AppRoutes;
