import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', department: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate('/'); // Redirect to landing or login
            window.location.reload();
        } catch (err) {
            alert('Registration Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-navy-900">
            <form onSubmit={handleSubmit} className="bg-navy-800 p-8 rounded shadow-md w-96 border border-navy-700">
                <h2 className="text-2xl text-teal-300 mb-6 font-bold text-center">Register</h2>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input name="name" onChange={handleChange} className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Email</label>
                    <input name="email" type="email" onChange={handleChange} className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Password</label>
                    <input name="password" type="password" onChange={handleChange} className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Department</label>
                    <input
                        name="department"
                        onChange={handleChange}
                        placeholder="e.g., Computer Science"
                        className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Role</label>
                    <select name="role" onChange={handleChange} value={formData.role} className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 focus:border-teal-300 outline-none">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-teal-300 text-navy-900 p-2 rounded font-bold hover:bg-teal-400 transition">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
