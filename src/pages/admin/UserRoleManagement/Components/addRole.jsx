import React, { Fragment, useEffect, useState } from "react";
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

const role_table_head = ["Resource", "Access"];

const AddRole = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleData, setNewRoleData] = useState([]);
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Tambahkan state untuk menandai perubahan pada form

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await api.get(`${url}/admin/accesses`);
        const roles = response.data.data;

        const mappedRoleData = roles.map((role) => ({
          resource: role.name,
          can_read: false,
          can_write: false,
        }));

        setNewRoleData(mappedRoleData);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchRoleData();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    if (hasChanges) { // Reset nilai form hanya ketika ada perubahan yang dilakukan
      setNewRoleName("");
      setNewRoleData([]);
    }
  };

  const handleRoleNameChange = (e) => {
    setNewRoleName(e.target.value);
    setHasChanges(true); // Set hasChanges menjadi true ketika ada perubahan pada form
  };

  const addRole = async () => {
    try {
      if (!newRoleName) {
        Swal.fire("Error", "Please enter a role name.", "error");
        return;
      }

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
    setHasChanges(true); // Set hasChanges menjadi true ketika ada perubahan pada form
  };

  const handleCanWriteChange = (index,checked) => {
    const updatedData = [...newRoleData];
    updatedData[index].can_write = checked;
    setNewRoleData(updatedData);
    setHasChanges(true); // Set hasChanges menjadi true ketika ada perubahan pada form
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
      <Dialog open={open} handler={handleClose} size="sm">
        <DialogHeader>Add New Role</DialogHeader>
        <DialogBody>
          <div className="mb-5">
            <Input
              variant="outlined"
              label="Role Name"
              type="text"
              value={newRoleName}
              onChange={handleRoleNameChange}
              className="mb-4"
            />
          </div>
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
              {newRoleData.map((data, index) => (
                <tr key={index}>
                  <td>{data.resource}</td>
                  <td>
                    <div>
                      {renderCheckboxes(
                        index,
                        "Read",
                        data.can_read,
                        (e) => handleCanReadChange(index, e.target.checked)
                      )}
                      {renderCheckboxes(
                        index,
                        "Write",
                        data.can_write,
                        (e) => handleCanWriteChange(index, e.target.checked)
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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

export default AddRole;
