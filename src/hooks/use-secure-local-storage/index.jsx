import React from 'react';
import { Encryption } from '../../utils/lib';
import { STORAGE_PREFIX } from '../../config';

export const useSecureLocalStorage = (key) => {
  key = STORAGE_PREFIX + key;

	const get = React.useCallback(() => {
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    const decryptedData = Encryption.decrypt(data);

		return decryptedData;
	}, [key]);

	const set = React.useCallback(
		(value) => {
      const encrypted = Encryption.encrypt(value);

			localStorage.setItem(key, encrypted);
		},
		[key]
	);

	const remove = React.useCallback(() => {
		localStorage.removeItem(key);
	}, [key]);

	return { get, set, remove };
};
