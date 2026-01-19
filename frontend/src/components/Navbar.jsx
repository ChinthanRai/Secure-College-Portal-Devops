import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="bg-navy-800 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-teal-300 text-xl font-bold">MCA Portal</Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="text-gray-300 hover:text-white transition">Dashboard</Link>
                            ) : (
                                <Link to="/student" className="text-gray-300 hover:text-white transition">Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
                            <Link to="/register" className="bg-teal-300 text-navy-900 px-4 py-2 rounded font-semibold hover:bg-teal-400 transition">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
