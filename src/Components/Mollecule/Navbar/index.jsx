import React from "react";
import {
  Navbar as MTNavbar,
  Typography,
  IconButton,
  Input,
  Button,
  Avatar,
} from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../hooks";

const Navbar = ({ openSidebar, setOpenSidebar }) => {
  const { auth } = useAuth();

  return (
    <MTNavbar className="mx-auto px-4 max-w-none py-2">
      <div className="flex items-center gap-4 justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2 hidden lg:inline"
        >
          Cash Management Platform
        </Typography>
        <div className="flex gap-3 justify-between sm:justify-end w-full lg:w-auto">
          <Typography
            variant="paragraph"
            className="cursor-pointer py-1.5 lg:ml-2"
          >
            Hai, <span className="font-semibold">{auth.username}</span>!
          </Typography>
          <div>
            <Avatar
              variant="circular"
              size="sm"
              alt="candice wu"
              className="border border-blue-500 p-0.5"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            />
            <IconButton
              variant="text"
              color="blue-gray"
              className="xl:hidden"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              <div className="sr-only">Toggle sidebar</div>
            </IconButton>
          </div>
        </div>
      </div>
    </MTNavbar>
  );
};

export default Navbar;
