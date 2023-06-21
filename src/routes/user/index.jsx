import React from 'react';
import { Dashboard } from '../../Components/Layout';
import Tables from '../admin/UserRoleManagement';

const UserRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [{ path: '/', element: <Tables /> }],
	},
];

export default UserRoutes;
