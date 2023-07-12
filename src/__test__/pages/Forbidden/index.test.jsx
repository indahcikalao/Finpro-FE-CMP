import { screen, cleanup, fireEvent, render } from '@testing-library/react';
import Forbidden from '../../../pages/Forbidden';
import { BrowserRouter } from 'react-router-dom';

describe('forbidden page', () => {
	const view = () =>
		render(
			<BrowserRouter>
				<Forbidden />
			</BrowserRouter>
		);

	afterEach(cleanup);

	it('shows the reason on the page', () => {
		view();

		expect(screen.getByText(/you don't have access/i)).toBeInTheDocument();
	});

	it('render the button properly', () => {
		view();

		expect(screen.getByText(/go back home/i)).toBeInTheDocument();
	});

	it('redirect to home when button clicked', async () => {
		view();

		const btnGoHome = screen.getByText(/go back home/i);

		fireEvent.click(btnGoHome);

		expect(window.location.pathname).toEqual('/');
	});
});
