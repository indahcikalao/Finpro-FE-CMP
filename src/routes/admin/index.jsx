import React from 'react';
import { Dashboard } from '../../Components/Layout';
import Tables from './role-management';


const AdminRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [{ path: '/', element: <h1>Hello admin</h1> },
				   { path: 'role-management', element: <Tables />},
	],
	},
];

export default AdminRoutes;
