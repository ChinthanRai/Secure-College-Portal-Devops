import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors
        try {
            const user = await authService.login({ email, password });
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
            window.location.reload();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
            setError(errorMessage);
            alert('Login Failed: ' + errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#0a192f] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <form
                    onSubmit={handleSubmit}
                    className="bg-navy-800/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-navy-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                    <div className="text-center mb-8">
                        <motion.h2
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="text-3xl font-black text-white tracking-tight mb-2 uppercase"
                        >
                            Login
                        </motion.h2>
                        <p className="text-gray-500 text-sm font-medium">Access your secure portal</p>
                    </div>

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-teal-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-teal-300 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@university.edu"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/50 text-white border border-gray-700 outline-none transition-all duration-200 focus:border-teal-300 focus:ring-4 focus:ring-teal-300/10 hover:border-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-teal-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-teal-300 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/50 text-white border border-gray-700 outline-none transition-all duration-200 focus:border-teal-300 focus:ring-4 focus:ring-teal-300/10 hover:border-gray-600"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                        >
                            <p className="text-red-400 text-sm font-medium text-center flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </p>
                        </motion.div>
                    )}

                    <div className="mt-8">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(100,255,218,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full bg-teal-300 text-navy-900 py-3.5 rounded-xl font-black uppercase tracking-widest transition-all duration-200 hover:bg-teal-400 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Authenticate"
                            )}
                        </motion.button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-xs text-gray-500 hover:text-teal-300 transition-colors font-bold uppercase tracking-tighter"
                        >
                            Don't have an account? <span className="text-teal-300 underline decoration-teal-300/30">Register</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
