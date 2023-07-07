import React from "react";
import clsx from "clsx";
import {
  Card,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
} from "@material-tailwind/react";
import {
	PowerIcon,
	XMarkIcon,
	HomeIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../hooks";
import { SidebarMenu, SidebarMenuItemIcon } from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import { PERMISSIONS_CONFIG } from "../../../config";

const menuList = [
  {
		name: 'Users',
		icon: UserIcon,
		menus: [
			{
        name: 'User Management',
        path: '/user-management',
        resourceName: PERMISSIONS_CONFIG.resources.user
      },
			{
        name: 'Role Management',
        path: '/role-management',
        resourceName: PERMISSIONS_CONFIG.resources.role
      },
		],
	},
	{
		name: 'Satker',
		icon: CurrencyDollarIcon,
		menus: [
			{
        name: 'Monitoring VA Satker',
        path: '/monitoring-va',
        resourceName: PERMISSIONS_CONFIG.resources.monitoring
      },
			{
        name: 'Download VA Satker',
        path: '/download-va',
        resourceName: PERMISSIONS_CONFIG.resources.download
      },
		],
	},
];

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const [open, setOpen] = React.useState(null);

	const handleOpen = (index) => {
		setOpen(open === index ? null : index);
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
			<List className="text-white overflow-auto">
				<ListItem onClick={() => navigate('/')}>
					<ListItemPrefix>
						<SidebarMenuItemIcon Icon={HomeIcon} />
					</ListItemPrefix>
					Home
				</ListItem>
				{menuList.map((menu, idx) => (
					<SidebarMenu
            key={menu.name}
            menu={menu}
            handleOpen={handleOpen}
            open={open}
            index={idx}
          />
				))}
				<ListItem onClick={logout}>
					<ListItemPrefix>
						<SidebarMenuItemIcon Icon={PowerIcon} />
					</ListItemPrefix>
					Log Out
				</ListItem>
			</List>
		</Card>
	);
};

export default Sidebar;
