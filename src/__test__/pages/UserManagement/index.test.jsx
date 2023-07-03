import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import UserManagement from '../../../pages/admin/UserManagement';
import api from '../../../api/axios';
import { act } from 'react-dom/test-utils';

describe('User Management Page', () => {
	const view = () => render(<UserManagement />);

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

	it('rendered no records on the table initially', () => {
		view();

		const noRecords = screen.getByText(/there are no records to display/i);

		expect(noRecords).toBeInTheDocument();
	});
});

describe('Fetching inside User Management Page', () => {
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
				is_active: true,
				role: 'admin',
				role_id: 1,
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

		expect(getApiMock).toHaveBeenCalledWith('/admin/users');

		expect(await screen.findByText(/renald@gmail.com/i)).toBeInTheDocument();
		/* Plus one because of the datatable's heading row counted */
		expect(await screen.findAllByRole(/row/i)).toHaveLength(
			mockUsersResponse.data.length + 1
		);
	});

	it('fetched roles successfully', async () => {
		await act(() => view());

		expect(getApiMock).toHaveBeenCalledWith('/admin/roles');
	});

  it('user able to open the drawer after users fetched', async () => {
    await act(() => view())

    const drawer = screen.getByTestId('drawer');

    const btnActivateEdit = await screen.findAllByText(/(activate|edit)/i);

    fireEvent.click(btnActivateEdit[0]);

    await waitFor(() => {
      expect(drawer).toHaveStyle('transform: none');
    })
  })

  it('shows confirmation dialog when deleting user', async () => {
    await act(() =>
      view());

    const btnDelete = await screen.findAllByText(/delete/i);

    fireEvent.click(btnDelete[0])

    await waitFor(async () => {
      const confirmationAlert = await screen.findByRole('dialog', {
        name: /delete user/i
      });

      expect(confirmationAlert).toBeInTheDocument();
    })
  })
});

describe('API-related event handler on User Management page', () => {
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
				is_active: true,
				role: 'admin',
				role_id: 1,
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

  it('call the delete API', async () => {
    const deleteApiMock = jest.spyOn(api, 'delete');

    await act(() => view());

    const btnDelete = await screen.findAllByText(/delete/i);

    fireEvent.click(btnDelete[0])

    const btnOK = await screen.findByText(/ok/i);

    fireEvent.click(btnOK);

    await waitFor(() => expect(deleteApiMock).toHaveBeenCalledTimes(1));
    expect(deleteApiMock).toHaveBeenLastCalledWith(expect.stringMatching(/^\/admin\/user\b/))
  })
})