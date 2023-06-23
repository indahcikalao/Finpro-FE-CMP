import React from 'react';
import { Dashboard } from '../../Components/Layout';
import { UserManagement, UserRoleManagement } from '../../pages/admin';

const AdminRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [
			{ path: '/role-management', element: <UserRoleManagement /> },
			{ path: '/user-management', element: <UserManagement /> },
			{ path: '/', element: <h1>Hello admin</h1> },
		],
	},
];

export default AdminRoutes;
