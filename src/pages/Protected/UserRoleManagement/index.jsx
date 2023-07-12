import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import api from "../../../api/axios";
import AddRole from "./Components/addRole";
import EditRole from "./Components/editRole";
import DeleteRole from "./Components/deleteRole";
import { withReadPermission } from "../../../utils/hoc";
import { PERMISSIONS_CONFIG } from "../../../config";
import { usePermission } from "../../../hooks";
import { Spinner } from "../../../Components/Atoms";

const url = process.env.REACT_APP_BASE_URL;

export const UserRoleManagement = () => {
  const { config, hasWritePermission } = usePermission();
  const resourceRole = config.resources.role;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [headers, setHeaders] = useState([]);

  const fetchData = async (page = 1, limit = perPage) => {
    try {
      setLoading(true);
      const response = await api.get(`${url}/admin/roles`, {
        params: {
          Page: page,
          Limit: limit,
        },
      });
      setData(response.data.data);
      setFilteredData(response.data.data);
      setPerPage(limit);
      setTotalRows(response.data.total);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();

    const fetchHeaders = async () => {
      try {
        const response = await api.get(`${url}/admin/accesses`);
        setHeaders(response.data.data);
      } catch (error) {
        console.error("Error fetching headers:", error);
      }
    };

    fetchHeaders();
  }, []);

  const handleEdit = (updatedRole) => {
    const updatedData = data.map((item) =>
      item.id === updatedRole.id ? updatedRole : item
    );
    setData(updatedData);
  };

  const handleDelete = (role) => {
    setData(data.filter((item) => item.id !== role.id));
  };

  const columns = [
    {
      name: <b>Role Name</b>,
      selector: (row) => row.name,
      sortable: true,
    },
    ...headers.map((header) => ({
      name: <b>{header.name}</b>,
      sortable: false,
      cell: (row) => (
        <>
          <div className="mr-10">
            {row.access &&
              row.access.find((access) => access.resource === header.name) &&
              (row.access.find((access) => access.resource === header.name)
                .can_read &&
              row.access.find((access) => access.resource === header.name)
                .can_write
                ? "Read | Write"
                : row.access.find((access) => access.resource === header.name)
                    .can_read
                ? "Read"
                : row.access.find((access) => access.resource === header.name)
                    .can_write
                ? "Write"
                : "")}
          </div>
        </>
      ),
    })),
  ];

  if (hasWritePermission(resourceRole)) {
    columns.push({
      name: <b>Actions</b>,
      cell: (row) => (
        <>
          <EditRole role={row} onSave={handleEdit} />
          <DeleteRole role={row} onDelete={handleDelete} />
        </>
      ),
    });
  }

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    const filteredResults = data.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    setFilteredData(filteredResults);
  };

  const handlePageChange = async (page) => {
    await fetchData(page);
  };

  const handlePerPageChange = async (newPerPage, page) => {
    await fetchData(page, newPerPage)
  };

  return (
    <React.Fragment>
      <div className="my-4 space-y-4">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-2 text-xl font-bold"
                >
                  Roles List
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all user roles
                </Typography>
              </div>

              {hasWritePermission(resourceRole) && (
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <AddRole />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full">
                <form>
                  <Input label="Search" onChange={handleSearch} />
                </form>
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-scroll px-0">
              <DataTable
                columns={columns}
                data={filteredData}
                progressComponent={<Spinner message="Please wait for a moment..." size="lg" />}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerPageChange}
              />
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withReadPermission(
  UserRoleManagement,
  PERMISSIONS_CONFIG.resources.role
);
