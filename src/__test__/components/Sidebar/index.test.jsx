import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../../Components/Mollecule';
import { BrowserRouter } from 'react-router-dom';
import { usePermission } from '../../../hooks';
import { PERMISSIONS_CONFIG } from '../../../config';

jest.mock('../../../hooks/use-permission');

describe('Render Sidebar component properly', () => {
	const setOpenSidebar = jest.fn();

	const view = () =>
		render(
			<BrowserRouter>
				<Sidebar openSidebar={false} setOpenSidebar={setOpenSidebar} />
			</BrowserRouter>
		);

	beforeEach(() => {
		usePermission.mockReturnValue({
			config: PERMISSIONS_CONFIG,
			hasPermission: jest.fn(),
			hasWritePermission: jest.fn(() => true),
			hasReadPermission: jest.fn(() => true),
		});
	});

	afterEach(cleanup);

	it('render the sidebar properly', () => {
		view();

		expect(screen.getByRole('sidebar')).toBeInTheDocument();
	});

	it('called the setOpenSidebar when clicking close button', () => {
		view();

		const btnCloseSidebar = screen.getByRole('button', {
			name: /close sidebar/i,
		});

		fireEvent.click(btnCloseSidebar);

		expect(setOpenSidebar).toHaveBeenCalledWith(false);
	});

	it('closed the sidebar when clicking outside of the sidebar', () => {
		view();

		const overlay = screen.getByTestId('overlay');

		fireEvent.click(overlay);

		expect(setOpenSidebar).toHaveBeenCalledWith(false);
	});

	it('open the accordion menu on clicked', () => {
		view();

		const usersAccordionMenu = screen.getByText(/(Users)/);

		fireEvent.click(usersAccordionMenu);

		expect(screen.getByText(/user management/i)).toBeVisible();
	});
});
