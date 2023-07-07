import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Sidebar, Navbar, Footer } from '../../Mollecule/';

const Dashboard = () => {
	const [openSidebar, setOpenSidebar] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpenSidebar(false);
  }, [location.pathname])

	return (
		<div className='min-h-screen'>
			<Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
			<div className='p-4 xl:ml-[21rem] flex flex-col min-h-screen'>
				<Navbar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
				<main className='grow'>
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default Dashboard;
