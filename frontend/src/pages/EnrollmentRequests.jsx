import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import authService from '../services/authService';
import { CheckCircle, XCircle, Clock, Users, BookOpen, Mail, AlertCircle } from 'lucide-react';

const EnrollmentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const user = authService.getCurrentUser();
            const { data } = await axios.get('http://localhost:5000/api/enrollment/requests', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            alert('Failed to load enrollment requests');
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (requestId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this enrollment request?`)) {
            return;
        }

        setProcessing(requestId);
        try {
            const user = authService.getCurrentUser();
            await axios.post('http://localhost:5000/api/enrollment/process',
                { requestId, action },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert(`Request ${action}d successfully!`);
            fetchRequests(); // Refresh the list
        } catch (error) {
            console.error('Failed to process request', error);
            alert('Failed to process request: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy-900 flex items-center justify-center">
                <div className="text-teal-300 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-teal-300 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-medium">Loading Requests...</p>
                </div>
            </div>
        );
    }

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div className="min-h-screen bg-navy-900 p-6 text-gray-100">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Clock className="w-8 h-8 mr-3 text-yellow-500" />
                        Enrollment Requests
                    </h1>
                    <p className="text-gray-400">Review and process pending student enrollment requests</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
                        <p className="text-gray-400 text-sm mb-1">Total Requests</p>
                        <p className="text-2xl font-bold text-white">{requests.length}</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded-xl border border-yellow-500/30">
                        <p className="text-gray-400 text-sm mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-500">{pendingRequests.length}</p>
                    </div>
                    <div className="bg-navy-800 p-4 rounded-xl border border-navy-700">
                        <p className="text-gray-400 text-sm mb-1">Processed</p>
                        <p className="text-2xl font-bold text-teal-300">{requests.length - pendingRequests.length}</p>
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                    {pendingRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <CheckCircle className="w-16 h-16 text-teal-300 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No pending enrollment requests</p>
                            <p className="text-gray-500 text-sm mt-2">All requests have been processed</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-navy-900 border-b border-navy-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Requested</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700">
                                    {pendingRequests.map((request, index) => (
                                        <motion.tr
                                            key={request._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-navy-700/50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center mr-3">
                                                        <Users className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{request.student?.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-400 flex items-center">
                                                            <Mail className="w-3 h-3 mr-1" />
                                                            {request.student?.email || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <BookOpen className="w-4 h-4 mr-2 text-teal-300" />
                                                    <div>
                                                        <div className="font-medium text-white">{request.course?.title || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-400">{request.course?.code || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleProcess(request._id, 'approve')}
                                                        disabled={processing === request._id}
                                                        className="inline-flex items-center px-4 py-2 bg-teal-300/10 text-teal-300 rounded-lg hover:bg-teal-300/20 transition font-bold text-sm disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleProcess(request._id, 'reject')}
                                                        disabled={processing === request._id}
                                                        className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition font-bold text-sm disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* All Requests Section */}
                {requests.length > pendingRequests.length && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-white mb-4">Processed Requests</h2>
                        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {requests.filter(r => r.status !== 'pending').map(request => (
                                    <div key={request._id} className="bg-navy-900 p-4 rounded-lg border border-navy-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{request.student?.name}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${request.status === 'approved'
                                                    ? 'bg-teal-300/10 text-teal-300'
                                                    : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{request.course?.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollmentRequests;
