import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

const SearchableSelect = ({
	selected,
	setSelected,
	query,
	setQuery,
	label,
	data,
	filterProperty,
}) => {
	if (data.length > 0 && typeof data[0] === 'object') {
		if (!filterProperty) {
			throw new Error('Missing `filterProperty` props due to array of objects data on SearchableSelect!');
		}

		if (!data[0][filterProperty]) {
			throw new Error(
				`Expected '${filterProperty}' property in '${JSON.stringify(
					data[0],
					null,
					2
				)}' on SearchableSelect! Make sure the provided 'filterProperty' exist.`
			);
		}
	}

	const filteredData =
		query === ''
			? data
			: data.filter((item) => {
					if (typeof item === 'string') {
						return item
							.toLowerCase()
							.replace(/\s+/g, '')
							.includes(query.toLowerCase().replace(/\s+/g, ''));
					}

					if (typeof item === 'object' && item[filterProperty]) {
						return item[filterProperty]
							.toLowerCase()
							.replace(/\s+/g, '')
							.includes(query.toLowerCase().replace(/\s+/g, ''));
					}
			  });

	return (
		<Combobox value={selected ?? ''} onChange={setSelected}>
			<Combobox.Label className='text-sm font-medium text-gray-900'>
				{label}
			</Combobox.Label>
			<div className='relative mt-1'>
				<Combobox.Button
					className='flex items-center pr-2 border-b-[1px] border-b-blue-gray-200'
					as='div'
				>
					<Combobox.Input
						className='w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none'
						displayValue={(data) => data[filterProperty] ?? data}
						onChange={(e) => setQuery(e.target.value)}
						autoComplete='off'
					/>
					<ChevronUpDownIcon
						className='h-5 w-5 text-gray-400'
						aria-hidden='true'
					/>
				</Combobox.Button>
				<Transition
					as={React.Fragment}
					enter='transition duration-100 ease-out'
					enterFrom='transform scale-95 opacity-0'
					enterTo='transform scale-100 opacity-100'
					leave='transition duration-75 ease-out'
					leaveFrom='transform scale-100 opacity-100'
					leaveTo='transform scale-95 opacity-0'
					afterLeave={() => setQuery('')}
				>
					<Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{filteredData.length === 0 && query !== '' ? (
							<div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
								Nothing found.
							</div>
						) : (
							filteredData.map((data, index) => (
								<Combobox.Option
									key={data.id ?? index}
									className={({ active }) =>
										clsx(
											'relative cursor-default select-none py-2 pl-10 pr-4',
											active ? 'bg-blue-600 text-white' : 'text-gray-900'
										)
									}
									value={data}
								>
									{({ selected, active }) => (
										<React.Fragment>
											<span
												className={clsx(
													'block truncate ',
													selected ? 'font-medium' : 'font-normal'
												)}
											>
												{data[filterProperty] ?? data}
											</span>
											{selected ? (
												<span
													className={clsx(
														'absolute inset-y-0 left-0 flex items-center pl-3',
														active ? 'text-white' : 'text-blue-600'
													)}
												>
													<CheckIcon className='h-5 w-5' aria-hidden='true' />
												</span>
											) : null}
										</React.Fragment>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};

export default SearchableSelect;
