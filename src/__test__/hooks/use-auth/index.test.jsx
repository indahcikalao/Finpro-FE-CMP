import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../hooks';
import { AuthContext } from '../../../context';

describe('useAuth', () => {
	const authValue = {
		logout: jest.fn(),
		auth: {
			email: 'test@gmail.com',
			username: 'testuser',
		},
		getUserData: jest.fn(),
	};

	it('returns the auth context value', () => {
		const wrapper = ({ children }) => (
			<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
		);

		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current).toEqual(authValue);
	});

	it('calls logout function correctly', () => {
		const wrapper = ({ children }) => (
			<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
		);

		const { result } = renderHook(() => useAuth(), { wrapper });

		result.current.logout();

		expect(authValue.logout).toHaveBeenCalled();
	});

	it('calls getUserData function correctly', () => {
		const wrapper = ({ children }) => (
			<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
		);

		const { result } = renderHook(() => useAuth(), { wrapper });

		result.current.getUserData();

		expect(authValue.getUserData).toHaveBeenCalled();
	});
});
