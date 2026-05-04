import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import adminService from '../services/adminService';
import authService from '../services/authService';
import { Users, Trash2, Search, AlertCircle, CheckCircle, Calendar, Mail } from 'lucide-react';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, student: null });

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user && user.token) {
                const data = await adminService.getAllStudents(user.token);
                setStudents(data.students);
                setFilteredStudents(data.students);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
            alert('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (student) => {
        setDeleteModal({ show: true, student });
    };

    const confirmDelete = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user && user.token && deleteModal.student) {
                await adminService.deleteStudent(deleteModal.student._id, user.token);
                setStudents(students.filter(s => s._id !== deleteModal.student._id));
                setDeleteModal({ show: false, student: null });
                alert('Student deleted successfully');
            }
        } catch (error) {
            console.error('Failed to delete student', error);
            alert('Failed to delete student: ' + (error.response?.data?.message || error.message));
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, student: null });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="text-teal-300 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-teal-300 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-medium">Loading Students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-900 p-6 text-gray-100">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Users className="w-8 h-8 mr-3 text-teal-300" />
                        Manage Students
                    </h1>
                    <p className="text-gray-400">View and manage all registered students</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 bg-navy-800 p-4 rounded-xl border border-navy-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-navy-900 text-white rounded-lg border border-navy-700 focus:border-teal-300 focus:ring-2 focus:ring-teal-300/20 outline-none transition"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
                        <p className="text-gray-400 text-sm mb-1">Total Students</p>
                        <p className="text-2xl font-bold text-white">{students.length}</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
                        <p className="text-gray-400 text-sm mb-1">Filtered Results</p>
                        <p className="text-2xl font-bold text-teal-300">{filteredStudents.length}</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
                        <p className="text-gray-400 text-sm mb-1">Active Search</p>
                        <p className="text-2xl font-bold text-white">{searchTerm ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No students found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-navy-900 border-b border-navy-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Enrolled Courses</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Registered</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700">
                                    {filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={student._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-navy-700/50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-teal-300/10 flex items-center justify-center mr-3">
                                                        <span className="text-teal-300 font-bold">{student.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="font-medium text-white">{student.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-gray-400">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {student.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-400/10 text-blue-400">
                                                    {student.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-white font-bold">{student.enrolledCourses?.length || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {new Date(student.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleDeleteClick(student)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition font-bold text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-navy-800 p-8 rounded-2xl border border-navy-700 max-w-md w-full shadow-2xl"
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Delete Student?</h3>
                            <p className="text-gray-400">
                                Are you sure you want to delete <span className="text-white font-bold">{deleteModal.student?.name}</span>?
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                This will permanently remove the student and all their enrollment requests.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/30 transition font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
