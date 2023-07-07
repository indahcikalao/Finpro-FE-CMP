import React from "react";
import DataTable from "react-data-table-component";
import {
  Typography,
  Button,
  Drawer,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { NoSymbolIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import { Badge, SearchableSelect, Spinner } from "../../../Components/Atoms";
import api from "../../../api/axios";
import { usePermission } from "../../../hooks";
import { PERMISSIONS_CONFIG } from "../../../config";
import { withReadPermission } from "../../../utils/hoc/with-read-permission";

const ActionsColumn = ({ row, handleEditUser, handleDeleteUser }) => {
  return (
    <div className="flex gap-2">
      <Typography
        as="button"
        onClick={() => handleEditUser(row)}
        variant="small"
        color="blue"
        className="font-medium"
      >
        {row.is_active ? "Edit" : "Activate"}
      </Typography>
      <Typography
        as="button"
        onClick={() => handleDeleteUser(row.id)}
        variant="small"
        color="red"
        className="font-medium"
      >
        Delete
      </Typography>
    </div>
  );
};

export const UserManagement = () => {
  const { config, hasWritePermission } = usePermission();

  const [data, setData] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [editUser, setEditUser] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState({});
  const [query, setQuery] = React.useState('');

  const [open, setOpen] = React.useState(false);

  const [totalRows, setTotalRows] = React.useState(0);
	const [perPage, setPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

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
  };

  const fetchUsers = async (page = 1, limit = perPage) => {
    setLoading(true);

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
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  const handlePerRowsChange = async (newPerPage, page) => await fetchUsers(page, newPerPage);

  const handlePageChange = async (page) => await fetchUsers(page);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    const getAllRoles = async () => {
      try {
        const { data: response } = await api.get('/admin/roles');

        setRoles(response.data);
      } catch (err) {
        console.log('Error fetching all roles:', err)
      }
    }

    getUsers();
    getAllRoles();
  }, []);

  React.useEffect(() => {
    setEditUser({
      ...editUser,
      role_id: selectedRole?.id,
      role: selectedRole?.name,
    })
  }, [selectedRole]);

  const handleUpdateUser = async (id) => {
    try {
      if (!editUser.role_id) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Role can't be empty!",
          timer: 1500,
          showConfirmButton: false,
        });
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
      <div className="my-4 mx-4">
        <Typography variant="h5" color="blue-gray">
          User Management
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Activate user and assign/update user's role
        </Typography>
        <DataTable
          columns={[
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
              selector: (row) => row.role,
              sortable: true,
              style: {
                textTransform: 'capitalize',
              }
            },
            {
              id: 'actions',
              name: "Actions",
              button: true,
              cell: (row) => (
                hasWritePermission(config.resources.user) ? (
                  <ActionsColumn
                    row={row}
                    handleEditUser={handleEditUser}
                    handleDeleteUser={handleDeleteUser}
                  />
                ) : (
                  <p className="text-red-400 flex whitespace-nowrap">
                    <NoSymbolIcon width={16} /> Forbidden
                  </p>
                )
              ),
            },
          ]}
          data={data}
          progressPending={loading}
          progressComponent={<Spinner message="Please wait for a moment..." size="lg" />}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          defaultSortAsc={true}
          defaultSortFieldId='status'
        />
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
          </div>
          <div className="form-group">
            <Button
              fullWidth
              onClick={() => handleUpdateUser(editUser.id)}
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
