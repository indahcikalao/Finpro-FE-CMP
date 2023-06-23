import React, { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";

const url = process.env.REACT_APP_BASE_URL;

const AddRoleManagement = () => {
  const [data, setData] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleData, setNewRoleData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRoleName("");
    setNewRoleData([]);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`${url}/admin/role`, {
        name: newRoleName,
        data: newRoleData,
      });

      // Lakukan tindakan setelah peran berhasil dibuat, misalnya memperbarui tampilan atau mengambil data terbaru
      console.log("Role created:", response.data);
      Swal.fire("Success", "Role created successfully!", "success");

      handleClose();
    } catch (error) {
      console.error("Error creating role:", error);

      Swal.fire("Error", "Failed to create role.", "error");
    }
  };


  const handleAddRow = () => {
    setNewRoleData([...newRoleData, { resource: "", can_read: false, can_write: false }]);
  };

  const handleDeleteRow = (index) => {
    const updatedData = [...newRoleData];
    updatedData.splice(index, 1);
    setNewRoleData(updatedData);
  };

  const handleResourceChange = (index, value) => {
    const updatedData = [...newRoleData];
    updatedData[index].resource = value;
    setNewRoleData(updatedData);
  };

  const handleReadChange = (index, checked) => {
    const updatedData = [...newRoleData];
    updatedData[index].can_read = checked;
    setNewRoleData(updatedData);
  };

  const handleWriteChange = (index, checked) => {
    const updatedData = [...newRoleData];
    updatedData[index].can_write = checked;
    setNewRoleData(updatedData);
  };

  return (
    <Fragment>
      <Button
        onClick={handleOpen}
        className="flex items-center gap-3"
        color="blue"
        size="sm"
      >
        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Role
      </Button>
      <Dialog open={open} handler={handleClose}>
        <DialogHeader>Add New Role</DialogHeader>
        <DialogBody>
          <Input
            label="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <DataTable
            columns={[
              {
                name: "Role",
                cell: (row) => (
                  <Input className="px-3"
                    value={row.role}
                    onChange={(e) => handleResourceChange(row.index, e.target.value)}
                  />
                ),
              },
              {
                name: "Read",
                cell: (row) => (
                  <Checkbox
                    checked={row.can_read}
                    onChange={(e) => handleReadChange(row.index, e.target.checked)}
                  />
                ),
              },
              {
                name: "Write",
                cell: (row) => (
                  <Checkbox
                    checked={row.can_write}
                    onChange={(e) => handleWriteChange(row.index, e.target.checked)}
                  />
                ),
              },
              {
                name: "Actions",
                cell: (row) => (
                  <Button variant="outlined" color="red" onClick={() => handleDeleteRow(row.index)}>
                    Delete
                  </Button>
                ),
              },
            ]}
            data={newRoleData}
          />
          <Button className="ml-4" onClick={handleAddRow}>Add Row</Button>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose} className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
};

export default AddRoleManagement;
