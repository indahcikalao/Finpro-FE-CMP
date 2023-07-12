import { Login, Register, ResetPassword } from "../pages";

export const authRoutes = [
	{ path: '/', element: <Login /> },
	{ path: '/register', element: <Register /> },
	{ path: '/reset-password', element: <ResetPassword /> },
];
