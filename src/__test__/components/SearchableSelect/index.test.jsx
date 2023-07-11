import { screen, cleanup, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { SearchableSelect } from '../../../Components/Atoms';
import userEvent from '@testing-library/user-event';

describe('Render Searchable Select component properly', () => {
	const mockData = [
		{
			id: 26,
			name: 'Admin',
			access: [
				{
					resource: 'Monitoring',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Download',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Role',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'User',
					can_read: true,
					can_write: true,
				},
			],
		},
		{
			id: 28,
			name: 'President',
			access: [
				{
					resource: 'Monitoring',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Download',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'User',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Role',
					can_read: true,
					can_write: true,
				},
			],
		},
	];

	afterEach(cleanup);

	it('render properly', async () => {
		render(
			<SearchableSelect
				data={mockData}
				filterProperty='name'
				label='Role'
				query=''
				selected={mockData[0]}
				setQuery={() => {}}
				setSelected={() => {}}
			/>
		);

		expect(screen.getByText(/role/i)).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('can be typed and show the options properly', async () => {
		render(
			<SearchableSelect
				data={mockData}
				filterProperty='name'
				label='Role'
				query=''
				selected=''
				setQuery={() => {}}
				setSelected={() => {}}
			/>
		);

		const inputField = screen.getByRole('combobox');

		userEvent.type(inputField, 'admin');

		expect(inputField).toHaveValue('admin');
		expect(await screen.findByRole('listbox')).toBeInTheDocument();
	});

	test('displays all data when query is empty', () => {
		const setSelected = jest.fn();
		const setQuery = jest.fn();

		render(
			<SearchableSelect
				selected={mockData[0]}
				setSelected={setSelected}
				data={mockData}
				query=''
				setQuery={setQuery}
				label='Role'
				filterProperty='name'
			/>
		);

		const inputField = screen.getByRole('combobox');

		fireEvent.click(inputField);

		const options = screen.getAllByRole('option');

		expect(options).toHaveLength(mockData.length);
		expect(options[0]).toHaveTextContent(mockData[0].name);
		expect(options[1]).toHaveTextContent(mockData[1].name);
	});

	test('displays filtered data when query is not empty', () => {
		const setSelected = jest.fn();
		const setQuery = jest.fn();

		render(
			<SearchableSelect
				selected={mockData[0]}
				setSelected={setSelected}
				data={mockData}
				query='Adm'
				setQuery={setQuery}
				label='Role'
				filterProperty='name'
			/>
		);

		const inputField = screen.getByRole('combobox');

		fireEvent.click(inputField);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(1);
		expect(options[0]).toHaveTextContent(/admin/i);
	});

	test('calls setSelected on option selection', () => {
		const setSelected = jest.fn();
		const setQuery = jest.fn();

		render(
			<SearchableSelect
				selected=''
				setSelected={setSelected}
				data={mockData}
				query=''
				setQuery={setQuery}
				label='Role'
				filterProperty='name'
			/>
		);

		const inputField = screen.getByRole('combobox');

		fireEvent.click(inputField);

		const option = screen.getAllByRole('option');

		fireEvent.click(option[0]);

		expect(setSelected).toHaveBeenCalledWith(mockData[0]);
	});
});

describe('Throws error on Searchable Select component properly', () => {
	const mockData = [
		{
			id: 26,
			name: 'Admin',
			access: [
				{
					resource: 'Monitoring',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Download',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Role',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'User',
					can_read: true,
					can_write: true,
				},
			],
		},
		{
			id: 28,
			name: 'President',
			access: [
				{
					resource: 'Monitoring',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Download',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'User',
					can_read: true,
					can_write: true,
				},
				{
					resource: 'Role',
					can_read: true,
					can_write: true,
				},
			],
		},
	];

	afterEach(cleanup);

	it('throws error when filterProperty undefined', async () => {
		expect(() =>
			render(
				<SearchableSelect
					data={mockData}
					label='Role'
					query=''
					selected={mockData[0]}
					setQuery={() => {}}
					setSelected={() => {}}
				/>
			)
		).toThrow(
			'Missing `filterProperty` props due to array of objects data on SearchableSelect!'
		);
	});

	it('throws error when filterProperty is wrong', async () => {
		const filterProperty = 'namee';

		expect(() =>
			render(
				<SearchableSelect
					data={mockData}
					label='Role'
					query=''
					filterProperty={filterProperty}
					selected={mockData[0]}
					setQuery={() => {}}
					setSelected={() => {}}
				/>
			)
		).toThrow(
			`Expected '${filterProperty}' property in '${JSON.stringify(
				mockData[0],
				null,
				2
			)}' on SearchableSelect! Make sure the provided 'filterProperty' exist.`
		);
	});
});
