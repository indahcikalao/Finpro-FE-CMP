import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
	const navigate = useNavigate();

	return (
		<div className='fixed top-0 left-0 w-full h-full bg-red-300 grid place-items-center text-white'>
			<div className='text-center space-y-4'>
				<h1 className='font-semibold text-3xl'>Ups, sorry you don't have access to this page!</h1>
				<Button onClick={() => navigate('/')}>Go back home</Button>
			</div>
		</div>
	);
};

export default Forbidden;
