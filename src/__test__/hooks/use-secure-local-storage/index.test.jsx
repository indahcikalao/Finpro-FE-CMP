import { renderHook, act } from '@testing-library/react';
import { useSecureLocalStorage } from '../../../hooks';

describe('useSecureLocalStorage', () => {
	const key = 'testKey';

	beforeEach(() => {
		localStorage.clear();
	});

	test('should store and retrieve value from localStorage', () => {
		const { result } = renderHook(() => useSecureLocalStorage(key));

		act(() => {
			result.current.set('testValue');
		});

		expect(result.current.get()).toBe('testValue');
	});

	test('should remove only the assigned key from localStorage', () => {
		localStorage.setItem('someOtherKey', 'someValue');
		const { result } = renderHook(() => useSecureLocalStorage(key));

		act(() => {
			result.current.set('testValue');
			result.current.remove();
		});

		expect(result.current.get()).toBeNull();
		expect(localStorage.getItem('someOtherKey')).toBe('someValue');
	});

	test('should return null if value does not exist in localStorage', () => {
		const { result } = renderHook(() => useSecureLocalStorage(key));

		expect(result.current.get()).toBeNull();
	});
});
