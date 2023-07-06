import { useAuth } from '../use-auth';
import { PERMISSIONS_CONFIG } from '../../config';

export const usePermission = () => {
	const {
		auth: { permission: permissions },
	} = useAuth();

	const config = PERMISSIONS_CONFIG;

	const hasPermission = (resource, access) => {
		const permission = permissions.find((p) =>
			p.resource.toLowerCase().includes(resource)
		);

		return permission[access];
	};

	return { config, hasPermission };
};
