/* eslint-disable react-hooks/exhaustive-deps */
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useSecureLocalStorage } from '../../hooks';
import api from '../../api/axios';

export const AuthContext = createContext({});

const events = [
	'load',
	'mousemove',
	'mousedown',
	'click',
	'scroll',
	'keypress',
];

export const AuthProvider = ({ children }) => {
	const tokenStorage = useSecureLocalStorage('token');
	const userDataStorage = useSecureLocalStorage('userData');

	const navigate = useNavigate();
	const timerRef = useRef();
	const [auth, setAuth] = useState(userDataStorage.get() ?? {});
	const token = tokenStorage.get();

	const logout = useCallback(() => {
		setAuth(null);
		localStorage.clear();
		navigate('/login');
	}, [navigate]);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
	}, []);

	const getUserData = useCallback(async () => {
		try {
			await api
				.get('/user/who-iam')
				.then((response) => setAuth(response.data.data));
		} catch (error) {
			console.log('error', error);
		}
	}, [token]);

	const handleLogoutTimer = useCallback(() => {
		timerRef.current = setTimeout(() => {
			resetTimer();
			Object.values(events).forEach((item) => {
				window.removeEventListener(item, resetTimer);
			});

			logout();
		}, 1800000);
	}, [resetTimer, logout]);

	useEffect(() => {
		if (token) {
			Object.values(events).forEach((item) => {
				window.addEventListener(item, () => {
					resetTimer();
					handleLogoutTimer();
				});
			});
		}
	}, [navigate, resetTimer, handleLogoutTimer]);

	useEffect(() => {
		userDataStorage.set(auth);
	}, [auth]);

	const memoizedValue = useMemo(
		() => ({ logout, auth, getUserData }),
		[logout, auth, getUserData]
	);

	return (
		<AuthContext.Provider value={memoizedValue}>
			{children}
		</AuthContext.Provider>
	);
};
