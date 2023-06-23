import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  UserIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const [open, setOpen] = React.useState(0);
  const navigate = useNavigate();

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Card
      className={clsx(
        "bg-blue-gray-900 z-10 fixed top-4 xl:left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] xl:translate-x-0 p-4 shadow-xl shadow-blue-gray-900/5 transition-transform",
        { "-translate-x-full left-0": !openSidebar }
      )}
    >
      <button
        className="xl:hidden w-6 absolute top-0 right-0 hover:bg-gray-100 mt-2 mr-2"
        onClick={() => setOpenSidebar(false)}
      >
        <XMarkIcon />
      </button>
      <div className="flex items-center gap-4 py-6 px-8">
        <img src="/logo-bri.png" alt="ini gambar" className="w-16 rounded-lg" />
        <Typography variant="h5" color="white">
          Final Project Web TRB 2023
        </Typography>
      </div>
      {/* TODO: Render menu based on role */}
      <List className="text-white">
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3 text-white"
            >
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="white" className="mr-auto font-normal">
                Dashboard
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0 text-white">
              <ListItem onClick={() => navigate('/user-management')}>
                <ListItemPrefix>
                  <UserIcon strokeWidth={3} className="h-4 w-5" />
                </ListItemPrefix>
                User Management
              </ListItem>
              <ListItem onClick={() => navigate('/role-management')}>
                <ListItemPrefix>
                  <LockClosedIcon strokeWidth={3} className="h-4 w-5" />
                </ListItemPrefix>
                Role Management
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <CurrencyDollarIcon strokeWidth={2} className="h-5 w-5" />
                </ListItemPrefix>
                Monitoring VA Satker
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <DocumentArrowDownIcon strokeWidth={3} className="h-4 w-5" />
                </ListItemPrefix>
                Download VA Satker
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="white"
              className="rounded-full text-white"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
        <ListItem onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
};

export default Sidebar;
