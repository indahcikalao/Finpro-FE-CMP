import React from 'react';
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../../../context/auth';
import api from '../../../api/axios';

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
}));

jest.mock('../../../api/axios', () => ({
	get: jest
		.fn()
		.mockResolvedValue({ data: { data: { id: 1, name: 'John Doe' } } }),
}));

describe('AuthContext', () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	test('should call getUserData with the correct endpoint', async () => {
		const MockConsumerComponent = () => {
			const { getUserData } = React.useContext(AuthContext);

			React.useEffect(() => {
				getUserData();
			}, [getUserData]);

			return null;
		};

		render(
			<AuthProvider>
				<MockConsumerComponent />
			</AuthProvider>
		);

		expect(api.get).toHaveBeenCalledWith('/user/who-iam');
		expect(api.get).toHaveBeenCalledTimes(1);
	});

	test('should logout navigate to login page', async () => {
		const mockNavigate = jest.fn();
		useNavigate.mockReturnValue(mockNavigate);

		render(
			<AuthProvider>
				<AuthContext.Consumer>
					{({ logout }) => {
						logout();
						expect(mockNavigate).toHaveBeenCalledWith('/login');
					}}
				</AuthContext.Consumer>
			</AuthProvider>
		);
	});
});
