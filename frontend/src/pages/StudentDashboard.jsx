import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchCourses();
        fetchUserData(); // Fetch user to see enrolled courses
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

    const fetchUserData = async () => {
        // Ideally we would have a 'getMe' endpoint, but for now we trust the local storage user or we could add an endpoint
        // To be simpler, let's assume if enrollment is successful we verify manually, 
        // OR we can trust the return of verifyEnrollmentOtp to confirm success.
        // For better UX, let's just track enrolled IDs locally in state if we don't have a 'me' endpoint yet.
    };

    const handleEnrollClick = async (course) => {
        setSelectedCourse(course);
        setMessage('');
        try {
            await axios.post('http://localhost:5000/api/enrollment/generate-otp',
                { courseId: course._id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setShowOtpModal(true);
            alert('OTP sent to your email!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error generating OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await axios.post('http://localhost:5000/api/enrollment/verify-otp',
                { courseId: selectedCourse._id, otp },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert('Enrollment Successful!');
            setShowOtpModal(false);
            setOtp('');
            // Optional: Refresh enrolled list
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            <div className="mb-8">
                <h1 className="text-3xl text-teal-300 font-bold">Student Dashboard</h1>
                <p className="text-gray-400 mt-2">Welcome back, {user?.name}</p>
            </div>

            <h2 className="text-xl text-white mb-6">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-navy-800 p-5 rounded-lg border border-navy-700 hover:transform hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                                <span className="bg-teal-300/20 text-teal-300 px-2 py-1 rounded text-sm">{course.code}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                            <div className="text-gray-500 text-xs flex justify-between border-t border-navy-600 pt-3 mb-4">
                                <span>Inst: {course.instructor}</span>
                                <span>Credits: {course.credits}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleEnrollClick(course)}
                            className="w-full bg-teal-300 text-navy-900 py-2 rounded font-bold hover:bg-teal-400 transition"
                        >
                            Enroll Now
                        </button>
                    </div>
                ))}
                {courses.length === 0 && <p className="text-gray-500">No courses available yet.</p>}
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-navy-800 p-8 rounded-lg shadow-2xl border border-navy-700 w-96">
                        <h3 className="text-xl text-white font-bold mb-4">Enter OTP</h3>
                        <p className="text-gray-400 mb-4 text-sm">Please enter the OTP sent to your email to confirm enrollment in {selectedCourse?.title}.</p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 rounded bg-navy-900 text-white border border-gray-700 mb-4 text-center tracking-widest text-lg"
                            placeholder="123456"
                        />
                        <div className="flex space-x-4">
                            <button onClick={handleVerifyOtp} className="flex-1 bg-teal-300 text-navy-900 py-2 rounded font-bold hover:bg-teal-400">Verify</button>
                            <button onClick={() => setShowOtpModal(false)} className="flex-1 border border-red-500 text-red-500 py-2 rounded font-bold hover:bg-red-500/10">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
