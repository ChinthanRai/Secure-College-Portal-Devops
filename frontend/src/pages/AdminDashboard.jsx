import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({ title: '', code: '', description: '', credits: 0, instructor: '' });
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchCourses();
        fetchRequests();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/courses', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/enrollment/requests', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setRequests(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchCourses();
            setFormData({ title: '', code: '', description: '', credits: 0, instructor: '' });
        } catch (error) {
            alert('Error adding course');
        }
    };

    const handleProcessRequest = async (requestId, action) => {
        try {
            await axios.post('http://localhost:5000/api/enrollment/process', { requestId, action }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert(`Request ${action}ed`);
            fetchRequests();
        } catch (error) {
            alert('Error processing request');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl text-teal-300 font-bold mb-8">Admin Dashboard - Manage Courses</h1>

            {/* Pending Requests Section */}
            <div className="mb-12">
                <h2 className="text-2xl text-white mb-6 border-b border-navy-700 pb-2">Pending Enrollment Requests</h2>
                <div className="grid grid-cols-1 gap-4">
                    {requests.map(req => (
                        <div key={req._id} className="bg-navy-800 p-4 rounded-lg border border-navy-700 flex flex-col md:flex-row justify-between items-center shadow-md">
                            <div className="mb-4 md:mb-0">
                                <p className="text-white font-bold text-lg">{req.student?.name} <span className="text-gray-400 text-sm font-normal">({req.student?.email})</span></p>
                                <p className="text-teal-300">Requesting: {req.course?.title} ({req.course?.code})</p>
                                <p className="text-gray-500 text-xs mt-1">Requested: {new Date(req.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleProcessRequest(req._id, 'approve')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition shadow-lg"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleProcessRequest(req._id, 'reject')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition shadow-lg"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && <p className="text-gray-500 italic">No pending requests.</p>}
                </div>
            </div>

            {/* Add Course Form */}
            <div className="bg-navy-800 p-6 rounded-lg shadow-lg border border-navy-700 mb-8">
                <h2 className="text-xl text-white mb-4">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Code (e.g. MCA101)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="p-2 rounded bg-navy-900 text-white border border-gray-700" required />
                    <input placeholder="Course Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="p-2 rounded bg-navy-900 text-white border border-gray-700" required />
                    <input placeholder="Instructor" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="p-2 rounded bg-navy-900 text-white border border-gray-700" required />
                    <input type="number" placeholder="Credits" value={formData.credits} onChange={e => setFormData({ ...formData, credits: e.target.value })} className="p-2 rounded bg-navy-900 text-white border border-gray-700" required />
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="md:col-span-2 p-2 rounded bg-navy-900 text-white border border-gray-700" required />
                    <button type="submit" className="md:col-span-2 bg-teal-300 text-navy-900 py-2 rounded font-bold hover:bg-teal-400">Add Course</button>
                </form>
            </div>

            {/* Course List */}
            <h2 className="text-2xl text-white mb-6 border-b border-navy-700 pb-2">All Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-navy-800 p-5 rounded-lg border border-navy-700">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white">{course.title}</h3>
                            <span className="bg-teal-300/20 text-teal-300 px-2 py-1 rounded text-sm">{course.code}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                        <div className="text-gray-500 text-xs flex justify-between">
                            <span>Inst: {course.instructor}</span>
                            <span>Credits: {course.credits}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
