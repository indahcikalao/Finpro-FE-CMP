import React from 'react';
import { Dashboard } from '../../Components/Layout';

const UserRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [{ path: '/', element: <h1>Hello user</h1> }],
	},
];

export default UserRoutes;
