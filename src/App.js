import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import AppRoutes from './routes';
import ResetPassword from "./pages/resetPassword";
import { AuthProvider } from './context';
import Forbidden from './pages/Forbidden';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/*' element={<AppRoutes />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/*" element={<Navigate to="." />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
