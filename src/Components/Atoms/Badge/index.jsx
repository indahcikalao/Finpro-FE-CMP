import React from 'react';
import clsx from 'clsx';

const badgeTypes = {
	primary: 'bg-blue-100 text-blue-800',
	success: 'bg-green-100 text-green-800',
	danger: 'bg-red-100 text-red-800',
};

const Badge = ({ children, type = 'primary' }) => {
	return (
		<span
			className={clsx(
				'text-xs font-medium mr-2 px-2.5 py-0.5 rounded',
				badgeTypes[type]
			)}
		>
			{children}
		</span>
	);
};

export default Badge;
