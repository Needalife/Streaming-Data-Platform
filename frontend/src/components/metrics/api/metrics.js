import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/metrics';

export const getAllFunctionMetrics = async (functionNames) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                functions: functionNames.join(','),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics for functions:', error);
        return { success: false, data: [], message: error.message };
    }
};