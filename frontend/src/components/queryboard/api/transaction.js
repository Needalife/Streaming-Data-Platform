// api/transaction.js
import axios from 'axios';

const API_BASE_URL = '/gateway/static/transactions';

export const getTransactions = async ({ all = true, status, minAmount, maxAmount, limit = 10, skip = 0 }) => {
    try {
        const params = { all, status, minAmount, maxAmount, limit, skip };
        const response = await axios.get(`${API_BASE_URL}`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
};

export const getTransactionById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transaction ${id}:`, error);
        return null;
    }
};

export const getFilters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/filters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching filters:', error);
        return null;
    }
};

export const getAvailableDates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dates`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available dates:', error);
        return null;
    }
};

export const healthCheck = async () => {
    try {
        const response = await axios.get('http://localhost:8001/gateway/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        return null;
    }
};
