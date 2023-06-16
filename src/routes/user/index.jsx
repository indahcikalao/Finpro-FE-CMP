import React from 'react';
import { Dashboard } from '../../Components/Layout';
import Tables from '../admin/role-management';

const UserRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [{ path: '/', element: <Tables /> }],
	},
];

export default UserRoutes;
