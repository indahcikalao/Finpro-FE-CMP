import React from 'react';
import { Dashboard } from '../../Components/Layout';

const AdminRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [{ path: '/', element: <h1>Hello admin</h1> }],
	},
];

export default AdminRoutes;
