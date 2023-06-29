import React, { useState } from "react";
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
  const [monitoringRead, setMonitoringRead] = useState(role.access[0].can_read);
  const [monitoringWrite, setMonitoringWrite] = useState(role.access[0].can_write);
  const [downloadRead, setDownloadRead] = useState(role.access[1].can_read);
  const [downloadWrite, setDownloadWrite] = useState(role.access[1].can_write);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const updatedRole = {
      id: role.id,
      name,
      access: [
        { can_read: monitoringRead, can_write: monitoringWrite },
        { can_read: downloadRead, can_write: downloadWrite },
      ],
    };

    try {
      await api.put(`${url}/admin/role/${role.id}`, updatedRole);
      onSave(updatedRole);
      Swal.fire("Success", "Role updated successfully!", "success");
      handleClose();
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire("Error", "Failed to update role. Please try again.", "error");
    }
  };

  const renderCheckboxes = (index, label, checked, onChange) => (
    <Checkbox
      label={label}
      ripple={true}
      checked={checked}
      onChange={onChange}
      id={`checkbox-${index}`}
    />
  );

  const handleMonitoringReadChange = (e) => {
    setMonitoringRead(e.target.checked);
  };

  const handleMonitoringWriteChange = (e) => {
    setMonitoringWrite(e.target.checked);
  };

  const handleDownloadReadChange = (e) => {
    setDownloadRead(e.target.checked);
  };

  const handleDownloadWriteChange = (e) => {
    setDownloadWrite(e.target.checked);
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
      <Dialog open={open} handler={handleClose} size="lg">
        <DialogHeader>Edit Role</DialogHeader>
        <DialogBody>
          <table className="w-full table-auto text-center">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Role Name
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Monitoring
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Download
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <Input
                    variant="outlined"
                    label="Role Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                  />
                </td>
                <td className="p-4">
                  {renderCheckboxes(
                    0,
                    "Read",
                    monitoringRead,
                    handleMonitoringReadChange
                  )}
                  {renderCheckboxes(
                    0,
                    "Write",
                    monitoringWrite,
                    handleMonitoringWriteChange
                  )}
                </td>
                <td className="p-4">
                  {renderCheckboxes(
                    1,
                    "Read",
                    downloadRead,
                    handleDownloadReadChange
                  )}
                  {renderCheckboxes(
                    1,
                    "Write",
                    downloadWrite,
                    handleDownloadWriteChange
                  )}
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
            ripple="dark"
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
