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

const Navbar = ({ openSidebar, setOpenSidebar }) => {
  return (
    <MTNavbar className="mx-auto px-4 max-w-none py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          Cash Management Platform
        </Typography>
        <div className="relative flex w-full gap-2 md:w-max">
          <Input
            type="search"
            color="white"
            label="Type here..."
            className="pr-20"
            containerProps={{
              className: "min-w-[288px]",
            }}
          />
          <Button
            size="sm"
            color="white"
            className="!absolute right-1 top-1 rounded"
          >
            Search
          </Button>
        </div>
        <div className="flex gap-3">
          <Typography variant="paragraph" className="cursor-pointer py-1.5 lg:ml-2">
            Hai, Admin
          </Typography>
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
          </IconButton>
        </div>
      </div>
    </MTNavbar>
  );
};

export default Navbar;
