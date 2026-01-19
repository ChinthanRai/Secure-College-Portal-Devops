import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-navy-900 text-white">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                <h3 className="text-teal-300 font-semibold tracking-wide uppercase mb-4">Department of Master of Computer Applications</h3>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">Secure College Management Portal</h1>
                <p className="text-gray-400 max-w-2xl text-lg mb-8">
                    A centralized platform for students, faculty, and administrators to manage academic activities seamlessly.
                </p>
                <div className="flex space-x-4">
                    <Link to="/login" className="bg-teal-300 text-navy-900 px-8 py-3 rounded-full font-bold hover:bg-teal-400 transition shadow-lg">Login</Link>
                    <Link to="/register" className="border border-teal-300 text-teal-300 px-8 py-3 rounded-full font-bold hover:bg-teal-300/10 transition">Sign Up</Link>
                </div>
            </div>

            {/* Features */}
            <div className="container mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
                <div className="bg-navy-800 p-6 rounded-lg shadow-lg border border-navy-700 hover:border-teal-300 transition">
                    <h3 className="text-xl font-bold text-teal-300 mb-2">Role Based Access</h3>
                    <p className="text-gray-400">Secure logic ensuring Admins and Students access only their respective dashboards.</p>
                </div>
                <div className="bg-navy-800 p-6 rounded-lg shadow-lg border border-navy-700 hover:border-teal-300 transition">
                    <h3 className="text-xl font-bold text-teal-300 mb-2">Centralized Management</h3>
                    <p className="text-gray-400">Faculty can manage courses easily, and students can view everything in one place.</p>
                </div>
                <div className="bg-navy-800 p-6 rounded-lg shadow-lg border border-navy-700 hover:border-teal-300 transition">
                    <h3 className="text-xl font-bold text-teal-300 mb-2">Secure & Fast</h3>
                    <p className="text-gray-400">Built with MERN stack using JWT authentication and optimized performance.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
