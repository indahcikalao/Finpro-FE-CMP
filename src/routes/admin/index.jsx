import React from "react";
import { Dashboard } from "../../Components/Layout";
import { UserManagement, UserRoleManagement } from "../../pages/admin";
import Homepage from "../../pages/admin/Homepage";
import MonitoringVA from "../../pages/admin/MonitoringVA";
import DownloadVA from "../../pages/admin/DownloadVA";

const AdminRoutes = [
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
];

export default AdminRoutes;
