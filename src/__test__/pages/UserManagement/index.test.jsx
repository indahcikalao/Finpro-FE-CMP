import { render, screen, cleanup } from '@testing-library/react';
import UserManagement from '../../../pages/admin/UserManagement';

describe('User Management Page', () => {
	const view = () => render(<UserManagement />);

	afterEach(cleanup);

	it('has correct section title', () => {
    view();

		const sectionTitle = screen.getByText(/user management/i);

		expect(sectionTitle).toBeInTheDocument();
	});

	it('rendered hidden drawer component properly', () => {
    view();

		const drawer = screen.getByTestId('drawer');
		const btnSubmit = screen.getByText(/(activate|update) user/i, {
			selector: 'button',
		});

		expect(drawer).toBeInTheDocument();
		expect(btnSubmit).toBeInTheDocument();
		expect(drawer).not.toHaveStyle('transform: none');
	});

	it('rendered datatable component', () => {
    view();

		const table = screen.getByRole('table');

		expect(table).toBeInTheDocument();
	});

	it('rendered no records on the table initially', () => {
    view();

		const noRecords = screen.getByText(/there are no records to display/i);

		expect(noRecords).toBeInTheDocument();
	});
});
