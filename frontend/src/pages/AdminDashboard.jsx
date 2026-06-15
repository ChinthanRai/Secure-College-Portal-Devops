import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import authService from '../services/authService';
import {
    Users, BookOpen, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = authService.getCurrentUser();
                if (user && user.token) {
                    const stats = await adminService.getDashboardStats(user.token);
                    setData(stats);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-400 animate-pulse bg-navy-900 min-h-screen">Loading Dashboard...</div>;
    }

    if (!data) return <div className="p-8 text-center text-red-400 bg-navy-900 min-h-screen">Error loading dashboard data.</div>;

    const COLORS = ['#FBBF24', '#64ffda', '#EF4444']; // Pending, Approved (Teal), Rejected

    return (
        <div className="min-h-screen bg-navy-900 p-6 text-gray-100">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Students"
                        value={data.stats.totalStudents}
                        icon={<Users className="w-8 h-8 text-blue-400" />}
                        color="bg-blue-400/10"
                    />
                    <StatCard
                        title="Active Courses"
                        value={data.stats.activeCourses}
                        icon={<BookOpen className="w-8 h-8 text-teal-300" />}
                        color="bg-teal-300/10"
                    />
                    <StatCard
                        title="Pending Requests"
                        value={data.stats.pendingRequests}
                        icon={<AlertCircle className="w-8 h-8 text-yellow-500" />}
                        color="bg-yellow-500/10"
                    />
                    <StatCard
                        title="Slot Utilization"
                        value={`${data.stats.filledSlots} / ${data.stats.totalSlots}`}
                        icon={<CheckCircle className="w-8 h-8 text-teal-300" />}
                        color="bg-teal-300/10"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Request Status Distribution */}
                    <div className="bg-navy-800 p-6 rounded-xl shadow-lg border border-navy-700">
                        <h2 className="text-lg font-semibold text-teal-300 mb-4">Request Outcomes</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.charts.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.charts.statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip itemStyle={{ color: '#ccd6f6' }} contentStyle={{ backgroundColor: '#112240', border: '1px solid #233554', color: '#ccd6f6' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Student Registration Trends */}
                    <div className="bg-navy-800 p-6 rounded-xl shadow-lg border border-navy-700">
                        <h2 className="text-lg font-semibold text-teal-300 mb-4">Student Registration Growth</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.charts.enrollmentTrends}>
                                    <XAxis dataKey="name" stroke="#8892b0" />
                                    <YAxis stroke="#8892b0" />
                                    <Tooltip
                                        itemStyle={{ color: '#ccd6f6' }}
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#112240', border: '1px solid #233554', color: '#ccd6f6' }}
                                    />
                                    <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} name="New Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Trending Courses Section */}
                <div className="bg-navy-800 p-6 rounded-xl shadow-lg border border-navy-700 mb-8">
                    <h2 className="text-lg font-semibold text-teal-300 mb-4">Trending Courses (Most Enrolled)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.charts.coursePopularity} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#8892b0" />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#8892b0' }} stroke="#8892b0" />
                                    <Tooltip
                                        itemStyle={{ color: '#ccd6f6' }}
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#112240', border: '1px solid #233554', color: '#ccd6f6' }}
                                    />
                                <Legend />
                                <Bar dataKey="students" fill="#64ffda" radius={[0, 4, 4, 0]} name="Enrolled Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dashboard Actions */}
                <div className="bg-navy-800 p-6 rounded-xl shadow-lg border border-navy-700">
                    <h2 className="text-lg font-semibold text-teal-300 mb-4">Dashboard Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => window.location.href = '/admin/create-course'}
                            className="px-6 py-2 bg-teal-300 text-navy-900 rounded-lg hover:bg-teal-400 transition font-bold"
                        >
                            Create New Course
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/manage-courses'}
                            className="px-6 py-2 border border-teal-300 text-teal-300 rounded-lg hover:bg-teal-300/10 transition font-bold"
                        >
                            Manage Courses
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/manage-students'}
                            className="px-6 py-2 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400/10 transition font-bold"
                        >
                            Manage Students
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/requests'}
                            className="px-6 py-2 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500/10 transition font-bold"
                        >
                            Review Requests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl border border-navy-700 shadow-lg flex items-center justify-between bg-navy-800 hover:border-teal-300 transition-all duration-300`}>
        <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

export default AdminDashboard;
