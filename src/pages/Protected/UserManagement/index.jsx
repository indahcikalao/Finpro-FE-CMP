import React from "react";
import DataTable from "react-data-table-component";
import {
  Typography,
  Button,
  Drawer,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import { Badge, SearchableSelect, Spinner } from "../../../Components/Atoms";
import api from "../../../api/axios";
import { usePermission } from "../../../hooks";
import { PERMISSIONS_CONFIG } from "../../../config";
import { withReadPermission } from "../../../utils/hoc";

const initialColumn = [
  {
    id: 'fullname',
    name: "Fullname",
    selector: (row) => row.fullname,
    sortable: true,
  },
  {
    id: 'username',
    name: "Username",
    selector: (row) => row.username,
    sortable: true,
  },
  {
    id: 'email',
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    id: 'status',
    name: "Status",
    selector: (row) => row.is_active,
    cell: (row) =>
      row.is_active ? (
        <Badge type="success">Active</Badge>
      ) : (
        <Badge type="danger">Inactive</Badge>
      ),
    sortable: true,
  },
  {
    id: 'role',
    name: "Role",
    selector: (row) => row.role || "-",
    sortable: true,
    style: {
      textTransform: 'capitalize',
    }
  },
]

const SEARCH_FILTER = {
  email: 'email',
  username: 'username',
}

const ActionsColumn = ({ row, handleEditUser, handleDeleteUser }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleEditUser(row)}
        color="blue"
        className="font-medium whitespace-nowrap"
      >
        {row.is_active ? "Edit" : "Activate"}
      </Button>
      <Button
        onClick={() => handleDeleteUser(row.id)}
        color="red"
        className="font-medium whitespace-nowrap"
      >
        Delete
      </Button>
    </div>
  );
};

export const UserManagement = () => {
  const { config, hasWritePermission } = usePermission();

  const [data, setData] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [searchFilter, setSearchFilter] = React.useState(SEARCH_FILTER.username);
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const [editUser, setEditUser] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState({});
  const [query, setQuery] = React.useState('');

  const [open, setOpen] = React.useState(false);

  const [totalRows, setTotalRows] = React.useState(0);
	const [perPage, setPerPage] = React.useState(10);
  const [resetDefaultPage, setResetDefaultPage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const columns = hasWritePermission(config.resources.user) ? [
    ...initialColumn,
    {
      id: 'actions',
      name: "Actions",
      button: true,
      width: '240px',
      cell: (row) => (
        <ActionsColumn
          row={row}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
        />
      ),
    },
  ] : initialColumn;

  const handleEditUser = (row) => {
    setOpen(true);
    document.body.style.overflow = "hidden";
    setEditUser(row);
    setSelectedRole(roles.find(role => role.id === row.role_id));
  };

  const handleCloseEditUser = () => {
    setOpen(false);
    document.body.style.overflow = "unset";
    setEditUser({});
    setSelectedRole(null)
    setFormError('');
  };

  const fetchUsers = async ({ page = 1, limit = perPage, resetDefaultPage = false }) => {
    setLoading(true);
    setResetDefaultPage(resetDefaultPage);

    try {
      const { data: response } = await api.get("/admin/users", {
        params: {
          Page: page,
          Limit: limit
        }
      });

      setData(response.data);
      setTotalRows(response.total);
      setPerPage(limit);
      setResetDefaultPage(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchSearchUsers = async ({ page = 1, limit = perPage, resetDefaultPage = false }) => {
    if (searchKeyword === '') {
      await fetchUsers({
        resetDefaultPage: true,
      });
      return;
    }

    setLoading(true);
    setResetDefaultPage(resetDefaultPage);

    switch (searchFilter) {
      case SEARCH_FILTER.email:
        try {
          const { data: response } = await api.get('/admin/users/get-by-email', {
            params: {
              Page: page,
              Limit: limit,
              Email: searchKeyword,
            },
          });

          setData(response.data);
          setTotalRows(response.total);
          setPerPage(limit);
          setResetDefaultPage(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text:
              "Unable to search user: " + error?.response?.data?.message ||
              error.message,
            timer: 1500,
            showConfirmButton: false,
          });
        } finally {
          setLoading(false);
        }
        break;
      case SEARCH_FILTER.username:
        try {
          const { data: response } = await api.get('/admin/users/get-by-username', {
            params: {
              Page: page,
              Limit: limit,
              Username: searchKeyword,
            },
          });

          setData(response.data);
          setTotalRows(response.total);
          setPerPage(limit);
          setResetDefaultPage(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text:
              "Unable to search user: " + error?.response?.data?.message ||
              error.message,
            timer: 1500,
            showConfirmButton: false,
          });
        } finally {
          setLoading(false);
        }
        break;
      default:
        break;
    }
  }

  const handleSearchUsers = (e) => {
    e.preventDefault();

    fetchSearchUsers({ resetDefaultPage: true });
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    if (searchKeyword) {
      await fetchSearchUsers({ page, limit: newPerPage});
    } else {
      await fetchUsers({ page, limit: newPerPage });
    }
  };

  const handlePageChange = async (page) => {
    if (searchKeyword) {
      await fetchSearchUsers({ page });
    } else {
      await fetchUsers({ page });
    }
  };

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        await fetchUsers({});
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    const getAllRoles = async () => {
      try {
        const { data: response } = await api.get('/admin/roles', {
          params: {
            Limit: 1000,
          }
        });

        setRoles(response.data);
      } catch (err) {
        console.log('Error fetching all roles:', err)
      }
    }

    getUsers();
    getAllRoles();
  }, []);

  React.useEffect(() => {
    if (formError !== '' && selectedRole) {
      setFormError('');
    }

    setEditUser({
      ...editUser,
      role_id: selectedRole?.id,
      role: selectedRole?.name,
    })
  }, [selectedRole]);

  const handleUpdateUser = async (id) => {
    try {
      if (!editUser.role_id) {
        setFormError("Role can't be empty!");
        return;
      }

      const data = {
        id: editUser.role_id,
      };

      if (!editUser.is_active) {
        await api.patch(`/admin/active/${id}`);
      }

      await api.put(`/admin/user/role/${id}`, data);

      handleCloseEditUser();

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "User account successfully updated!",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          "Unable to activate user: " + error?.response?.data?.message ||
          error.message,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete User",
      text: "Are you sure want to delete this user?",
      showCancelButton: true,
    });

    if (confirm.isDismissed) {
      return;
    }

    try {
      const response = await api.delete(`/admin/user/${id}`);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "User has been deleted!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => window.location.reload());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          "Unable to delete user: " + error?.response?.data?.message ||
          error.message,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <React.Fragment>
      <div className="m-4 space-y-4">
        <header>
          <Typography variant="h5" color="blue-gray">
            User Management
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Activate user and assign/update user's role
          </Typography>
        </header>
        <form onSubmit={handleSearchUsers} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex w-full grow">
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  ripple={false}
                  variant="text"
                  color="blue-gray"
                  className="flex h-10 items-center justify-between gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3 min-w-[122px]"
                >
                  {searchFilter}
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className="h-3.5 w-3.5 transition-transform"
                  />
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => setSearchFilter(SEARCH_FILTER.email)}>
                  <span>Email</span>
                </MenuItem>
                <MenuItem onClick={() => setSearchFilter(SEARCH_FILTER.username)}>
                  <span>Username</span>
                </MenuItem>
              </MenuList>
            </Menu>
            <Input
              type="text"
              placeholder="Find user..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-blue-500"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "!min-w-0",
              }}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <div className="border-2">
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            progressComponent={<Spinner message="Please wait for a moment..." size="lg" />}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            fixedHeader
            defaultSortAsc={true}
            paginationResetDefaultPage={resetDefaultPage}
            defaultSortFieldId='status'
          />
        </div>
      </div>
      <Drawer
        overlayProps={{ className: "fixed" }}
        open={open}
        onClose={handleCloseEditUser}
        className="p-4"
        data-testid="drawer"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            {editUser.is_active ? "Edit" : "Activate"} User
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleCloseEditUser}
            title="Close drawer"
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="space-y-4">
          <div className="form-group">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-900"
            >
              Fullname
            </label>
            <Input
              type="text"
              name="fullname"
              className="pl-3"
              placeholder={editUser.fullname}
              variant="static"
              disabled
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              className="pl-3"
              placeholder={editUser.email}
              variant="static"
              disabled
            />
          </div>
          <div className="form-group">
            <SearchableSelect
              selected={selectedRole}
              setSelected={setSelectedRole}
              data={roles}
              query={query}
              setQuery={setQuery}
              label='Role'
              filterProperty='name'
            />
            {formError !== '' && (
              <Typography
                variant='paragraph'
                className='text-sm text-red-400 mt-2'
              >
                {formError}
              </Typography>
            )}
          </div>
          <div className="form-group">
            <Button
              fullWidth
              onClick={() => handleUpdateUser(editUser.id)}
              className="mt-8"
            >
              {editUser.is_active ? "Update" : "Activate"} User
            </Button>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default withReadPermission(
  UserManagement,
  PERMISSIONS_CONFIG.resources.user
);
