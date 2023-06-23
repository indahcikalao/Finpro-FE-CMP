import React from "react";
import { Dashboard } from "../../Components/Layout";
import { UserManagement, UserRoleManagement } from "../../pages/admin";
import Homepage from "../../pages/admin/Homepage";

const AdminRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/role-management", element: <UserRoleManagement /> },
      { path: "/user-management", element: <UserManagement /> },
    ],
  },
];

export default AdminRoutes;
