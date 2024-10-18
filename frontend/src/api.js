import axios from 'axios';

// Base URL of transctions
const BASE_URL = 'http://localhost:3000/api/transactions';

export const getAllTransactions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        return { success: false, data: [], message: error.message };
    }
};

export const getLatestTransactionsByAmount = async (amount) => {
    try {
        const response = await axios.get(`${BASE_URL}/latest`, {
            params: { amount },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching the latest ${amount} transactions:`, error);
        return { success: false, data: [], message: error.message };
    }
};

export const getTransactionsByDate = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${BASE_URL}/date-range`, {
            params: { startDate, endDate },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching transactions between ${startDate} and ${endDate}:`, error);
        return { success: false, data: [], message: error.message };
    }
};