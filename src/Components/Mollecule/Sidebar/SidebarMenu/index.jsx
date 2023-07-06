import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { TbPointFilled } from 'react-icons/tb';
import {
	Accordion,
	AccordionHeader,
	ListItemPrefix,
	AccordionBody,
	Typography,
	ListItem,
	List,
} from '@material-tailwind/react';
import { usePermission } from '../../../../hooks';

export const SidebarMenuItemIcon = ({ Icon = TbPointFilled }) => {
	return <Icon className='h-5 w-5 text-white' />;
};

const SidebarMenuItem = ({ menu }) => {
	const navigate = useNavigate();

	const { hasReadPermission } = usePermission();

	if (!hasReadPermission(menu.resourceName)) {
		return <></>;
	}

	return (
		<ListItem onClick={() => navigate(menu.path)}>
			<ListItemPrefix>
				<SidebarMenuItemIcon Icon={menu.icon} />
			</ListItemPrefix>
			{menu.name}
		</ListItem>
	);
};

const SidebarMultilevelMenuItem = ({ menu }) => {
	const { hasReadPermission } = usePermission();
	const [open, setOpen] = React.useState(0);

  const hasOneCanRead = menu.menus.some((menu) =>
    hasReadPermission(menu.resourceName)
  );

  if (!hasOneCanRead) {
    return <></>;
  }

	const handleOpen = (value) => {
		setOpen(open === value ? 0 : value);
	};

	return (
		<Accordion
			open={open === 1}
			icon={
				<ChevronDownIcon
					strokeWidth={2.5}
					className={`mx-auto h-4 w-4 transition-transform text-white ${
						open === 1 ? 'rotate-180' : ''
					}`}
				/>
			}
		>
			<ListItem className='p-0' selected={open === 1}>
				<AccordionHeader
					onClick={() => handleOpen(1)}
					className='border-b-0 p-3'
				>
					<ListItemPrefix>
						<SidebarMenuItemIcon Icon={menu.icon} />
					</ListItemPrefix>
					<Typography color='white' className='mr-auto font-normal'>
						{menu.name}
					</Typography>
				</AccordionHeader>
			</ListItem>
			<AccordionBody className='py-1'>
				<List className='p-0 text-white'>
					{menu.menus.map((menu) => (
						<SidebarMenuItem key={menu.name} menu={menu} />
					))}
				</List>
			</AccordionBody>
		</Accordion>
	);
};

export const SidebarMenu = ({ menu }) => {
	if (menu.hasOwnProperty('menus')) {
		return <SidebarMultilevelMenuItem menu={menu} />;
	}

	return <SidebarMenuItem menu={menu} />;
};
