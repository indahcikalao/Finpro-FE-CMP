import { Navigate } from 'react-router-dom';
import { usePermission } from '../../../hooks';

/**
 * Higher-order component (HOC) utility for checking user's `can_read` permission of a page.
 * @param {React.Component} Component - The page component to wrap.
 * @param {string} resourceName - The resource name to check permission for. Please use `PERMISSIONS_CONFIG` on the `/config` folder.
 * @returns {React.Component} Wrapped component with permission check.
 * @example
 * // Define a component
 * const UserManagement = () => {
 *   // Component implementation
 * }
 *
 * // Wrap the component with permission check
 * const WrappedComponent = withPermission(UserManagement, 'user');
 *
 * // Export the wrapped component
 *
 * export default WrappedComponent;
 *
 * // or
 *
 * export default withPermission(UserManagement, 'user');
 *
 * // Render the wrapped component
 * <WrappedComponent />
 */
export const withReadPermission = (Component, resourceName) => {
	return function WithPermissionComponent({ ...props }) {
		const { config, hasPermission } = usePermission();

		if (!hasPermission(resourceName, config.access.canRead)) {
			return <Navigate to='/forbidden' />;
		}

		return <Component {...props} />;
	};
};
