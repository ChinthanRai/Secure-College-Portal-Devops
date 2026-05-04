import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/courses';

const getCourses = async () => {
    const user = authService.getCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createCourse = async (courseData) => {
    const user = authService.getCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };
    const response = await axios.post(API_URL, courseData, config);
    return response.data;
};

const deleteCourse = async (courseId) => {
    const user = authService.getCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${courseId}`, config);
    return response.data;
};

const courseService = {
    getCourses,
    createCourse,
    deleteCourse,
};

export default courseService;
