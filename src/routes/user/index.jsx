import React from 'react';
import { Dashboard } from '../../Components/Layout';
import MonitoringVA from "../../pages/admin/MonitoringVA";
import DownloadVA from "../../pages/admin/DownloadVA";

const UserRoutes = [
	{
		path: '/',
		element: <Dashboard />,
		children: [
      { path: '/', element: <h1>Hello user</h1> },
      { path: "/monitoring-va", element: <MonitoringVA /> },
      { path: "/download-va", element: <DownloadVA /> },
    ],
	},
];

export default UserRoutes;
