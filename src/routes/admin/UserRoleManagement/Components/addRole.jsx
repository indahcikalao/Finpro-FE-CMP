import { Fragment, useState } from "react";
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



export default function AddRole() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

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
      <setNewRole />
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add New Role</DialogHeader>
        <div>
          <setNewRole />
        </div>
        <DialogBody divider>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2">Role</th>
                <th className="py-2">Read</th>
                <th className="py-2">Write</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <div className="w-72">
                  <Input label="Role name" />
                </div>
                <td className="py-2">
                  <Checkbox />
                </td>
                <td className="py-2">
                  <Checkbox />
                </td>
              </tr>
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}
