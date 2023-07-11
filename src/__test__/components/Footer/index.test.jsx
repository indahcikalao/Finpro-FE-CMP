import { render, screen } from '@testing-library/react';
import { Footer } from '../../../Components/Mollecule';

describe('Footer component', () => {
	it('render footer component correctly', () => {
		render(<Footer />);

		expect(screen.getByText(/made with/i)).toBeInTheDocument();
	});
});
