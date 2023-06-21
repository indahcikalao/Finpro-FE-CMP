import React from 'react';
import axios from 'axios';
import { Typography,
         Button,
         Drawer, 
         IconButton,
         Input,
         Select,
         SelectOption, 
         Card, 
         CardBody, 
         CardFooter, 
         CardHeader, 
         Tabs, 
         TabsHeader, 
         Tab, 
         Avatar,
         Tooltip,
         Dialog,
         DialogHeader,
         DialogBody 
} from '@material-tailwind/react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { UserRoles, TabsUser, TableHead } from '../../../utils/dummyData';
import { PencilIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AddRole from './addRole';


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
  const [data, setData] = React.useState();
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
  // Function Dialog for Edit Role
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const handleDialogOpen = () =>setDialogOpen(!dialogOpen);

  // Function for search
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search value:", searchValue);
    setSearchValue("");
  };

  return (
    <React.Fragment>
      <div className='my-4 space-y-4'>
        {/* <AddRole /> */}
        <Card className='h-full w-full'>
          <CardHeader floated={false} shadow={false} className='rounded-none'>
            <div className='mb-8 flex items-center justify-between gap-8'>            
              <div>
                <Typography variant='h5' color='blue-gray"' className='mb-2 text-xl font-bold '>
                  Roles List
                </Typography>
                <Typography color='gray' className='mt-1 font-normal'>
                  See information about all user roles
                </Typography>
              </div>

              <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
                <Button variant='outlined' color='blue-gray' size='sm'>
                  View All
                </Button>
                <AddRole />
              </div>             
            </div>

            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <Tabs value='all' className='w-full md:w-max'>
                <TabsHeader>
                  {TabsUser.map(({ label, value }) => (
                    <Tab key={value} value={value}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
                <form onSubmit={handleSearchSubmit}>
                    <Input 
                      label="Search" 
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </form>
              </div>
            </div>
          </CardHeader>

          <CardBody className='overflow-scroll px-0'>
            <table className='mt-4 w-full min-w-max table-auto text-left'>
              <thead>
                <tr>
                  {TableHead.map((head, index) => (
                    <th key={head} className='cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50'>
                      <Typography variant='small' color='blue-gray' className='flex items-center justify-between gap-2 font-normal leading-none opacity-70'>
                        {head}{" "}
                        {index !== TableHead.length - 1 && (
                          <ChevronUpDownIcon strokeWidth={2} className='h-4 w-4' />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {UserRoles.map(({ id, img, userName, email, role, permissions }, index) => {
                  const isLast = index === UserRoles.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={userName} size="sm" />
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {userName}
                            </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {role}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {permissions.write ? "Read | Write" : permissions.read ? "Read" : "No Access"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton onClick={handleOpen} variant="text" color="blue-gray">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  )})}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Page 1 of 10
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" color="blue-gray" size="sm">
                Previous
              </Button>
              <Button variant="outlined" color="blue-gray" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Dialog open={dialogOpen} handler={handleDialogOpen}>
          <DialogHeader>Its a simple dialog.</DialogHeader>
        </Dialog>

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
