import React from 'react';
import { STORAGE_PREFIX } from '../../config';

export const useLocalStorage = (key) => {
	key = STORAGE_PREFIX + key;

	const get = React.useCallback(() => {
		return JSON.parse(localStorage.getItem(key));
	}, [key]);

	const set = React.useCallback(
		(value) => {
			localStorage.setItem(key, JSON.stringify(value));
		},
		[key]
	);

	const remove = React.useCallback(() => {
		localStorage.removeItem(key);
	}, [key]);

	return { get, set, remove };
};
