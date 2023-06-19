<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import AppRoutes from './routes/root';
import Tables from './routes/admin/role-management';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<AppRoutes />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='*' element={<Navigate to='.' />} />
				{/* <Route path='/role-management' element={<Tables />} /> */}
			</Routes>
		</BrowserRouter>
	);
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import AppRoutes from "./routes/root";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AppRoutes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="." />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> 57d0eb95f46d3f54759926a43ab0630b77e9a1f1
}

export default App;
