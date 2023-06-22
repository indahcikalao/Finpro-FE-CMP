import React from 'react';
import { Dashboard } from '../../Components/Layout';
import { UserManagement } from '../../pages/admin';

const AdminRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [
			{ path: '/user-management', element: <UserManagement /> },
			{ path: '/', element: <h1>Hello admin</h1> },
		],
	},
];

export default AdminRoutes;
