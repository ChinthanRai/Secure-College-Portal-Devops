import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import {
    Users, BookOpen, GraduationCap,
    ArrowRight, Settings, ShieldCheck, Bell,
    Activity, LayoutDashboard, Database, MousePointer2,
    CheckCircle, MessageSquare, Clock, UserCheck
} from 'lucide-react';

const LandingPage = () => {
    const user = authService.getCurrentUser();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    // --- Role-Based Content Sections ---

    const VisitorHome = () => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Hero Section */}
            <div className="container mx-auto px-6 mb-24">
                <div className="relative overflow-hidden rounded-[3rem] bg-navy-800/50 backdrop-blur-sm p-10 md:p-24 border border-navy-700 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-300/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-navy-900 border border-navy-700 mb-8 shadow-xl">
                            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Campus Platform</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            Secure College <br />
                            <span className="text-teal-300">Management Portal</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            A centralized platform for students, faculty, and administrators to manage academic activities efficiently with industry-grade security.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
                            <Link to="/login" className="px-10 py-4 bg-teal-300 text-navy-900 rounded-full font-black uppercase tracking-widest hover:bg-teal-400 transition-all transform hover:scale-105 shadow-xl flex items-center">
                                Login Now <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link to="/register" className="px-10 py-4 border-2 border-teal-300/30 text-teal-300 rounded-full font-black uppercase tracking-widest hover:bg-teal-300/10 transition-all transform hover:scale-105">
                                Join Portal
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="container mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black text-white mb-4">Powerful Core Features</motion.h2>
                    <motion.div variants={itemVariants} className="w-24 h-1.5 bg-teal-300 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={<ShieldCheck />} title="Role-Based Access" desc="Tiered security ensuring users only see what their roles permit." />
                    <FeatureCard icon={<BookOpen />} title="Course Management" desc="Full-lifecycle module management from setup to enrollment." />
                    <FeatureCard icon={<Activity />} title="Secure Authentication" desc="Industry-standard JWT encryption for all active sessions." />
                    <FeatureCard icon={<Database />} title="Centralized Academic Data" desc="One single source of truth for all faculty and student records." />
                    <FeatureCard icon={<MousePointer2 />} title="Smart Enrollment System" desc="Automated slot tracking and real-time request processing." />
                    <FeatureCard icon={<Bell />} title="Automated Notifications" desc="Instant system alerts for approvals and academic updates." />
                </div>
            </section>
        </motion.div>
    );

    const StudentHome = () => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto px-6">
            <div className="relative overflow-hidden rounded-[3rem] bg-navy-800/40 p-10 md:p-20 border border-navy-700 shadow-2xl mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-300/5 blur-[100px] rounded-full" />
                <div className="relative z-10">
                    <motion.div variants={itemVariants} className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-teal-300 rounded-2xl text-navy-900 shadow-lg">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-teal-300 uppercase tracking-[0.2em]">Student Portal Home</h2>
                            <p className="text-white text-3xl font-black tracking-tighter">Welcome, {user?.name}</p>
                        </div>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                        Your Academic Journey, <br /> <span className="text-gray-500 underline decoration-teal-300/30">Simplified.</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <SummaryMiniCard icon={<BookOpen className="w-5 h-5" />} label="Available Courses" value="12 New" />
                        <SummaryMiniCard icon={<CheckCircle className="w-5 h-5" />} label="Enrolled Units" value="4 Modules" />
                        <SummaryMiniCard icon={<Clock className="w-5 h-5" />} label="Next Session" value="Mon, 10:00 AM" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link to="/student" className="px-10 py-5 bg-teal-300 text-navy-900 rounded-full font-black uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center w-fit shadow-2xl">
                            Enter Student Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 text-center lg:text-left">
                <motion.div variants={itemVariants} className="p-10 bg-navy-800/30 border border-navy-700/50 rounded-[2.5rem]">
                    <Bell className="w-12 h-12 text-teal-300 mb-6 mx-auto lg:mx-0" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase">System Updates</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">Stay informed with real-time notifications regarding enrollment approvals, course changes, and academic announcements.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="p-10 bg-navy-800/30 border border-navy-700/50 rounded-[2.5rem]">
                    <MessageSquare className="w-12 h-12 text-teal-300 mb-6 mx-auto lg:mx-0" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase">Quick Support</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">Need help with registration? Our centralized support desk is ready to assist you with any technical or academic queries.</p>
                </motion.div>
            </div>
        </motion.div>
    );

    const AdminHome = () => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto px-6">
            <div className="relative mb-20 overflow-hidden rounded-[2.5rem] bg-navy-800 p-8 md:p-20 border border-navy-700 shadow-2xl">
                {/* Premium Glow Effect */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-300/10 blur-[100px] rounded-full" />

                <div className="relative z-10 max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <motion.div variants={itemVariants} className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                            <Badge icon={<UserCheck className="w-3.5 h-3.5" />} label="Digital Campus" />
                            <Badge icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Secure Logic" />
                            <Badge icon={<div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />} label="Live Portal" success />
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            Admin Control <span className="text-teal-300">Dashboard.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-400 text-xl mb-10 max-w-xl leading-relaxed">
                            Monitor enrollments, manage courses, approve requests, and oversee academic sessions with a centralized command center.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap justify-center md:justify-start gap-5">
                            <Link
                                to="/admin"
                                className="px-10 py-4 bg-teal-300 text-navy-900 rounded-full font-bold hover:bg-teal-400 transition transform hover:scale-105 shadow-[0_0_20px_rgba(100,255,218,0.4)] flex items-center group"
                            >
                                Open Dashboard <LayoutDashboard className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                to="/admin/manage-courses"
                                className="px-10 py-4 border border-teal-300/30 text-teal-300 rounded-full font-bold hover:bg-teal-300/10 transition transform hover:scale-105"
                            >
                                Course Records
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="hidden lg:block flex-1 relative"
                    >
                        <div className="absolute inset-0 bg-teal-300/20 blur-[80px] rounded-full animate-pulse" />
                        <div className="relative bg-navy-900/50 backdrop-blur-xl border border-navy-700/50 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/50" />
                                </div>
                                <Activity className="w-5 h-5 text-teal-300/50" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-navy-700 rounded-full w-3/4 animate-pulse" />
                                <div className="h-4 bg-navy-700 rounded-full w-full animate-pulse delay-75" />
                                <div className="h-4 bg-navy-700 rounded-full w-5/6 animate-pulse delay-150" />
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="h-20 bg-teal-300/5 rounded-2xl border border-teal-300/10 flex flex-col items-center justify-center">
                                        <Users className="w-6 h-6 text-teal-300 mb-1" />
                                        <span className="text-[10px] uppercase font-black text-gray-500">Students</span>
                                    </div>
                                    <div className="h-20 bg-teal-300/5 rounded-2xl border border-teal-300/10 flex flex-col items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-teal-300 mb-1" />
                                        <span className="text-[10px] uppercase font-black text-gray-500">Courses</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
                <AdminStepCard title="User Control" detail="Manage all active accounts" />
                <AdminStepCard title="Course Logic" detail="Configure academic modules" />
                <AdminStepCard title="Audit Matrix" detail="Track system-wide changes" />
            </div>
        </motion.div>
    );

    // --- Main Layout ---

    return (
        <div className="min-h-screen bg-[#0a192f] text-gray-300 selection:bg-teal-300/30 selection:text-teal-300 overflow-x-hidden">
            <main className="pt-16 pb-20">
                {!user && <VisitorHome />}
                {user?.role === 'student' && <StudentHome />}
                {user?.role === 'admin' && <AdminHome />}
            </main>

            {/* Global Footer (Common to all roles) */}
            <footer className="border-t border-navy-700/50 pt-20 pb-12 text-center relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center space-x-2 mb-6">
                        <GraduationCap className="text-teal-300 w-8 h-8" />
                        <span className="text-2xl font-black text-white tracking-tighter uppercase">MCA Portal</span>
                    </div>
                    <p className="text-gray-500 font-bold text-xs mb-2 tracking-[0.3em] uppercase opacity-60">
                        © {new Date().getFullYear()} Secure College Management Portal
                    </p>
                    <div className="text-gray-600 text-sm font-medium">
                        Developed by <span className="text-teal-300 font-bold italic">Chinthan Rai</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Helper Components ---

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div whileHover={{ y: -15 }} className="bg-navy-800/40 backdrop-blur-md border border-navy-700/50 p-10 rounded-[2.5rem] shadow-xl group transition-all duration-500 hover:border-teal-300/40 hover:bg-navy-800/60">
        <div className="mb-8 p-4 bg-navy-900 rounded-2xl inline-block text-teal-300 transform group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-teal-300 transition-colors uppercase tracking-tight">{title}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

const SummaryMiniCard = ({ icon, label, value }) => (
    <div className="bg-navy-900/50 border border-navy-700/80 p-5 rounded-2xl flex items-center space-x-4">
        <div className="p-2.5 bg-navy-800 rounded-xl text-teal-300">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-lg font-bold text-white tracking-tight">{value}</p>
        </div>
    </div>
);

const Badge = ({ icon, label, success }) => (
    <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${success ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-navy-900/50 text-gray-500 border-navy-700'}`}>
        {icon}
        <span>{label}</span>
    </span>
);

const AdminStepCard = ({ title, detail }) => (
    <div className="p-8 bg-navy-800/20 border border-navy-700/30 rounded-3xl hover:bg-navy-800/40 transition-all">
        <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{title}</h4>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{detail}</p>
    </div>
);

export default LandingPage;
