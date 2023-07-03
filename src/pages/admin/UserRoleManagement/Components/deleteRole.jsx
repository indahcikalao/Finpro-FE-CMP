import React from "react";
import Swal from "sweetalert2";
import api from "../../../../api/axios";
import { Typography } from "@material-tailwind/react";

const url = process.env.REACT_APP_BASE_URL;

const DeleteRole = ({ role, onDelete }) => {
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Role",
      text: `Are you sure you want to delete the role ${role.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`${url}/admin/role/${role.id}`);
          onDelete(role);
          Swal.fire(
            "Deleted!",
            `The role ${role.name} has been deleted.`,
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

  return (
    <Typography
      onClick={handleDelete}
      variant="small"
      color="red"
      as="button"
      className="font-medium"
    >
      Delete
    </Typography>
  );
};

export default DeleteRole;
