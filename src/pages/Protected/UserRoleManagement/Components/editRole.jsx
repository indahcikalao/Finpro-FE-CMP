import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import api from "../../../../api/axios";

const url = process.env.REACT_APP_BASE_URL;

const EditRole = ({ role, onSave }) => {
  const [name, setName] = useState(role.name);
  const [access, setAccess] = useState([...role.access]);
  const [open, setOpen] = useState(false);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const updatedRole = {
      role: name,
      data: access,
    };

    try {
      await api.put(`${url}/admin/role/${role.id}`, updatedRole);
      onSave(updatedRole);
      Swal.fire("Success", "Role updated successfully!", "success").then(() => {
        handleClose();
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire("Error", "Failed to update role. Please try again.", "error");
    }
  };

  const renderCheckboxes = (index, canRead, canWrite) => (
    <>
      <Checkbox
        label="Read"
        ripple={true}
        checked={canRead}
        onChange={(e) =>
          handleAccessChange(index, "can_read", e.target.checked)
        }
        id={`checkbox-read-${index}`}
      />
      <Checkbox
        label="Write"
        ripple={true}
        checked={canWrite}
        onChange={(e) =>
          handleAccessChange(index, "can_write", e.target.checked)
        }
        id={`checkbox-write-${index}`}
      />
    </>
  );

  const handleAccessChange = (index, key, value) => {
    const updatedAccess = [...access];
    updatedAccess[index][key] = value;
    setAccess(updatedAccess);
  };

  return (
    <>
      <Typography
        onClick={handleOpen}
        variant="small"
        color="blue"
        as="button"
        className="font-medium mr-3"
      >
        Edit
      </Typography>
      <Dialog open={open} onClose={handleClose} size="sm">
        <DialogHeader>Edit Role</DialogHeader>
        <DialogBody>
          <div className="mb-4">
            <Input
              variant="outlined"
              label="Role Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <table className="w-full table-auto text-center">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Resource
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Access
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, index) => (
                <tr key={index}>
                  <td>{header.name}</td>
                  <td>
                    {renderCheckboxes(
                      index,
                      access[index].can_read,
                      access[index].can_write
                    )}
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
            ripple="dark"
            className="mr-1"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handleSave} ripple="dark">
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditRole;
