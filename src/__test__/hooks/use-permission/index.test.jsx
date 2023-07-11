import { cleanup, renderHook } from '@testing-library/react';
import { usePermission, useAuth } from '../../../hooks';
import { PERMISSIONS_CONFIG } from '../../../config';

jest.mock('../../../hooks/use-auth');

describe('usePermission', () => {
	beforeEach(() => {
		useAuth.mockReturnValue({
			auth: {
				permission: [
					{ resource: 'user', canRead: true, canWrite: false },
					{ resource: 'role', canRead: true, canWrite: true },
				],
			},
		});
	});
	afterEach(cleanup);

	it('returns correct permission config', () => {
		const { result } = renderHook(() => usePermission());

		expect(result.current.config).toEqual(PERMISSIONS_CONFIG);
	});

	it('returns correct permission for hasPermission', () => {
		const { result } = renderHook(() => usePermission());

		expect(result.current.hasPermission('user', 'canRead')).toBe(true);
		expect(result.current.hasPermission('user', 'canWrite')).toBe(false);
		expect(result.current.hasPermission('role', 'canRead')).toBe(true);
		expect(result.current.hasPermission('role', 'canWrite')).toBe(true);
		expect(result.current.hasPermission('invalid', 'canRead')).toBe(false);
	});
});
