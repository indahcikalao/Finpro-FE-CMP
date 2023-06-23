import { useRoutes, Navigate } from 'react-router-dom';
import AdminRoutes from '../admin';
import UserRoutes from '../user';
import { useLocalStorage } from '../../hooks/use-local-storage';
import React from 'react';
import { useAuth } from '../../hooks';

const AppRoutes = () => {
	const tokenStorage = useLocalStorage('token');
	const { auth } = useAuth();

	const routes =
		auth?.role?.toLowerCase() === 'admin'
			? [...AdminRoutes, ...UserRoutes]
			: UserRoutes;

	const element = useRoutes([...routes]);

	if (!tokenStorage.get()) {
		return <Navigate to='/login' />;
	}

	return <>{element}</>;
};

export default AppRoutes;
