import { useRoutes } from 'react-router-dom';
import { useSecureLocalStorage } from '../hooks';
import React from 'react';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { authRoutes } from './auth';

const AppRoutes = () => {
	const token = useSecureLocalStorage('token').get();

  const routes = token ? protectedRoutes : authRoutes;

	const element = useRoutes([
    ...routes,
    ...publicRoutes,
  ]);

	return <>{element}</>;
};

export default AppRoutes;
