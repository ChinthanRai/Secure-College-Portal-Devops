import axios from 'axios';
const API_URL = 'http://51.20.31.138:5000/api/admin';

const getDashboardStats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/dashboard-stats`, config);
    return response.data;
};

const getAllStudents = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/students`, config);
    return response.data;
};

const deleteStudent = async (studentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(`${API_URL}/students/${studentId}`, config);
    return response.data;
};

const adminService = {
    getDashboardStats,
    getAllStudents,
    deleteStudent,
};

export default adminService;
