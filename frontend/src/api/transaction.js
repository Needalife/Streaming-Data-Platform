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

export const getTransactionsByName = async (name) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { name },
        });
        return response.data;
    } catch (error) {
        console.error(`Error searching transactions by name ${name}:`, error);
        return { success: false, data: [], message: error.message };
    }
};

// Delete transaction by ID
export const deleteTransactionById = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return { success: false, message: error.message };
    }
};

// Download transaction by ID as a .txt file
export const downloadTransactionById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}/download`, {
            responseType: 'blob',
        });

        // Create a blob URL and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transaction_${id}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error downloading transaction:', error);
    }
};