import React from 'react';
import {
	Navbar as MTNavbar,
	Typography,
	IconButton,
} from '@material-tailwind/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ openSidebar, setOpenSidebar }) => {
	return (
		<MTNavbar className='mx-auto px-4 max-w-none py-2'>
			<div className='flex items-center justify-between text-blue-gray-900'>
				<Typography
					as='a'
					href='#'
					variant='h6'
					className='mr-4 cursor-pointer py-1.5 lg:ml-2'
				>
					Cash Management Platform
				</Typography>
				<IconButton
					variant='text'
					color='blue-gray'
					className='xl:hidden'
					onClick={() => setOpenSidebar(!openSidebar)}
				>
					<Bars3Icon className='h-6 w-6' strokeWidth={2} />
				</IconButton>
			</div>
		</MTNavbar>
	);
};

export default Navbar;
