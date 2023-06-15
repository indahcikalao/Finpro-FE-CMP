import React from 'react';
import clsx from 'clsx';
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
} from '@material-tailwind/react';
import {
	PresentationChartBarIcon,
	ShoppingBagIcon,
	UserCircleIcon,
	Cog6ToothIcon,
	InboxIcon,
	PowerIcon,
	XMarkIcon,
	TableCellsIcon,
} from '@heroicons/react/24/solid';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
	const [open, setOpen] = React.useState(0);

	const handleOpen = (value) => {
		setOpen(open === value ? 0 : value);
	};

	return (
		<Card
			className={clsx(
				'z-10 fixed top-4 xl:left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] xl:translate-x-0 p-4 shadow-xl shadow-blue-gray-900/5 transition-transform',
				{ '-translate-x-full left-0': !openSidebar }
			)}
		>
			<button
				className='xl:hidden w-6 absolute top-0 right-0 hover:bg-gray-100 mt-2 mr-2'
				onClick={() => setOpenSidebar(false)}
			>
				<XMarkIcon />
			</button>
			<div className='mb-2 p-4'>
				<Typography variant='h5' color='blue-gray'>
					Cash Management Platform
				</Typography>
			</div>
      {/* TODO: Render menu based on role */}
			<List>
				<Accordion
					open={open === 1}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${
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
								<PresentationChartBarIcon className='h-5 w-5' />
							</ListItemPrefix>
							<Typography color='blue-gray' className='mr-auto font-normal'>
								Dashboard
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className='py-1'>
						<List className='p-0'>
							<ListItem>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className='h-3 w-5' />
								</ListItemPrefix>
								Analytics
							</ListItem>
							<ListItem>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className='h-3 w-5' />
								</ListItemPrefix>
								Reporting
							</ListItem>
							<ListItem>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className='h-3 w-5' />
								</ListItemPrefix>
								Projects
							</ListItem>
						</List>
					</AccordionBody>
				</Accordion>
				<Accordion
					open={open === 2}
					icon={
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`mx-auto h-4 w-4 transition-transform ${
								open === 2 ? 'rotate-180' : ''
							}`}
						/>
					}
				>
					<ListItem className='p-0' selected={open === 2}>
						<AccordionHeader
							onClick={() => handleOpen(2)}
							className='border-b-0 p-3'
						>
							<ListItemPrefix>
								<ShoppingBagIcon className='h-5 w-5' />
							</ListItemPrefix>
							<Typography color='blue-gray' className='mr-auto font-normal'>
								E-Commerce
							</Typography>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className='py-1'>
						<List className='p-0'>
							<ListItem>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className='h-3 w-5' />
								</ListItemPrefix>
								Orders
							</ListItem>
							<ListItem>
								<ListItemPrefix>
									<ChevronRightIcon strokeWidth={3} className='h-3 w-5' />
								</ListItemPrefix>
								Products
							</ListItem>
						</List>
					</AccordionBody>
				</Accordion>
				<Link to="/role-management">
				<ListItem>
					<ListItemPrefix>
						<TableCellsIcon className='h-5 w-5' />
					</ListItemPrefix>
					Roles Management
					<ListItemSuffix>
						<Chip
							value='14'
							size='sm'
							variant='ghost'
							color='blue-gray'
							className='rounded-full'
						/>
					</ListItemSuffix>
				</ListItem>
					</Link>
			
				<ListItem>
					<ListItemPrefix>
						<UserCircleIcon className='h-5 w-5' />
					</ListItemPrefix>
					Profile
				</ListItem>
				<ListItem>
					<ListItemPrefix>
						<Cog6ToothIcon className='h-5 w-5' />
					</ListItemPrefix>
					Settings
				</ListItem>
				<ListItem>
					<ListItemPrefix>
						<PowerIcon className='h-5 w-5' />
					</ListItemPrefix>
					Log Out
				</ListItem>
			</List>
		</Card>
	);
};

export default Sidebar;
