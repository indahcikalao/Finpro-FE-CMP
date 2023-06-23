import { useRoutes } from 'react-router-dom';
import AdminRoutes from '../admin';
import UserRoutes from '../user';
import { AutoLogout } from '../../Components/Layout';

/* TODO: From backend */
const ROLES = {
	User: 2001,
	Admin: 5150,
};

const AppRoutes = () => {
	/* TODO: From context/storage */
	const auth = ROLES.Admin;

	const routes = auth === ROLES.Admin ? AdminRoutes : UserRoutes;

	const element = useRoutes([...routes]);

	return <AutoLogout>{element}</AutoLogout>;
};

export default AppRoutes;
