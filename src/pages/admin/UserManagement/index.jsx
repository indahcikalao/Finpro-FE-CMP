import React from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Typography, Button } from '@material-tailwind/react';

import { Badge } from '../../../Components/Atoms';

const ActionsColumn = ({ id }) => {
	const handleDeleteUser = async (id) => {
		try {
			const response = await axios.delete(
				`https://88857839-8bc7-4b7e-ae66-3aac4cfcacf1.mock.pstmn.io/admin/${id}`
			);

			if (response.status === 200) {
				alert('User deleted!');

				window.location.reload();
			}
		} catch (error) {
			alert('Unable to delete user!');
		}
	};

	return (
		<div className='flex gap-2'>
			<Typography
				as='button'
				href='#'
				variant='small'
				color='blue'
				className='font-medium'
			>
				Edit
			</Typography>
			<Typography
				as='button'
				onClick={() => handleDeleteUser(id)}
				variant='small'
				color='red'
				className='font-medium'
			>
				Delete
			</Typography>
		</div>
	);
};

const UserManagement = () => {
	const [data, setData] = React.useState([]);

	React.useEffect(() => {
		const getUsers = async () => {
			const headers = {
				'x-mock-response-code': '200',
			};

			try {
				const { data: response } = await axios.get(
					'https://88857839-8bc7-4b7e-ae66-3aac4cfcacf1.mock.pstmn.io/admin/user/active',
					{ headers }
				);

				setData(response.data);
			} catch (error) {
				console.log('error', error);
			}
		};

		getUsers();
	}, []);

	const handleActivateUser = async (id) => {
		const data = {
			is_active: true,
		};

		try {
			const { data: response } = await axios.put(
				`https://88857839-8bc7-4b7e-ae66-3aac4cfcacf1.mock.pstmn.io/admin/active/${id}`,
				data
			);

			const activatedUser = response.data;

			setData((prev) =>
				prev.map((user) =>
					user.id === activatedUser.id ? { ...user, ...activatedUser } : user
				)
			);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	return (
		<div className='my-4 space-y-4'>
			<div className='flex items-end justify-between'>
				<Typography
					variant='h1'
					className='font-bold capitalize text-lg md:text-2xl'
				>
					user management
				</Typography>
				<Button variant='filled' size='sm'>
					Add New User
				</Button>
			</div>
			<DataTable
				columns={[
					{
						name: 'Fullname',
						selector: (row) => row.fullname,
						sortable: true,
					},
					{
						name: 'Username',
						selector: (row) => row.username,
						sortable: true,
					},
					{
						name: 'Email',
						selector: (row) => row.email,
						sortable: true,
					},
					{
						name: 'Status',
						selector: (row) => (row.is_active ? 'Active' : 'Inactive'),
						cell: (row) =>
							row.is_active ? (
								<Badge type='success'>Active</Badge>
							) : (
								<button
									className='hover:opacity-80 whitespace-nowrap'
									onClick={() => handleActivateUser(row.id)}
								>
									<Badge type='danger'>Activate User</Badge>
								</button>
							),
					},
					{
						name: 'Role',
						selector: (row) => row.role,
					},
					{
						name: 'Actions',
						button: true,
						cell: (row) => <ActionsColumn id={row.id} />,
					},
				]}
				data={data}
				pagination
			/>
		</div>
	);
};

export default UserManagement;
