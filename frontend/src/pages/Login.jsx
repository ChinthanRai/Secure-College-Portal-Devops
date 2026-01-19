import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.login({ email, password });
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
            window.location.reload();
        } catch (err) {
            alert('Login Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-navy-900">
            <form onSubmit={handleSubmit} className="bg-navy-800 p-8 rounded shadow-md w-96 border border-navy-700">
                <h2 className="text-2xl text-teal-300 mb-6 font-bold text-center">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none" required />
                </div>
                <button type="submit" className="w-full bg-teal-300 text-navy-900 p-2 rounded font-bold hover:bg-teal-400 transition">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
