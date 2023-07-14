import {
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import { UserManagement } from '../../../pages/Protected/UserManagement';
import api from '../../../api/axios';
import { act } from 'react-dom/test-utils';
import { usePermission } from '../../../hooks';
import { PERMISSIONS_CONFIG } from '../../../config';

global.ResizeObserver = require('resize-observer-polyfill');
jest.mock('../../../hooks/use-permission');
jest.mock('../../../hooks/use-auth');

describe('User Management Page', () => {
	const view = () => render(<UserManagement />);

	beforeEach(() => {
		usePermission.mockReturnValue({
			config: PERMISSIONS_CONFIG,
			hasPermission: jest.fn(),
			hasWritePermission: jest.fn(),
			hasReadPermission: jest.fn(),
		});
	});
	afterEach(cleanup);

	it('has correct section title', () => {
		view();

		const sectionTitle = screen.getByText(/user management/i);

		expect(sectionTitle).toBeInTheDocument();
	});

	it('rendered hidden drawer component properly', () => {
		view();

		const drawer = screen.getByTestId('drawer');
		const btnSubmit = screen.getByText(/(activate|update) user/i, {
			selector: 'button',
		});

		expect(drawer).toBeInTheDocument();
		expect(btnSubmit).toBeInTheDocument();
		expect(drawer).not.toHaveStyle('transform: none');
	});

	it('rendered datatable component', () => {
		view();

		const table = screen.getByRole('table');

		expect(table).toBeInTheDocument();
	});

	it('rendered loading on the table initially', () => {
		view();

		const loadingTable = screen.getByText(/please wait/i);

		expect(loadingTable).toBeInTheDocument();
	});
});

describe('API integration inside User Management Page', () => {
	const view = () => render(<UserManagement />);

	const getApiMock = jest.spyOn(api, 'get');

	const mockUsersResponse = {
		status: 'Success',
		data: [
			{
				id: 1,
				username: 'admin',
				fullname: 'Admin',
				email: 'admin@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 3,
				username: 'renald',
				fullname: 'Rhenald Karrel',
				email: 'renald@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 8,
				username: 'janedoe',
				fullname: 'Jane Doe',
				email: 'janedoe@gmail.com',
				is_active: false,
				role: '',
				role_id: 0,
			},
			{
				id: 9,
				username: 'johndoe',
				fullname: 'John Doe',
				email: 'johndoe@gmail.com',
				is_active: true,
				role: 'user',
				role_id: 15,
			},
			{
				id: 10,
				username: 'arya1234',
				fullname: 'I Gede Arya',
				email: 'arya@gmail.com',
				is_active: true,
				role: 'user',
				role_id: 15,
			},
			{
				id: 12,
				username: 'roby',
				fullname: 'Mas Roby',
				email: 'roby@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 13,
				username: 'Mega chan',
				fullname: 'Mega chan',
				email: 'Roby@mail.coom',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 14,
				username: 'MegaChan',
				fullname: 'Mega',
				email: 'Mega@gmail.com',
				is_active: true,
				role: 'user',
				role_id: 15,
			},
			{
				id: 15,
				username: 'cikal',
				fullname: 'cikal',
				email: 'cikal@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 16,
				username: 'aziz',
				fullname: 'Aziz',
				email: 'aziz@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
			{
				id: 17,
				username: 'kamala',
				fullname: 'Kamala Khan',
				email: 'kamalakhan@gmail.com',
				is_active: false,
				role: '',
				role_id: 0,
			},
			{
				id: 18,
				username: 'irfan',
				fullname: 'irfan',
				email: 'irfan@gmail.com',
				is_active: true,
				role: 'admin',
				role_id: 1,
			},
		],
	};

	const mockRolesResponse = {
		status: 'Success',
		data: [
			{
				id: 1,
				name: 'admin',
				access: [
					{
						resource: 'Monitoring',
						can_read: true,
						can_write: true,
					},
					{
						resource: 'Download',
						can_read: false,
						can_write: false,
					},
				],
			},
			{
				id: 15,
				name: 'user',
				access: [
					{
						resource: 'Monitoring',
						can_read: false,
						can_write: false,
					},
					{
						resource: 'Download',
						can_read: false,
						can_write: false,
					},
				],
			},
		],
	};

	beforeEach(() => {
		usePermission.mockReturnValue({
			config: PERMISSIONS_CONFIG,
			hasPermission: jest.fn(),
			hasWritePermission: jest.fn(() => true),
			hasReadPermission: jest.fn(),
		});

		getApiMock.mockImplementation((url) => {
			switch (url) {
				case '/admin/users':
					return Promise.resolve({ data: mockUsersResponse });
				case '/admin/roles':
					return Promise.resolve({ data: mockRolesResponse });
				default:
					return Promise.reject(new Error('Not found'));
			}
		});

		getApiMock.mockResolvedValueOnce({ data: mockUsersResponse });
		getApiMock.mockResolvedValueOnce({ data: mockRolesResponse });
	});
	afterEach(cleanup);
	afterAll(() => {
		getApiMock.mockRestore();
	});

	it('fetched users successfully', async () => {
		await act(() => view());

		const firstCall = getApiMock.mock.calls.at(0);
		const endpoint = firstCall[0];

		expect(endpoint).toEqual(expect.stringMatching(/^\/admin\/users\b/));

		expect(await screen.findByText(/renald@gmail.com/i)).toBeInTheDocument();
	});

	it('fetched roles successfully', async () => {
		await act(() => view());

    const lastCallArgs = getApiMock.mock.lastCall;
		const endpoint = lastCallArgs[0];

		expect(endpoint).toEqual('/admin/roles');
	});

	it('user able to open the drawer after users fetched', async () => {
		await act(() => view());

		const drawer = screen.getByTestId('drawer');

		const btnActivateEdit = await screen.findAllByRole('button', {
			name: /(activate|edit)/i,
		});

		fireEvent.click(btnActivateEdit[0]);

		await waitFor(() => {
			expect(drawer).toHaveStyle('transform: none');
		});
	});

	it('prevent assign role when the field is empty', async () => {
		await act(() => view());

		const btnActivate = await screen.findAllByText(/(activate)/i);

		fireEvent.click(btnActivate[0]);

		const btnActivateUser = await screen.findByRole('button', {
			name: /activate user/i,
		});

		fireEvent.click(btnActivateUser);

		const failedError = await screen.findByText(/role can't be empty/i);

		expect(failedError).toBeInTheDocument();
	});

	it('shows confirmation dialog when deleting user', async () => {
		await act(() => view());

		const btnDelete = await screen.findAllByText(/delete/i);

		fireEvent.click(btnDelete[0]);

		await waitFor(() => {
			const confirmationAlert = screen.getByRole('dialog', {
				name: /delete user/i,
			});

			expect(confirmationAlert).toBeInTheDocument();
		});
	});

	it('call the delete API', async () => {
		const deleteApiMock = jest.spyOn(api, 'delete');

		await act(() => view());

		const btnDelete = await screen.findAllByText(/delete/i);

		fireEvent.click(btnDelete[0]);

		const btnOK = await screen.findByText(/ok/i);

		fireEvent.click(btnOK);

		await waitFor(() => expect(deleteApiMock).toHaveBeenCalledTimes(1));
		expect(deleteApiMock).toHaveBeenLastCalledWith(
			expect.stringMatching(/^\/admin\/user\b/)
		);

		deleteApiMock.mockRestore();
	});

	it('call the update API', async () => {
		const putApiMock = jest.spyOn(api, 'put');

		await act(() => view());

		const btnEdit = await screen.findAllByText(/edit/i);

		fireEvent.click(btnEdit[0]);

		const btnUpdateUser = await screen.findByRole('button', {
			name: /update user/i,
		});

		fireEvent.click(btnUpdateUser);

		await waitFor(() => expect(putApiMock).toHaveBeenCalledTimes(1));

		const lastCallArgs = putApiMock.mock.calls.at(-1);
		const endpoint = lastCallArgs[0];

		expect(endpoint).toEqual(
			expect.stringMatching(/^\/admin\/user\/role\/\d+$/)
		);

		putApiMock.mockRestore();
	});

	it('able to close drawer on cancel', async () => {
		await act(() => view());

		const btnEdit = await screen.findAllByText(/edit/i);

		fireEvent.click(btnEdit[0]);

		const btnCloseDrawer = await screen.findByRole('button', {
			name: /close drawer/i,
		});

		fireEvent.click(btnCloseDrawer);

		expect(document.body).toHaveStyle('overflow: unset');
	});
});

describe('Search functionality inside User Management Page', () => {
	const view = () => render(<UserManagement />);

  beforeEach(() => {
		usePermission.mockReturnValue({
			config: PERMISSIONS_CONFIG,
			hasPermission: jest.fn(),
			hasWritePermission: jest.fn(),
			hasReadPermission: jest.fn(),
		});
	});

	afterEach(cleanup);

  it('input can be typed', () => {
    const searchKeyword = 'admin';

    view();

    const searchTextbox = screen.getByPlaceholderText(/find user.../i);

    fireEvent.change(searchTextbox, {
      target: {
        value: searchKeyword,
      },
    });

    expect(searchTextbox).toHaveValue(searchKeyword);
  });

  it('search function runs properly', async () => {
    const searchKeyword = 'admin';

    const getApiMock = jest.spyOn(api, 'get');

    view();

    const searchTextbox = screen.getByPlaceholderText(/find user.../i);

    fireEvent.change(searchTextbox, {
      target: {
        value: searchKeyword,
      },
    });

    const searchButton = screen.getByRole('button', {
      name: /search/i,
    });

    fireEvent.click(searchButton);

    getApiMock.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          username: 'admin',
          fullname: 'Admin',
          email: 'admin@gmail.com',
          is_active: true,
          role: 'admin',
          role_id: 1,
        },
      ]
    });

    expect(getApiMock).toHaveBeenCalled();

    const filterButton = screen.getByRole('button', {
      name: /username/i,
    });

    fireEvent.click(filterButton);

    const emailOption = await screen.findByRole('menuitem', {
      name: /email/i
    });

    fireEvent.click(emailOption);

    fireEvent.click(searchButton);

    expect(getApiMock).toHaveBeenCalled();

    fireEvent.change(searchTextbox, {
      target: {
        value: '',
      },
    });

    fireEvent.click(searchButton);

    expect(getApiMock).toHaveBeenCalled();
  });

  it('can change the filter option', async () => {
    view();

    const filterButton = screen.getByRole('button', {
      name: /username/i,
    });

    fireEvent.click(filterButton);

    const emailOption = await screen.findByRole('menuitem', {
      name: /email/i
    });

    fireEvent.click(emailOption);

    expect(filterButton).toHaveTextContent(/email/i);

    fireEvent.click(filterButton);

    const usernameOption = await screen.findByRole('menuitem', {
      name: /username/i
    });

    fireEvent.click(usernameOption);

    expect(filterButton).toHaveTextContent(/username/i);
  });
});
