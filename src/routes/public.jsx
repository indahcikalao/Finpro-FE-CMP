import { Navigate } from "react-router-dom";
import Forbidden from "../pages/Forbidden";

export const publicRoutes = [
	{ path: '/forbidden', element: <Forbidden /> },
	{ path: '/*', element: <Navigate to='.' /> },
];
