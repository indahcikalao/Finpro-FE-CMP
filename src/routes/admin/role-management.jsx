import React from 'react';
import axios from 'axios';
import { Typography, Button, Drawer, IconButton, Input, Select, SelectOption, Card, CardBody, CardFooter } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import dummyRoles from '../../utils/dummyData';
import { CardRole } from '../../Components/Atoms';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const url = process.env.REACT_APP_BASE_URL;

const ActionsColumn = ({ row, handleEditRole }) => {
  const handleDeleteRole = async (id) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete Role',
      text: 'Are you sure want to delete this role?',
      showCancelButton: true,
    });

    if (confirm.isDismissed) {
      return;
    }

    try {
      const response = await axios.delete(`${url}/admin/roles/${id}`);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Role has been deleted!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => window.location.reload());
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Unable to delete role: ' + error?.response?.data?.message || error.message,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className='flex gap-2'>
      <Typography
        as='button'
        onClick={() => handleEditRole(row)}
        variant='small'
        color='blue'
        className='font-medium'
      >
        Edit
      </Typography>
      <Typography
        as='button'
        onClick={() => handleDeleteRole(row.id)}
        variant='small'
        color='red'
        className='font-medium'
      >
        Delete
      </Typography>
    </div>
  );
};

const UserRoleManagement = () => {
  const [data, setData] = React.useState(dummyRoles);
  const [editRole, setEditRole] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleEditRole = (row) => {
    setOpen(true);
    setEditRole(row);
  };

  const handleCloseEditRole = () => {
    setOpen(false);
    setEditRole({});
  };

  React.useEffect(() => {
    const getRoles = async () => {
      try {
        const { data: response } = await axios.get(`${url}/admin/roles`);
        setData(response.data);
      } catch (error) {
        console.log('error', error);
      }
    };

    getRoles();
  }, []);

  const handleAddRole = async () => {
    const { value: roleName } = await Swal.fire({
      title: 'Add Role',
      input: 'text',
      inputLabel: 'Role Name',
      inputPlaceholder: 'Enter the role name',
      showCancelButton: true,
    });

    if (roleName) {
      try {
        const response = await axios.post(`${url}/admin/roles`, { name: roleName });
        setData((prevData) => [...prevData, response.data]);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Role has been added!',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Unable to add role: ' + error?.response?.data?.message || error.message,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const handlePermissionChange = (permission, value) => {
    setEditRole((prevRole) => ({
      ...prevRole,
      permissions: {
        ...prevRole.permissions,
        [permission]: value,
      },
    }));
  };

  const handleUpdateRole = async () => {
    try {
      const { id, name, permissions } = editRole;
      const response = await axios.put(`${url}/admin/roles/${id}`, { name, permissions });

      setData((prevData) =>
        prevData.map((role) => (role.id === response.data.id ? response.data : role))
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Role has been updated!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Unable to update role: ' + error?.response?.data?.message || error.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      handleCloseEditRole();
    }
  };

  return (
    <React.Fragment>
      <div className='my-4 space-y-4'>
        <div className='flex flex-row gap-3'>
          <CardRole className="flex" />
          <Card>
            <CardBody>
              <div className='flex'>
                <PlusCircleIcon className='text-blue-500 w-6 h-6 mr-1' />
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Add New
                </Typography>
              </div>
              <Typography>
                Add role if it doesn't exist.
              </Typography>
            </CardBody>
            <CardFooter>
              <Button onClick={handleAddRole}>Add Role</Button>
            </CardFooter>
          </Card>
        </div>
        <DataTable
          columns={[
            {
              name: 'Role Name',
              selector: (row) => row.role,
              sortable: true,
            },
            {
              name: 'Read',
              cell: (row) => (
                <input
                  type='checkbox'
                  checked={row.permissions.read}
                  onChange={(e) => handlePermissionChange('read', e.target.checked)}
                />
              ),
              sortable: false,
              right: true,
            },
            {
              name: 'Write',
              cell: (row) => (
                <input
                  type='checkbox'
                  checked={row.permissions.write}
                  onChange={(e) => handlePermissionChange('write', e.target.checked)}
                />
              ),
              sortable: false,
              right: true,
            },
            {
              name: 'Actions',
              button: true,
              cell: (row) => <ActionsColumn row={row} handleEditRole={handleEditRole} />,
            },
          ]}
          data={data}
          pagination
        />
      </div>

      <Drawer open={open} onClose={handleCloseEditRole} className='p-4'>
        <div className='mb-6 flex items-center justify-between'>
          <Typography variant='h5' color='blue-gray'>
            Edit Role
          </Typography>
          <IconButton variant='text' color='blue-gray' onClick={handleCloseEditRole}>
            {/* <XMarkIcon strokeWidth={2} className='h-5 w-5' /> */}
          </IconButton>
        </div>
        <div className='space-y-4'>
          <div className='form-group'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-900'>
              Role Name
            </label>
            <Input
              type='text'
              name='name'
              className='pl-3'
              value={editRole.name}
              onChange={(e) =>
                setEditRole((prevRole) => ({ ...prevRole, name: e.target.value }))
              }
            />
          </div>
          <div className='form-group'>
            <label htmlFor='read-access' className='block text-sm font-medium text-gray-900'>
              Read
            </label>
            <Select
              id='read-access'
              value={editRole.permissions?.read}
              onChange={(e) =>
                handlePermissionChange('read', e.target.value === 'true')
              }
            >
              <SelectOption value='true'>Full</SelectOption>
              <SelectOption value='false'>None</SelectOption>
            </Select>
          </div>
          <div className='form-group'>
            <label htmlFor='write-access' className='block text-sm font-medium text-gray-900'>
              Write
            </label>
            <Select
              id='write-access'
              value={editRole.permissions?.write}
              onChange={(e) =>
                handlePermissionChange('write', e.target.value === 'true')
              }
            >
              <SelectOption value='true'>Full</SelectOption>
              <SelectOption value='false'>None</SelectOption>
            </Select>
          </div>
          <Button onClick={handleUpdateRole}>Update Role</Button>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default UserRoleManagement;
