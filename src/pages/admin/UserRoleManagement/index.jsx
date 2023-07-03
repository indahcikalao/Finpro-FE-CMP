import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import AddRole from "./Components/addRole";
import EditRole from "./Components/editRole";
import api from "../../../api/axios";

const url = process.env.REACT_APP_BASE_URL;

const UserRoleManagement = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllRoles = async () => {
      try {
        const response = await api.get(`${url}/admin/roles`);
        setData(response.data.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    getAllRoles();
  }, []);

  const handleEdit = (updatedRole) => {
    const updatedData = data.map((item) =>
      item.id === updatedRole.id ? updatedRole : item
    );
    setData(updatedData);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Delete Role",
      text: `Are you sure you want to delete the role ${row.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`${url}/admin/role/${row.id}`);
          setData(data.filter((item) => item.id !== row.id));
          Swal.fire(
            "Deleted!",
            `The role ${row.name} has been deleted.`,
            "success"
          );
        } catch (error) {
          console.error("Error deleting role:", error);
          Swal.fire(
            "Error",
            "Failed to delete the role. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const columns = [
    {
      name: <b>Role Name</b>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <b>Monitoring</b>,
      sortable: false,
      cell: (row) => (
        <>
          <div className="mr-10">
            {row.access &&
              row.access[0] &&
              (row.access[0].can_read && row.access[0].can_write
                ? "Read | Write"
                : row.access[0].can_read
                ? "Read"
                : row.access[0].can_write
                ? "Write"
                : "")}
          </div>
        </>
      ),
    },
    {
      name: <b>Download</b>,
      sortable: false,
      cell: (row) => (
        <>
          <div className="mr-10">
            {row.access &&
              row.access[1] &&
              (row.access[1].can_read && row.access[1].can_write
                ? "Read | Write"
                : row.access[1].can_read
                ? "Read"
                : row.access[1].can_write
                ? "Write"
                : "")}
          </div>
        </>
      ),
    },
    {
      name: <b>Actions</b>,
      cell: (row) => (
        <>
          <EditRole role={row} onSave={handleEdit} />
          <Typography
            onClick={() => handleDelete(row)}
            variant="small"
            color="red"
            as="button"
            className="font-medium"
          >
            Delete
          </Typography>
        </>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="my-4 space-y-4">
        <Card className="h-full w-full">
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none"
          >
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-xl font-bold "
                >
                  Roles List
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all user roles
                </Typography>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <AddRole />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full">
                <form>
                  <Input label="Search" />
                </form>
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-scroll px-0">
            <DataTable columns={columns} data={data} pagination />
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default UserRoleManagement;
