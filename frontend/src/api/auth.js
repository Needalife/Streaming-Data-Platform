import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/auth';

// Signup function
export const signup = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

// Signin function
export const signin = async (email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/signin`, { email, password });

        if (res.data.token) {
            return {
                success: true,
                token: res.data.token,
            };
        } else {
            return {
                success: false,
                message: res.data.message || "Signin failed",
            };
        }
    } catch (error) {
        console.error('Error signing in:', error);
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred during signin.",
        };
    }
};