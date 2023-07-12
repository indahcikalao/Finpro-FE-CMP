import { Dashboard } from '../Components/Layout';
import {
	DownloadVA,
	Homepage,
	MonitoringVA,
	UserManagement,
	UserRoleManagement,
} from '../pages';

export const protectedRoutes = [
	{
		element: <Dashboard />,
		children: [
			{ path: '/', element: <Homepage /> },
			{ path: '/role-management', element: <UserRoleManagement /> },
			{ path: '/user-management', element: <UserManagement /> },
			{ path: '/monitoring-va', element: <MonitoringVA /> },
			{ path: '/download-va', element: <DownloadVA /> },
		],
	},
];
