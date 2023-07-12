import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Navbar } from '../../../Components/Mollecule';
import { useAuth } from '../../../hooks';

jest.mock('../../../hooks/use-auth');

describe('Navbar component', () => {
	const setOpenSidebar = jest.fn();

	const view = () =>
		render(<Navbar openSidebar={false} setOpenSidebar={setOpenSidebar} />);

	beforeEach(() => {
		useAuth.mockReturnValue({
			auth: {
				username: 'Rhenald',
			},
		});
	});

	afterEach(cleanup);

	it('render navbar component correctly', () => {
		view();

		expect(screen.getByText(/rhenald/i)).toBeInTheDocument();
	});

	it('can open sidebar', () => {
		view();

		const toggleSidebar = screen.getByRole('button', {
			name: /toggle sidebar/i,
		});

		fireEvent.click(toggleSidebar);

		expect(setOpenSidebar).toHaveBeenCalledWith(true);
	});
});
