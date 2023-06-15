import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import AppRoutes from './routes/root';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/*' element={<AppRoutes />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='*' element={<Navigate to='.' />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
