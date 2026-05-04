import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import { ArrowLeft, Save } from 'lucide-react';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        credits: 3,
        instructor: '',
        maxSeats: 50,
        startDate: '',
        endDate: '',
        enrollmentDeadline: '',
        sessionTimings: ''
    });
    const [selectedDays, setSelectedDays] = useState([]);
    const [sessionTime, setSessionTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const handleDayToggle = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (selectedDays.length === 0) {
            setError("Please select at least one day for the session.");
            setLoading(false);
            return;
        }

        const [hourStr, min] = sessionTime.split(':');
        let hour = parseInt(hourStr);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; 
        const timeFormatted = `${hour}:${min} ${ampm}`;

        const finalSessionTimings = `${selectedDays.join(', ')} at ${timeFormatted}`;

        try {
            await courseService.createCourse({
                ...formData,
                sessionTimings: finalSessionTimings,
                credits: Number(formData.credits),
                maxSeats: Number(formData.maxSeats),
            });
            navigate('/admin'); // Redirect to dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-900 p-6 text-gray-100">
            <div className="max-w-3xl mx-auto bg-navy-800 rounded-xl shadow-xl p-8 border border-navy-700">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center text-teal-300 hover:text-teal-400 mb-6 transition font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </button>

                <h1 className="text-2xl font-bold mb-6 text-white border-b border-navy-700 pb-4">Create New Course</h1>

                {error && <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50 mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Course Code</label>
                            <input type="text" name="code" required value={formData.code} onChange={handleChange}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea name="description" rows="3" required value={formData.description} onChange={handleChange}
                            className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Instructor</label>
                            <input type="text" name="instructor" required value={formData.instructor} onChange={handleChange}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Credits</label>
                            <input type="number" name="credits" required value={formData.credits} onChange={handleChange}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Max Seats</label>
                            <input type="number" name="maxSeats" required value={formData.maxSeats} onChange={handleChange}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Enrollment Deadline</label>
                            <input type="date" name="enrollmentDeadline" required value={formData.enrollmentDeadline} onChange={handleChange} min={today}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                    </div>

                    {/* Session Timings Section */}
                    <div className="bg-navy-900 border border-navy-700 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-400 mb-3">Session Timings</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">Select Days (Required)</label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <label key={day} className="flex items-center space-x-2 cursor-pointer bg-navy-800 px-3 py-1.5 rounded border border-navy-600 hover:border-teal-300/50 transition">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="w-4 h-4 rounded bg-navy-900 border-gray-600 text-teal-400 focus:ring-teal-400 focus:ring-offset-navy-800"
                                            />
                                            <span className="text-sm text-gray-300">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">Select Time (AM/PM) (Required)</label>
                                <input 
                                    type="time" 
                                    required 
                                    value={sessionTime} 
                                    onChange={(e) => setSessionTime(e.target.value)}
                                    className="w-full px-4 py-2 bg-navy-800 border border-navy-600 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">StartDate</label>
                            <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} min={today}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                            <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} min={today}
                                className="w-full px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg focus:ring-2 focus:ring-teal-300 text-gray-100 outline-none" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-navy-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-300 text-navy-900 px-8 py-3 rounded-lg hover:bg-teal-400 transition flex items-center font-bold disabled:opacity-50 shadow-lg"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
