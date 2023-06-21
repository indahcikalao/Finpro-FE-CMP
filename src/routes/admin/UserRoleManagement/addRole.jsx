import { Fragment, useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import setNewRole from './setNewRole';

export default function AddRole() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <Fragment>
      <Button onClick={handleOpen} className='flex items-center gap-3' color='blue' size='sm'>
        <UserPlusIcon strokeWidth={2} className='h-4 w-4'/> Add Role
      </Button>
      <setNewRole />
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add New Role</DialogHeader>
        <h3 className='ml-4'>Set a new role</h3>
        <DialogBody divider>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
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
