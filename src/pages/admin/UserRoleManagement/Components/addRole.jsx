import React, { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import api from "../../../../api/axios";

const url = process.env.REACT_APP_BASE_URL;

const role_table_head = ["Role name", "Monitoring VA", "Download VA"];

const AddRoleManagement = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleData, setNewRoleData] = useState([
    {
      resource: "Monitoring",
      can_read: false,
      can_write: false,
    },
    {
      resource: "Download",
      can_read: false,
      can_write: false,
    },
  ]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRoleName("");
    setNewRoleData([
      {
        resource: "Monitoring",
        can_read: false,
        can_write: false,
      },
      {
        resource: "Download",
        can_read: false,
        can_write: false,
      },
    ]);
  };

  const handleRoleNameChange = (e) => {
    setNewRoleName(e.target.value);
  };

  const addRole = async () => {
    try {
      const roleData = {
        role: newRoleName,
        data: newRoleData,
      };

      const response = await api.post(`${url}/admin/role`, roleData);

      console.log("Role created:", response.data);
      Swal.fire("Success", "Role created successfully!", "success").then(() => {
        window.location.reload();
      });

      handleClose();
    } catch (error) {
      console.error("Error creating role:", error);

      Swal.fire("Error", "Failed to create role.", "error");
    }
  };

  const renderCheckboxes = (index, label, checked, onChange) => (
    <Checkbox
      id={`ripple-on-${label.toLowerCase()}-${index}`}
      label={label}
      ripple={true}
      checked={checked}
      onChange={onChange}
    />
  );

  const handleCanReadChange = (index, checked) => {
    const updatedData = [...newRoleData];
    updatedData[index].can_read = checked;
    setNewRoleData(updatedData);
  };

  const handleCanWriteChange = (index, checked) => {
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
      <Dialog open={open} handler={handleClose} size="lg">
        <DialogHeader>Add New Role</DialogHeader>
        <DialogBody>
          <table className="w-full table-auto text-center">
            <thead>
              <tr>
                {role_table_head.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <Input
                    variant="outlined"
                    label="Role Name"
                    type="text"
                    value={newRoleName}
                    onChange={handleRoleNameChange}
                    className="mb-4"
                  />
                </td>
                <td className="p-4">
                  <div>
                    {renderCheckboxes(
                      0,
                      "Read",
                      newRoleData[0].can_read,
                      (e) => handleCanReadChange(0, e.target.checked)
                    )}
                    {renderCheckboxes(
                      0,
                      "Write",
                      newRoleData[0].can_write,
                      (e) => handleCanWriteChange(0, e.target.checked)
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    {renderCheckboxes(
                      1,
                      "Read",
                      newRoleData[1].can_read,
                      (e) => handleCanReadChange(1, e.target.checked)
                    )}
                    {renderCheckboxes(
                      1,
                      "Write",
                      newRoleData[1].can_write,
                      (e) => handleCanWriteChange(1, e.target.checked)
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={addRole}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
};

export default AddRoleManagement;
