import React from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import {
	Typography,
	Button,
	Drawer,
	IconButton,
	Input,
	Select,
	Option,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

import { Badge } from '../../../Components/Atoms';

const url = process.env.REACT_APP_BASE_URL;

const ActionsColumn = ({ row, handleEditUser }) => {
	const handleDeleteUser = async (id) => {
		const confirm = await Swal.fire({
			icon: 'warning',
			title: 'Delete User',
			text: 'Are you sure want to delete this user?',
			showCancelButton: true,
		});

		if (confirm.isDismissed) {
			return;
		}

		try {
			const response = await axios.delete(`${url}/admin/${id}`);

			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Deleted',
					text: 'User has been deleted!',
					timer: 1500,
					showConfirmButton: false,
				}).then(() => window.location.reload());
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text:
					'Unable to delete user: ' + error?.response?.data?.message ||
					error.message,
				timer: 1500,
				showConfirmButton: false,
			});
		}
	};

	return (
		<div className='flex gap-2'>
			<Typography
				as='button'
				onClick={() => handleEditUser(row)}
				variant='small'
				color='blue'
				className='font-medium'
			>
				Edit
			</Typography>
			<Typography
				as='button'
				onClick={() => handleDeleteUser(row.id)}
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
	const [editUser, setEditUser] = React.useState({});

	const [open, setOpen] = React.useState(false);

	const handleEditUser = (row) => {
		setOpen(true);
		setEditUser(row);
	};

	const handleCloseEditUser = () => {
		setOpen(false);
		setEditUser({});
	};

	React.useEffect(() => {
		const getUsers = async () => {
			const headers = {
				'x-mock-response-code': '200',
			};

			try {
				const { data: response } = await axios.get(`${url}/admin/user/active`, {
					headers,
				});

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
				`${url}/admin/active/${id}`,
				data
			);

			const activatedUser = response.data;

			setData((prev) =>
				prev.map((user) =>
					user.id === activatedUser.id ? { ...user, ...activatedUser } : user
				)
			);

			Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'User account successfully updated!',
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text:
					'Unable to activate user: ' + error?.response?.data?.message ||
					error.message,
				timer: 1500,
				showConfirmButton: false,
			});
		} finally {
			handleCloseEditUser();
		}
	};

	return (
		<React.Fragment>
			<div className='my-4 space-y-4'>
				<Typography
					variant='h1'
					className='font-bold capitalize text-lg md:text-2xl'
				>
					user management
				</Typography>
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
							selector: (row) => row.is_active,
							cell: (row) =>
								row.is_active ? (
									<Badge type='success'>Active</Badge>
								) : (
									<Badge type='danger'>Inactive</Badge>
								),
						},
						{
							name: 'Role',
							selector: (row) => row.role,
						},
						{
							name: 'Actions',
							button: true,
							cell: (row) => (
								<ActionsColumn row={row} handleEditUser={handleEditUser} />
							),
						},
					]}
					data={data}
					pagination
				/>
			</div>
			<Drawer open={open} onClose={handleCloseEditUser} className='p-4'>
				<div className='mb-6 flex items-center justify-between'>
					<Typography variant='h5' color='blue-gray'>
						{editUser.is_active ? 'Edit' : 'Activate'} User
					</Typography>
					<IconButton
						variant='text'
						color='blue-gray'
						onClick={handleCloseEditUser}
					>
						<XMarkIcon strokeWidth={2} className='h-5 w-5' />
					</IconButton>
				</div>
				<div className='space-y-4'>
					<div className='form-group'>
						<label
							htmlFor='fullname'
							className='block text-sm font-medium text-gray-900'
						>
							Fullname
						</label>
						<Input
							type='text'
							name='fullname'
							className='pl-3'
							value={editUser.fullname}
							variant='static'
							disabled
						/>
					</div>
					<div className='form-group'>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-900'
						>
							Email
						</label>
						<Input
							type='email'
							name='email'
							className='pl-3'
							value={editUser.email}
							variant='static'
							disabled
						/>
					</div>
					<div className='form-group'>
						<label
							htmlFor='role'
							className='block text-sm font-medium text-gray-900'
						>
							Role
						</label>
						<Select
							name='role'
							onChange={(val) => setEditUser({ ...editUser, role: val })}
							value={editUser.role}
							variant='static'
							defaultValue=''
						>
							<Option value='admin'>Admin</Option>
							<Option value='user'>User</Option>
						</Select>
					</div>
					<div className='form-group'>
						<Button fullWidth onClick={() => handleActivateUser(editUser.id)}>
							{editUser.is_active ? 'Update' : 'Activate'} User
						</Button>
					</div>
				</div>
			</Drawer>
		</React.Fragment>
	);
};

export default UserManagement;
