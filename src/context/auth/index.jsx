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

import { useLocalStorage } from '../../hooks';

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
	const tokenStorage = useLocalStorage('token');
	const userDataStorage = useLocalStorage('userData');

	const navigate = useNavigate();
	const timerRef = useRef();
	const [auth, setAuth] = useState(userDataStorage.get() ?? {});
  const token = tokenStorage.get();

	const logout = useCallback(() => {
    setAuth(null)
		localStorage.clear();
		navigate('/login');
	}, [navigate]);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
	}, []);

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
		};
	}, [navigate, resetTimer, handleLogoutTimer]);

	useEffect(() => {
		userDataStorage.set(auth);
	}, [auth]);

	const memoizedValue = useMemo(() => ({ logout, auth, setAuth }), [logout, auth]);

	return (
		<AuthContext.Provider value={memoizedValue}>
			{children}
		</AuthContext.Provider>
	);
};
