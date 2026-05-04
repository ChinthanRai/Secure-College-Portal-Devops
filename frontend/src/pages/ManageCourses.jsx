import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';
import { ArrowLeft, Trash2, BookOpen, AlertCircle } from 'lucide-react';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourses();
            setCourses(data);
        } catch (err) {
            setError('Failed to fetch courses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId, title) => {
        if (window.confirm(`Are you sure you want to delete the course "${title}"? This action cannot be undone.`)) {
            try {
                await courseService.deleteCourse(courseId);
                setCourses(courses.filter(course => course._id !== courseId));
                alert('Course deleted successfully');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete course');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Courses...</div>;

    return (
        <div className="min-h-screen bg-navy-900 p-6 text-gray-100 uppercase-info-optional">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center text-teal-300 hover:text-teal-400 mb-6 transition font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </button>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
                    <button
                        onClick={() => navigate('/admin/create-course')}
                        className="bg-teal-300 text-navy-900 px-6 py-2 rounded-lg hover:bg-teal-400 transition font-bold shadow-lg"
                    >
                        + Add New Course
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900/20 text-red-400 p-4 rounded-lg flex items-center mb-6 border border-red-900/50">
                        <AlertCircle className="w-5 h-5 mr-2" /> {error}
                    </div>
                )}

                <div className="bg-navy-800 rounded-xl shadow-2xl border border-navy-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-navy-900/50 border-b border-navy-700">
                                <th className="p-4 font-semibold text-teal-300">Course Info</th>
                                <th className="p-4 font-semibold text-teal-300">Instructor</th>
                                <th className="p-4 font-semibold text-teal-300">Enrollment</th>
                                <th className="p-4 font-semibold text-teal-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id} className="border-b border-navy-700 hover:bg-navy-700/30 transition">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-100">{course.title}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-tighter">{course.code}</div>
                                    </td>
                                    <td className="p-4 text-gray-300">{course.instructor}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-300">
                                            {course.enrolledCount} / {course.maxSeats}
                                        </div>
                                        <div className="w-24 bg-navy-900 h-1.5 rounded-full mt-1">
                                            <div
                                                className="bg-teal-300 h-1.5 rounded-full"
                                                style={{ width: `${Math.min((course.enrolledCount / course.maxSeats) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(course._id, course.title)}
                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                                            title="Delete Course"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-500">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                        <p className="text-lg">No courses found. Start by creating one.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
